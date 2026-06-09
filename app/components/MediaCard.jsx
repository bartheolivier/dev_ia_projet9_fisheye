// app/components/MediaCard.jsx
import Image from 'next/image';

export default function MediaCard({ media, photographerName }) {
  
  // 1. On récupère le nom exact du fichier (image ou vidéo) depuis la base de données
  const mediaFileName = media.image || media.video;
  
  // 2. On indique que le fichier se trouve directement à la racine du dossier "public"
  const mediaPath = `/${mediaFileName}`;

  return (
    <article className="media-card">
       {/* ... Le reste du code (le JSX) ne change absolument pas ! ... */}
      {/* Annotation 9 : Le lien vers la Lightbox (qui ne fait rien pour l'instant)
        Nom accessible demandé : "[Titre], closeup view"
      */}
      <a 
        href="#" 
        aria-label={`${media.title}, closeup view`} 
        className="media-link"
      >
        {media.image ? (
          <Image 
            src={mediaPath} 
            alt={media.title} 
            width={350} 
            height={300} 
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
          {/* Annotation 11 : aria-label="likes" pour l'icône */}
          <span className="heart-icon" aria-label="likes" role="button">
            ♥
          </span>
        </div>
      </div>
    </article>
  );
}