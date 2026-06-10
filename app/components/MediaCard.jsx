// app/components/MediaCard.jsx
import Image from 'next/image';

export default function MediaCard({ media, photographerName, onSelect, isLiked, onLike }) {
  
  // 1. On récupère le nom exact du fichier (image ou vidéo) depuis la base de données
  const mediaFileName = media.image || media.video;
  
  // 2. On indique que le fichier se trouve directement à la racine du dossier "public"
  const mediaPath = `/${mediaFileName}`;

  return (
    <article className="media-card">
      {/* Au clic, on bloque le lien '#' et on déclenche la sélection */}
      {/* Annotation 9 : Le lien vers la Lightbox
        Nom accessible demandé : "[Titre], closeup view"
      */}
      <a 
        href="#" 
        aria-label={`${media.title}, closeup view`} 
        className="media-link"
        onClick={(e) => {
          e.preventDefault();
          onSelect();
        }}
      >
        {media.image ? (
          <Image 
            src={mediaPath} 
            alt={media.title} 
            fill /* <-- Remplace width et height par fill */
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" /* <-- Ajouté ici */
            className="media-thumbnail"
          />
        ) : (
          <video 
            src={mediaPath} 
            title={media.title}
            className="media-thumbnail" 
          />
        )}
      </a>

      {/* Le texte et les likes en dessous */}
      <div className="media-info">
        {/* Annotation 10 : Texte statique pour le titre */}
        <h2 className="media-title">{media.title}</h2>
        
        <div className="media-likes">
          <span className="like-count">{media.likes}</span>
          {/* Le cœur devient pleinement interactif et accessible */}
          <span 
            className={`heart-icon ${isLiked ? 'liked' : ''}`} 
            aria-label="likes" 
            role="button"
            tabIndex={0} // Permet de cibler le cœur avec la touche Tabulation
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // 🛑 EMPÊCHE d'ouvrir la Lightbox !
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