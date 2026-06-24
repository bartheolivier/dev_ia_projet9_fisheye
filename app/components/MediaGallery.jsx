// app/components/MediaGallery.jsx
// C'est le composant central de la page détail photographe. Il gere la galerie des oeuvres du photographe
// C'est un Client Component car il pilote toute l'interactivité (tri, likes en direct, ouverture de la Lightbox).
// Remarques:
// La vignette de la photo (MediaCard) et le grand carrousel (Lightbox) sont des composants frères: ils ne peuvent pas se parler directement
// La solution, c'est de "remonter l'état" dans leur parent commun : MediaGallery. 
// C'est lui qui détient la mémoire de l'application et qui redistribue les ordres à ses enfants.

"use client"; // Activation obligatoire du moteur React côté client pour utiliser les Hooks (useState)

import { useState } from 'react';
import MediaCard from './MediaCard';
import Lightbox from './Lightbox';
import { saveLikeToDB } from '../lib/actions'; // Importation de la Server Action pour la persistance BDD

export default function MediaGallery({ medias: initialMedias, photographerName, photographerPrice }) {
  
  /* ==========================================
     1. GESTION DES ÉTATS (STATES)
     ========================================== */
  // La mémoire:
  // Au sommet du composant, on installe 4 variables d'état (useState): 4 registres de mémoire
  // On initialise notre état local avec les médias reçus du serveur
  // La liste de toutes les photos/vidéos. Utile pour pouvoir augmenter ou diminuer les compteurs de likes.
  const [medias, setMedias] = useState(initialMedias);
  // Tableau stockant les IDs des photos aimées par l'utilisateur (pour bloquer à un seul like par photo)
  // Un carnet de notes qui liste les identifiants (id) des photos que l'utilisateur a aimées. 
  // Ça évite qu'un utilisateur clique 50 fois sur le même cœur pour gonfler artificiellement les scores.
  const [likedMediaIds, setLikedMediaIds] = useState([]);
  // Stocke l'index du média actuellement affiché dans la Lightbox
  // Si c'est null, ça veut dire que le carrousel est fermé. Si c'est 0, c'est la première photo, etc.
  const [selectedIndex, setSelectedIndex] = useState(null);
  // Stocke le critère de tri actif ('popularity' par défaut)
  // Un mot-clé ('popularity', 'date' ou 'title') qui se met à jour dès que l'utilisateur change le choix du menu déroulant.
  const [sortBy, setSortBy] = useState('popularity');

  /* ==========================================
     2. ALGORITHME DE TRI (A LA VOLÉE)
     La galerie est ordonnée à chaque rendu du composant. L'ajout d'un like peut modifié l'ordre mais comme la galerie est triée
     systematiquement avec ce calcul à la volée, cela sera pris en compte automatiquement
     ========================================== */
  /*
  Pour trier les médias, on crée d'abord une copie du tableau pour ne pas modifier les données d'origine de React.
  Ensuite, on utilise la méthode .sort() qui compare les éléments deux par deux. 
  Pour la popularité et les dates, on utilise une soustraction numérique b - a pour obtenir un ordre décroissant. 
  Pour les titres, on utilise la fonction localeCompare() qui permet un tri alphabétique de A à Z 
  et qui prend correctement en compte les caractères accentués de la langue française.
  */
  // On trie sur une copie du tableau ([...medias]) lors de la phase de rendu.Le tableau d'origine reste intact et sécurisé.
  const sortedMedias = [...medias].sort((a, b) => {
    if (sortBy === 'popularity') {
      return b.likes - a.likes; // Tri numérique décroissant (du plus liké au moins liké)
    }
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date); // Tri chronologique décroissant (du plus récent au plus ancien)
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title); // Tri alphabétique (A-Z) gérant les accents grâce à localeCompare
    }
    return 0;
  });

  /* ==========================================
     3. LOGIQUE DU CARROUSEL (LIGHTBOX)
     ========================================== */
  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  // On utilise impérativement le tableau trié ("sortedMedias")
  // pour calculer les index suivants/précédents, sinon les flèches afficheraient la mauvaise image !
  const nextMedia = () => {
    // L'opérateur Modulo (%) permet de créer une boucle infinie : arrivé au bout, on repart à 0.
    // Ex avec 3 photos (longueur 3) : si on est sur la photo index 2 -> (2 + 1) % 3 = reste 0 -> Retour au début !
    setSelectedIndex((prev) => (prev + 1) % sortedMedias.length);
  };

  const prevMedia = () => {
    // On ajoute 'sortedMedias.length' avant le modulo pour éviter de tomber sur un index négatif
    // Ex : si on est à l'index 0 -> (0 - 1 + 3) % 3 = 2 % 3 = reste 2 -> On bascule bien sur la dernière photo !
    setSelectedIndex((prev) => (prev - 1 + sortedMedias.length) % sortedMedias.length);
  };

  /* ==========================================
     4. LOGIQUE DES LIKES (SYNCHRONISATION INTERFACE & BDD)
     ========================================== */
  /* Analyse de la situation actuelle:
   isAlreadyLiked : On va regarder dans notre carnet de notes (likedMediaIds) si l'ID de la photo sur laquelle on vient de cliquer y figure déjà.
      - Si oui : Cela veut dire que l'utilisateur avait déjà aimé cette photo. Ce nouveau clic signifie donc qu'il veut retirer son like.
      - Si non : C'est un nouveau like.
   targetMedia : On va chercher la photo en question dans notre liste globale (medias) pour connaître son nombre actuel de likes.
  */
  const handleLikeToggle = async (mediaId) => {
    const isAlreadyLiked = likedMediaIds.includes(mediaId);
    const targetMedia = medias.find((m) => m.id === mediaId);

    // Calcul de la nouvelle valeur absolue attendue par la fonction du backend
    // On utilise une condition ternaire (? :) :
    // Si isAlreadyLiked est vrai on fait -1.
    // Si isAlreadyLiked est faux on fait +1.
    const newLikesCount = targetMedia.likes + (isAlreadyLiked ? -1 : 1);

    // On met à jour l'écran immédiatement pour l'utilisateur
    setMedias((prevMedias) =>
      prevMedias.map((media) =>
        media.id === mediaId ? { ...media, likes: newLikesCount } : media
      )
    );
    /* Remarque:
    En React, on n'a pas le droit de modifier directement un tableau (interdit de faire media.likes = newLikesCount). 
    Il faut obligatoirement créer un nouveau tableau et remplacer l'ancien.
    - prevMedias.map(...) : On prend l'ancienne liste de photos et on crée une copie en la passant en revue, photo par photo.
    - media.id === mediaId ? : Est-ce que cette photo est celle qui a été cliquée ?
        - Si oui : { ...media, likes: newLikesCount }=> On duplique la photo mais on écrase son compteur de likes avec notre nouvelle valeur.
        - Si non : : media => On laisse la photo exactement telle qu'elle était.
    */


    // Enregistrement de l'état du clic (Ajout ou suppression de l'ID dans notre liste)
    // si la photo était déjà aimée, on la retire du carnet avec un .filter(). Sinon, on l'ajoute à la fin du tableau ([...prevIds, mediaId]).
    setLikedMediaIds((prevIds) =>
      isAlreadyLiked ? prevIds.filter((id) => id !== mediaId) : [...prevIds, mediaId]
    );

    // PERSISTANCE : Envoi asynchrone au serveur via notre Server Action qui exploite le script du backend pour modifier la ligne dans SQLite
    // 'saveLikeToDB' est une Server Action ('use server') : elle s'exécute exclusivement côté serveur.
    // Cela permet de modifier SQLite via Prisma sans jamais exposer les identifiants de notre BDD ni créer d'API REST publique côté client.
    try {
      await saveLikeToDB(mediaId, newLikesCount);
    } catch (error) {
      console.error("Échec de l'enregistrement en BDD", error);
    }
  };

  // CALCUL DU CUMUL : On additionne dynamiquement tous les likes du tableau local.
  // L'encart du bas se mettra à jour en temps réel à chaque clic sur un cœur.
  const totalLikes = medias.reduce((acc, currentMedia) => acc + currentMedia.likes, 0);

  return (
    <>
      {/* ACCESSIBILITÉ (Repères 7 & 8) : Zone du menu de sélection de tri */}
      <div className="sort-wrapper">
        <label htmlFor="sort-select" id="sort-label" className="sort-label">Trier par</label>
        {/* L'utilisation d'une balise native <select> garantit par défaut 
          une conformité totale avec les critères d'accessibilité WCAG. Le clavier (touches fléchées),
          le focus visuel, et l'annonce par les lecteurs d'écrans sont natifs et infaillibles.
        */}
        <select 
          id="sort-select" 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-labelledby="sort-label"
        >
          <option value="popularity">Popularité</option>
          <option value="date">Date</option>
          <option value="title">Titre</option>
        </select>
      </div>

      {/* GRILLE DES MÉDIAS */}
      
      <section className="media-grid">
        {sortedMedias.map((media, index) => (
          <MediaCard 
            // ACCESSIBILITÉ & PERFORMANCE : Clé unique requise par React pour identifier chaque élément de la liste et optimiser les re-rendus
            key={media.id} 

            // DONNÉES : Transmission de l'objet média complet (titre, source, compteur de likes) 
            media={media} 
  
            // LOGIQUE MÉTIER : Passage du nom du photographe pour reconstruire dynamiquement le chemin des fichiers multimédias 
            photographerName={photographerName}
  
            // INTERACTIVITÉ / CALLBACK : Fonction de rappel pour transmettre l'index de la photo cliquée au parent et ouvrir la Lightbox
            onSelect={() => openLightbox(index)} 
  
            // ÉTAT : Évaluation booléenne dynamique pour savoir si cette photo spécifique a déjà été aimée par l'utilisateur
            isLiked={likedMediaIds.includes(media.id)}
  
            // SYNCHRONISATION / CALLBACK : Fonction de rappel pour notifier le parent qu'un clic sur le cœur nécessite une mise à jour UI et BDD
            onLike={() => handleLikeToggle(media.id)} 
          />
        ))}
      </section>

      {/* AFFICHAGE CONDITIONNEL DE LA LIGHTBOX */}
      {/* INTERRUPTEUR LOGIQUE (&&) : Le composant Lightbox n'est instancié dans le DOM que si selectedIndex n'est pas nul */}
      {selectedIndex !== null && (
        <Lightbox 
          // On passe uniquement le média actif extrait du tableau trié en fonction de l'index mémorisé
          media={sortedMedias[selectedIndex]} 
          photographerName={photographerName}
          
          // FONCTIONS DE RAPPEL (CALLBACKS) : On transmet les télécommandes à la Lightbox pour qu'elle puisse modifier l'état du parent au clic/clavier
          onClose={closeLightbox} // Éteint l'interrupteur en remettant l'index à null
          onPrev={prevMedia}       // Modifie l'index vers le média précédent
          onNext={nextMedia}       // Modifie l'index vers le média suivant
        />
      )}

      {/* ENCART FLOTTANT DES STATISTIQUES STATIQUES/DYNAMIQUES */}
      <aside className="sticky-stats">
        <div className="total-likes">
          {totalLikes} <span className="heart-icon" aria-label="likes">♥</span>
        </div>
        <span>{photographerPrice}€ / jour</span>
      </aside>
    </>
  );
}