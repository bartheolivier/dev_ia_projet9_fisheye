// app/components/Lightbox.jsx
// Ce composant gère le carrousel d'affichage plein écran.
// C'est un Client Component ("use client") car il interagit directement avec l'API globale du navigateur (window)[cite: 111, 115].

"use client";

import { useEffect } from 'react';
import Image from 'next/image';

// RECEPTION DES PROPS : Le parent 'MediaGallery' fournit l'objet média actif à afficher 
// ainsi que les "télécommandes" (fonctions de rappel) pour modifier l'état central.
export default function Lightbox({ media, photographerName, onClose, onPrev, onNext }) {
  
  /* ==========================================
     1. ÉCOUTEUR DE CLAVIER GLOBAL (ACCESSIBILITÉ WCAG)
     ========================================== */
  useEffect(() => {
    // Cette fonction intercepte les pressions de touches sur l'ensemble de la page.
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();    // Conforme WCAG : Fermeture immédiate via la touche Échap
      if (e.key === 'ArrowRight') onNext(); // Conforme WCAG : Média suivant via la flèche droite 
      if (e.key === 'ArrowLeft') onPrev();  // Conforme WCAG : Média précédent via la flèche gauche 
    };
    
    // ENREGISTREMENT : On attache l'écouteur à l'objet global 'window' pour capter le clavier 
    // même si l'utilisateur n'a pas le focus précis sur un bouton.
    window.addEventListener('keydown', handleKeyDown);
    
    // SOUTENANCE (Gestion des fuites de mémoire / Anti-Memory Leak) :
    // La fonction retournée est la fonction de nettoyage (cleanup). Elle s'exécute AUTOMATIQUEMENT
    // lorsque le composant est démonté (fermé). Si on omettait ce 'removeEventListener', l'écouteur 
    // resterait actif en tâche de fond sur le navigateur, créant des bugs majeurs et ralentissant le site.
    return () => window.removeEventListener('keydown', handleKeyDown);

    // TABLEAU DE DÉPENDANCES : React ré-attache proprement l'écouteur si l'une de ces fonctions de rappel 
    // change de référence, garantissant que la Lightbox appelle toujours la version la plus fraîche des fonctions.
  }, [onClose, onNext, onPrev]);

  // SÉCURITÉ COMPOSANT : Si par accident la Lightbox est appelée sans données valides, 
  // on retourne 'null' pour empêcher le crash de l'application React.
  if (!media) return null;

  // Détermination dynamique de l'extension du fichier (Image ou Vidéo)
  const mediaFileName = media.image || media.video;
  const mediaPath = `/${mediaFileName}`;

  return (
    /* Cliquer sur le fond déclenche 'onClose' pour fermer le carrousel */
    <div className="lightbox-backdrop" onClick={onClose}>
      
      {/* ACCESSIBILITÉ (Repère 1) : Conteneur de dialogue conforme aux exigences WCAG.
        - role="dialog" : Indique explicitement aux lecteurs d'écrans qu'il s'agit d'une fenêtre superposée.
        - aria-label : Donne un nom clair à cette zone d'affichage pour la synthèse vocale d'Orca.
        - e.stopPropagation() : MÉCANISME CRUCIAL (voir explications ci-dessous).
      */}
      <div 
        className="lightbox-dialog" 
        role="dialog" 
        aria-label="image closeup view"
        onClick={(e) => e.stopPropagation()} // STOP BUBBLING : Empêche la fermeture quand on clique sur la photo ou ses boutons
      >
        {/* ACCESSIBILITÉ (Repère 4) : Bouton précédent doté d'un label textuel invisible mais lu par la synthèse vocale */}
        <button className="lightbox-arrow left" aria-label="Previous image" onClick={onPrev}>
          ‹
        </button>
        
        <div className="lightbox-content">
          <div className="lightbox-media-container">
            {/* AFFICHAGE CONDITIONNEL POLYMORPHE : Le composant s'adapte à la nature du média */}
            {media.image ? (
              /* CAS N°1 : L'OBJET EST UNE IMAGE */
              /* PERFORMANCE OPTIMISÉE NEXT.JS : 
                - fill & sizes : Permet un affichage responsive fluide sans déformer le ratio de l'œuvre.
                - priority : Dispositif anti-lazy-loading. Cette image étant au premier plan pour l'utilisateur, 
                             'priority' force son téléchargement immédiat en haute définition (Optimisation LCP).
                - alt : Respect strict des spécifications client (Le alt contient le titre exact de la photo).
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
              /* CAS N°2 : L'OBJET EST UNE VIDÉO */
              /* LECTEUR NATIF ACCESSIBLE : L'ajout de l'attribut 'controls' permet aux personnes naviguant au clavier 
                 de mettre en pause ou de régler le volume de la vidéo de façon totalement native.
              */
              <video 
                src={mediaPath} 
                title={media.title} 
                controls 
                autoPlay 
                className="lightbox-asset"
              />
            )}
          </div>
          {/* ACCESSIBILITÉ (Repère 3) : Titre visible de l'œuvre reproduit sous le média actif */}
          <h3 className="lightbox-title">{media.title}</h3>
        </div>

        {/* CONTROLES DE DROITE : Superposition ordonnée en CSS pour regrouper la fermeture et la progression */}
        <div className="lightbox-right-controls">
          {/* ACCESSIBILITÉ (Repère 6) : Bouton de fermeture doté de sa description accessible */}
          <button className="lightbox-close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
          {/* ACCESSIBILITÉ (Repère 5) : Bouton suivant */}
          <button className="lightbox-arrow right" aria-label="Next image" onClick={onNext}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}