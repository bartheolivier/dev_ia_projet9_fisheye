// app/components/MediaGallery.jsx
"use client";

import { useState } from 'react';
import MediaCard from './MediaCard';
import Lightbox from './Lightbox';

export default function MediaGallery({ medias, photographerName }) {
  // L'état stocke l'index du média sélectionné (null = fermé)
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  // Aller au média suivant (et revenir au début si on dépasse la fin)
  const nextMedia = () => {
    setSelectedIndex((prev) => (prev + 1) % medias.length);
  };

  // Aller au média précédent (et basculer à la fin si on descend sous 0)
  const prevMedia = () => {
    setSelectedIndex((prev) => (prev - 1 + medias.length) % medias.length);
  };

  return (
    <>
      {/* On affiche notre grille habituelle */}
      <section className="media-grid">
        {medias.map((media, index) => (
          <MediaCard 
            key={media.id} 
            media={media} 
            photographerName={photographerName}
            onSelect={() => openLightbox(index)} // Donne son index au clic
          />
        ))}
      </section>

      {/* Si un index est actif, on affiche la Lightbox */}
      {selectedIndex !== null && (
        <Lightbox 
          media={medias[selectedIndex]} 
          photographerName={photographerName}
          onClose={closeLightbox}
          onPrev={prevMedia}
          onNext={nextMedia}
        />
      )}
    </>
  );
}