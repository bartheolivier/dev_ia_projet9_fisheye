// app/components/PhotographerCard.jsx
import Link from 'next/link';

export default function PhotographerCard({ photographer }) {
  // Construction du chemin de l'image. 
  // À adapter selon l'emplacement exact de tes images dans ton dossier public.
  const imagePath = `/assets/photographers/ID/${photographer.portrait}`;

  return (
    <article className="photographer-card">
      {/* Le lien englobe l'image et le nom pour rendre toute la zone cliquable */}
      <Link href={`/photographer/${photographer.id}`} aria-label={photographer.name}>
        <div className="img-container">
          <img 
            src={imagePath} 
            alt={`Portrait de ${photographer.name}`} 
            className="portrait"
          />
        </div>
        <h2 className="name">{photographer.name}</h2>
      </Link>
      
      <div className="info">
        <p className="location">{photographer.city}, {photographer.country}</p>
        <p className="tagline">{photographer.tagline}</p>
        <p className="price">{photographer.price}€/jour</p>
      </div>
    </article>
  );
}