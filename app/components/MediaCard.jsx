// app/components/MediaCard.jsx
// Ce composant gère l'affichage individuel de chaque photo ou vidéo dans la grille. Il consomme les fonctions transmises par son parent.

import Image from 'next/image';

export default function MediaCard({ media, photographerName, onSelect, isLiked, onLike }) {
  
  // Analyse de la BDD pour détecter s'il s'agit d'un champ image ou vidéo
  const mediaFileName = media.image || media.video;
  const mediaPath = `/${mediaFileName}`; // Les fichiers sont stockés à la racine du dossier public

  return (
    <article className="media-card">
      {/* ACCESSIBILITÉ (Repère 9) : Lien d'ouverture de la Lightbox.
        Conformément aux exigences, on construit un aria-label dynamique : "[Titre de la photo], closeup view".
        Cela donne un contexte clair et précis aux synthèses vocales.
      */}
      <a 
        href="#" 
        aria-label={`${media.title}, closeup view`} 
        className="media-link"
        onClick={(e) => {
          e.preventDefault(); // Annule le comportement par défaut du '#' (qui ferait remonter la page tout en haut)
          onSelect(); // Déclenche l'ouverture dans le composant parent
        }}
      >
        {media.image ? (
          /* OPTIMISATION NEXT.JS : Utilisation de fill + sizes responsives pour supprimer les warnings console */
          <Image 
            src={mediaPath} 
            alt={media.title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="media-thumbnail"
          />
        ) : (
          /* Balise vidéo native pour les fichiers MP4 */
          <video 
            src={mediaPath} 
            title={media.title}
            className="media-thumbnail" 
          />
        )}
      </a>

      {/* Informations sous le média */}
      <div className="media-info">
        {/* ACCESSIBILITÉ (Repère 10) : Titre de l'œuvre sous forme de texte statique */}
        <h2 className="media-title">{media.title}</h2>
        
        <div className="media-likes">
          <span className="like-count">{media.likes}</span>
          
          {/* ACCESSIBILITÉ AVANCÉE (Élément interactif personnalisé) :
            Puisque le cœur est un <span> (élément non-natif), nous devons lui greffer manuellement 
            tous les comportements d'un vrai bouton pour passer les tests d'accessibilité (AChecker) :
            - role="button" : Indique aux lecteurs d'écran qu'il s'agit d'un élément cliquable.
            - tabIndex={0} : Permet d'insérer le cœur dans le flux de tabulation naturelle du clavier (touche Tab).
            - e.stopPropagation() : 🛑 CRUCIAL ! Empêche le clic d'être intercepté par la carte (ce qui ouvrirait la Lightbox).
            - onKeyDown : Permet aux personnes privées de souris de liker en appuyant sur 'Entrée' ou 'Espace'.
          */}
          <span 
            className={`heart-icon ${isLiked ? 'liked' : ''}`} 
            aria-label="likes" 
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              onLike();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onLike();
              }
            }}
          >
            ♥
          </span>
        </div>
      </div>
    </article>
  );
}