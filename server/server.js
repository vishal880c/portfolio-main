
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Admin password
const ADMIN_PASSWORD = "sona123";

// Create uploads folder if not exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Upload image + category + password check
app.post("/upload", upload.single("image"), (req, res) => {
  const { password, category } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const filename = req.file.filename;

  // Save image metadata
  const dataPath = "./uploads/data.json";
  let data = [];

  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath));
  }

  data.push({
    filename,
    category,
    uploadedAt: new Date()
  });

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.json({
    url: `http://localhost:5000/${filename}`,
    category
  });
});

// Serve images
app.use("/", express.static("uploads"));

// Get all images + metadata
app.get("/gallery", (req, res) => {
  const dataPath = "./uploads/data.json";

  if (!fs.existsSync(dataPath)) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync(dataPath));
  res.json(data);
});

// Delete Image
app.delete("/delete/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = `./uploads/${filename}`;
  const dataPath = "./uploads/data.json";

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  let data = JSON.parse(fs.readFileSync(dataPath));
  data = data.filter((item) => item.filename !== filename);

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.json({ message: "Image deleted" });
});

app.listen(5000, () =>
  console.log("🔥 Backend running on http://localhost:5000")
);
