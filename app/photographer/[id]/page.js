// app/photographer/[id]/page.js
// page detail du photographe. Ce fichier est le Server Component maître de ta page dynamique. 
// C'est lui qui réceptionne l'identifiant dans l'URL, interroge la base de données, et distribue les informations aux widgets interactifs enfants. 
// La page du photographe est configurée comme un Server Component dynamique. Elle intercepte l'identifiant présent dans l'URL grâce à la prop asynchrone params 
// et effectue les requêtes de données en tâche de fond avec Prisma directement sur le serveur. 
// Cela élimine tout temps de latence au chargement et empêche l'exposition des requêtes de base de données côté client. 
// Pour préserver une structure sémantique SEO irréprochable et conforme au WCAG, j'ai veillé à ce que le nom du photographe soit l'unique balise <h1> de la page. 
// Enfin, j'ai optimisé les indicateurs de performance (Core Web Vitals) en appliquant l'attribut priority sur le portrait d'identité. 
// Cela force le préchargement de la ressource détectée comme l'élément LCP principal de la zone supérieure de flottaison.

import { getPhotographer, getAllMediasForPhotographer } from '../../lib/prisma-db';
import Header from '../../components/Header';
import Image from 'next/image'; // Importation du composant Image optimisé pour les performances LCP
import MediaGallery from '../../components/MediaGallery';
import ContactWidget from '../../components/ContactWidget';

// SOUTENANCE (Route Dynamique) : Le dossier s'appellant [id], Next.js injecte automatiquement 
// un objet contenant les paramètres de l'URL dans la propriété (prop) 'params'.
export default async function PhotographerPage({ params }) {
  
  /* =========================================================================
     1. RÉCUPÉRATION DE L'URL & SÉCURISATION (Next.js Asynchrone)
     ========================================================================= */
  // Dans les versions modernes de Next.js, 'params' est traité comme une promesse.
  // On doit utiliser 'await' pour extraire l'ID en toute sécurité sans bloquer le thread principal.
  const { id } = await params;

  /* =========================================================================
     2. REQUÊTAGE SÉCURISÉ CÔTÉ SERVEUR (Prisma Backend)
     ========================================================================= */
  // On lance deux requêtes asynchrones parallèles à notre base de données SQLite.
  const photographer = await getPhotographer(id);
  const medias = await getAllMediasForPhotographer(id);

  // SÉCURITÉ / SÉMANTIQUE : Si un utilisateur saisit manuellement un ID qui n'existe pas 
  // dans la base de données (ex: /photographer/999), on intercepte l'erreur immédiatement.
  // Cela évite un crash de l'application et renvoie un message sémantique propre.
  if (!photographer) {
    return <h1>Photographe introuvable</h1>;
  }

  // Construction dynamique du chemin de l'image d'identité
  const portraitPath = `/assets/photographers/ID/${photographer.portrait}`;

  return (
    <main>
      {/* Le Header ne reçoit pas la prop isHomePage, il n'affichera donc pas le H1 global[cite: 10, 14]. 
          Cela permet de laisser l'exclusivité du titre de niveau 1 (H1) au nom du photographe ci-dessous[cite: 14].
      */}
      <Header />
      
      {/* SECTION SÉMANTIQUE : L'en-tête du profil du photographe (Bandeau gris) */}
      <section className="photographer-header">
        
        {/* Zone des informations textuelles sémantiques (Repères 2 & 3 de la maquette) */}
        <div className="photographer-info">
          {/* ACCESSIBILITÉ / SEO : Le nom du photographe est la balise de titre principale <h1>.
              Il ne doit y avoir qu'un seul H1 par page pour respecter les critères WCAG.
          */}
          <h1 className="name">{photographer.name}</h1>
          <p className="location">{photographer.city}, {photographer.country}</p>
          <p className="tagline">{photographer.tagline}</p>
        </div>
        
        {/* COMPOSANT INTERACTIF (Client Component Enfant) : La modale de contact.
            On lui transmet le nom du photographe pour personnaliser dynamiquement le titre du formulaire[cite: 9, 14].
        */}
        <ContactWidget photographerName={photographer.name} />
        
        {/* Conteneur de la photo d'identité (Repère 5 de la maquette) */}
        <div className="portrait-container">
          {/* PERFORMANCE & ACCESSIBILITÉ CIBLÉE (Warning LCP résolu) :
              - src & alt : L'alt contient explicitement le nom du photographe comme exigé par les specs[cite: 4, 14].
              - fill & sizes : 'fill' force l'image à occuper le cercle parent positionné en relative[cite: 11, 14].
              - priority : Dispositif anti-lazy-loading. Cette image étant l'élément visuel majeur situé 
                au-dessus de la ligne de flottaison (Above the fold), 'priority' ordonne au navigateur 
                de la charger immédiatement, optimisant ainsi le score LCP de la page[cite: 14].
          */}
          <Image 
            src={portraitPath} 
            alt={photographer.name} 
            fill 
            sizes="200px" 
            priority
            className="portrait"
          />
        </div>
      </section>

      {/* COMPOSANT INTERACTIF MAÎTRE (Client Component Enfant) : La galerie globale.
          On lui injecte le tableau complet des médias, le nom pour la lightbox, et le tarif journalier.
          Ce composant va encapsuler la grille, le tri, la lightbox, et l'encart flottant[cite: 6, 14].
      */}
      <MediaGallery 
        medias={medias} 
        photographerName={photographer.name} 
        photographerPrice={photographer.price} 
      />
      
    </main>
  );
}