// app/components/PhotographerCard.jsx
// Ce composant est un Server Component. Il génère les vignettes des photographes sur la page d'accueil.

import Link from 'next/link';
import Image from 'next/image'; // Importation du composant d'optimisation natif de Next.js

export default function PhotographerCard({ photographer }) {
  // Chemin de l'image en fonction des données fournies par la BDD
  const imagePath = `/assets/photographers/ID/${photographer.portrait}`;

  return (
    <article className="photographer-card">
      {/* ACCESSIBILITÉ : L'attribut aria-label={photographer.name} englobe l'image et le titre.
        Cela crée une grande zone cliquable propre et évite qu'un lecteur d'écran ne lise deux fois 
        le nom du photographe (une fois pour l'image, une fois pour le texte).
      */}
      {/* On enveloppe la photo et le nom du photographe dans la balise link
      cela permet de gerer le clic sur l'image ou le nom du photographe (pas besoin d'ecouteur onClick) qui va declancher le systeme de routage propre à Next
      */}
      <Link href={`/photographer/${photographer.id}`} aria-label={photographer.name}>
        <div className="img-container">
          {/* Remarques :
            - 'fill' indique à l'image d'occuper 100% de son conteneur parent (.img-container).
            - 'sizes="200px"' indique à Next.js la taille exacte de rendu pour qu'il génère un srcSet adapté, il va ainsi choisir la version de l'image la plus legere 
               et la plus adaptée ce qui va accelerer le chargement du site.
            - 'priority' force le préchargement car ces images apparaissent "above the fold" (au-dessus de la ligne de flottaison) au chargement de l'accueil.
            - 'alt=""' (vide) : Le nom du photographe étant déjà dicté par l'aria-label du <Link>, 
               on laisse l'alt vide pour éviter que le lecteur d'écran ne le repete inutilement.
            - Au sujet de la ligne de flottaison: La ligne de flottaison (above the fold), c'est la ligne imaginaire en dessous de laquelle le contenu d'une page web 
            devient invisible tant que l'utilisateur n'a pas fait défiler l'écran (scrollé). Tout ce qui est au-dessus de cette ligne doit être visuellement impeccable 
            et charger ultra-rapidement, car c'est la première chose que le visiteur et les outils de notation de Google analysent.
            Par défaut, Next.js applique du lazy-loading (chargement différé) sur toutes les images du site. 
            Cela signifie qu'il attend que l'utilisateur fasse défiler la page (scrolle) pour télécharger les images juste avant qu'elles n'apparaissent à l'écran. 
            Mais pour les images situées au-dessus de la ligne de flottaison (les premiers photographes que l'on voit immédiatement sans scroller), 
            ce comportement par défaut est un piège : l'image met du temps à apparaître, ce qui crée un effet de vide désagréable.
          */}
          <Image 
            src={imagePath} 
            alt="" 
            fill
            sizes="200px"
            priority
            className="portrait"
          />
        </div>
        <h2 className="name">{photographer.name}</h2>
      </Link>
      
      {/* Informations textuelles sémantiques secondaires */}
      <div className="info">
        <p className="location">{photographer.city}, {photographer.country}</p>
        <p className="tagline">{photographer.tagline}</p>
        <p className="price">{photographer.price}€/jour</p>
      </div>
    </article>
  );
}