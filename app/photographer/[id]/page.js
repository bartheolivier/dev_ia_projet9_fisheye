// app/photographer/[id]/page.js
import { getPhotographer, getAllMediasForPhotographer } from '../../lib/prisma-db';
import Header from '../../components/Header';
import Image from 'next/image'; // Importation du composant Image optimisé
import MediaGallery from '../../components/MediaGallery';
import ContactWidget from '../../components/ContactWidget';

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
        
        <ContactWidget photographerName={photographer.name} />
        
        <div className="portrait-container">
          <Image 
            src={portraitPath} 
            alt={photographer.name} /* Annotation 5 : Nom du photographe */
            fill /* <-- Remplace width et height par fill */
            sizes="200px" /* <-- Ajouté ici */
            className="portrait"
          />
        </div>
      </section>

      {/* La grille de médias dynamique et sa Lightbox intégrée */}
      {/* La galerie gère désormais l'intégralité des interactions et des statistiques */}
      <MediaGallery 
        medias={medias} 
        photographerName={photographer.name} 
        photographerPrice={photographer.price} 
      />
      
    </main>
  );
}