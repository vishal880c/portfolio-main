import React, { useEffect } from "react";

export default function Gallery() {
  const images = [
   
  ];

  useEffect(() => {
    const cards = document.querySelectorAll(".gallery-card");

    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove("opacity-0", "scale-90");
        card.classList.add("opacity-100", "scale-100");
      }, index * 200); // delay animation for each card
    });
  }, []);

  return (
    <section id="gallery" className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-10 text-center">Gallery</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="
                gallery-card 
                rounded-2xl overflow-hidden shadow-lg
                transform transition-all duration-700 ease-out
                opacity-0 scale-90
                hover:scale-105 hover:shadow-xl
              "
            >
              <img
                src={img}
                alt={`Gallery ${index}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
