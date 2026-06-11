// app/components/Lightbox.jsx
// Ce composant gère le carrousel plein écran. Il implémente les écouteurs globaux du clavier réclamés par les spécifications du projet.

"use client";

import { useEffect } from 'react';
import Image from 'next/image';

export default function Lightbox({ media, photographerName, onClose, onPrev, onNext }) {
  
  /* ==========================================
     ÉCOUTEUR DE CLAVIER GLOBAL (EFFETS DIRECTS)
     ========================================== */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();    // Fermeture immédiate via la touche Échap
      if (e.key === 'ArrowRight') onNext(); // Média suivant via la flèche droite
      if (e.key === 'ArrowLeft') onPrev();  // Média précédent via la flèche gauche
    };
    
    // On attache l'écouteur d'événement à l'objet global window du navigateur
    window.addEventListener('keydown', handleKeyDown);
    
    // SOUTENANCE (Nettoyage de mémoire / Anti-Memory Leak) :
    // La fonction return est la fonction de nettoyage (cleanup). Elle s'exécute AUTOMATIQUEMENT
    // lorsque la Lightbox se ferme. Si on oubliait de faire ce removeEventListener, l'écouteur resterait
    // actif en tâche de fond, ralentissant le navigateur et provoquant des bugs sur les autres pages.
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Sécurité : si aucun média n'est sélectionné, le composant ne génère aucun code HTML
  if (!media) return null;

  const mediaFileName = media.image || media.video;
  const mediaPath = `/${mediaFileName}`;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      {/* ACCESSIBILITÉ (Repère 1) : Conteneur de dialogue conforme aux WCAG.
        Le role="dialog" isole la fenêtre. Le onClick={(e) => e.stopPropagation()} évite 
        que la Lightbox ne se ferme si on clique au milieu de la photo.
      */}
      <div 
        className="lightbox-dialog" 
        role="dialog" 
        aria-label="image closeup view"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ACCESSIBILITÉ (Repère 4) : Bouton précédent doté d'un label textuel explicite */}
        <button className="lightbox-arrow left" aria-label="Previous image" onClick={onPrev}>
          ‹
        </button>
        
        <div className="lightbox-content">
          <div className="lightbox-media-container">
            {media.image ? (
              /* ACCESSIBILITÉ & PERFORMANCE (Repère 2) : 
                - alt={media.title} : Le texte alternatif est obligatoirement le titre de la photo.
                - 'priority' : Force Next.js à charger immédiatement le fichier HD à l'écran sans transition floue.
              */
              <Image 
                src={mediaPath} 
                alt={media.title} 
                fill
                sizes="(max-width: 1200px) 100vw, 80vw"
                className="lightbox-asset"
                priority 
              />
            ) : (
              /* Lecteur vidéo complet s'il s'agit d'un MP4 */
              <video 
                src={mediaPath} 
                title={media.title} 
                controls 
                autoPlay 
                className="lightbox-asset"
              />
            )}
          </div>
          {/* ACCESSIBILITÉ (Repère 3) : Titre textuel statique affiché sous le média actif */}
          <h3 className="lightbox-title">{media.title}</h3>
        </div>

        {/* Bloc regroupant les commandes de droite (Superposition CSS de la croix et de la flèche) */}
        <div className="lightbox-right-controls">
          {/* ACCESSIBILITÉ (Repère 6) : Bouton de fermeture du dialogue */}
          <button className="lightbox-close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
          {/* ACCESSIBILITÉ (Repère 5) : Bouton média suivant */}
          <button className="lightbox-arrow right" aria-label="Next image" onClick={onNext}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}