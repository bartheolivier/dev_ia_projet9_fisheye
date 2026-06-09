// app/photographer/[id]/page.js
import { getPhotographer, getAllMediasForPhotographer } from '../../lib/prisma-db';
import Header from '../../components/Header';
import Image from 'next/image'; // Importation du composant Image optimisé
import MediaCard from '../../components/MediaCard';

export default async function PhotographerPage({ params }) {
  // 1. On récupère l'ID envoyé dans l'URL
  // Note: Dans les versions très récentes de Next.js, params est une promesse
  const { id } = await params;

  // 2. On interroge la base de données avec cet ID
  const photographer = await getPhotographer(id);
  const medias = await getAllMediasForPhotographer(id);

  // Sécurité : si quelqu'un tape un faux ID dans l'URL, on affiche une erreur
  if (!photographer) {
    return <h1>Photographe introuvable</h1>;
  }

  // 3. Construction du chemin de la photo de profil
  const portraitPath = `/assets/photographers/ID/${photographer.portrait}`;

  // Calcul du total des likes en additionnant les likes de chaque média
  const totalLikes = medias.reduce((acc, currentMedia) => acc + currentMedia.likes, 0);

  return (
    <main>
      <Header />
      
      {/* L'en-tête spécifique au photographe */}
      <section className="photographer-header">
        <div className="photographer-info">
          <h1 className="name">{photographer.name}</h1>
          <p className="location">{photographer.city}, {photographer.country}</p>
          <p className="tagline">{photographer.tagline}</p>
        </div>
        
        {/* Ajout du aria-label "Contact Me" demandé dans l'annotation 4 */}
        <button className="contact-button" aria-label="Contact Me">
          Contactez-moi
        </button>
        
        <div className="portrait-container">
          <Image 
            src={portraitPath} 
            alt={photographer.name} /* Annotation 5 : Nom du photographe */
            width={200} 
            height={200} 
            className="portrait"
          />
        </div>
      </section>

      {/* La grille de médias */}
      <section className="media-grid">
        {medias.map((media) => (
          <MediaCard 
            key={media.id} 
            media={media} 
            photographerName={photographer.name} 
          />
        ))}
      </section>

      {/* L'encart flottant en bas à droite */}
      <aside className="sticky-stats">
        <div className="total-likes">
          {totalLikes} 
          <span className="heart-icon" aria-label="likes">♥</span> {/* Annotation 11 */}
        </div>
        <span>{photographer.price}€ / jour</span>
      </aside>
      
    </main>
  );
}