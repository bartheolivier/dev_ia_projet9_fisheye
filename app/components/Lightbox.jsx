// app/components/Lightbox.jsx
"use client";

import { useEffect } from 'react';
import Image from 'next/image';

export default function Lightbox({ media, photographerName, onClose, onPrev, onNext }) {
  
  // Écoute dynamique du clavier pour la navigation et la fermeture
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    // Nettoyage de l'écouteur lorsque la modale se ferme
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!media) return null;

  const mediaFileName = media.image || media.video;
  const mediaPath = `/${mediaFileName}`;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      {/* Repère 1 : Conteneur de dialogue avec son nom accessible */}
      <div 
        className="lightbox-dialog" 
        role="dialog" 
        aria-label="image closeup view"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique sur l'image
      >
        {/* Repère 4 : Bouton précédent */}
        <button className="lightbox-arrow left" aria-label="Previous image" onClick={onPrev}>
          ‹
        </button>
        
        <div className="lightbox-content">
          <div className="lightbox-media-container">
            {media.image ? (
              /* Repère 2 : Image avec son titre en texte alternatif */
              <Image 
                src={mediaPath} 
                alt={media.title} 
                fill
                sizes="(max-width: 1200px) 100vw, 80vw"
                className="lightbox-asset"
                priority // Force le chargement rapide de l'image ouverte
              />
            ) : (
              <video 
                src={mediaPath} 
                title={media.title} 
                controls 
                autoPlay 
                className="lightbox-asset"
              />
            )}
          </div>
          {/* Repère 3 : Texte statique du titre sous le média */}
          <h3 className="lightbox-title">{media.title}</h3>
        </div>

        <div className="lightbox-right-controls">
          {/* Repère 6 : Bouton de fermeture en haut à droite */}
          <button className="lightbox-close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
          {/* Repère 5 : Bouton suivant décalé en dessous du X */}
          <button className="lightbox-arrow right" aria-label="Next image" onClick={onNext}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}