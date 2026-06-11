// app/components/MediaGallery.jsx
// C'est le composant central (Chef d'orchestre) de la page détail. 
// C'est un Client Component car il pilote toute l'interactivité (tri, likes en direct, ouverture de la Lightbox).

"use client"; // Activation obligatoire du moteur React côté client pour utiliser les Hooks (useState)

import { useState } from 'react';
import MediaCard from './MediaCard';
import Lightbox from './Lightbox';
import { saveLikeToDB } from '../lib/actions'; // Importation de la Server Action pour la persistance BDD

export default function MediaGallery({ medias: initialMedias, photographerName, photographerPrice }) {
  
  /* ==========================================
     1. GESTION DES ÉTATS (STATES)
     ========================================== */
  // On initialise notre état local avec les médias reçus du serveur
  const [medias, setMedias] = useState(initialMedias);
  // Tableau stockant les IDs des photos aimées par l'utilisateur (pour bloquer à un seul like par photo)
  const [likedMediaIds, setLikedMediaIds] = useState([]);
  // Stocke l'index du média actuellement affiché dans la Lightbox (null = Lightbox fermée)
  const [selectedIndex, setSelectedIndex] = useState(null);
  // Stocke le critère de tri actif ('popularity' par défaut)
  const [sortBy, setSortBy] = useState('popularity');

  /* ==========================================
     2. ALGORITHME DE TRI (A LA VOLÉE)
     ========================================== */
  // SOUTENANCE : On ne trie pas dans un useState pour éviter les re-rendus infinis.
  // On trie à la volée sur une copie du tableau ([...medias]) lors de la phase de rendu.
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

  // PIÈGE DE SOUTENANCE ÉVITÉ : On utilise impérativement le tableau TRÉ ("sortedMedias")
  // pour calculer les index suivants/précédents, sinon les flèches afficheraient la mauvaise image !
  const nextMedia = () => {
    // L'opérateur Modulo (%) permet de créer une boucle infinie : arrivé au bout, on repart à 0.
    setSelectedIndex((prev) => (prev + 1) % sortedMedias.length);
  };

  const prevMedia = () => {
    // On ajoute 'sortedMedias.length' avant le modulo pour éviter de tomber sur un index négatif
    setSelectedIndex((prev) => (prev - 1 + sortedMedias.length) % sortedMedias.length);
  };

  /* ==========================================
     4. LOGIQUE DES LIKES (SYNCHRONISATION INTERFACE & BDD)
     ========================================== */
  const handleLikeToggle = async (mediaId) => {
    const isAlreadyLiked = likedMediaIds.includes(mediaId);
    const targetMedia = medias.find((m) => m.id === mediaId);
    if (!targetMedia) return;

    // Calcul de la nouvelle valeur absolue attendue par la fonction du backend
    const newLikesCount = targetMedia.likes + (isAlreadyLiked ? -1 : 1);

    // MISE À JOUR OPTIMISTE : On met à jour l'écran immédiatement pour l'utilisateur
    setMedias((prevMedias) =>
      prevMedias.map((media) =>
        media.id === mediaId ? { ...media, likes: newLikesCount } : media
      )
    );

    // Enregistrement de l'état du clic (Ajout ou suppression de l'ID dans notre liste)
    setLikedMediaIds((prevIds) =>
      isAlreadyLiked ? prevIds.filter((id) => id !== mediaId) : [...prevIds, mediaId]
    );

    // PERSISTANCE : Envoi asynchrone au serveur via notre Server Action qui exploite le script du backend
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
        {/* SOUTENANCE : L'utilisation d'une balise native <select> garantit par défaut 
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
            key={media.id} 
            media={media} 
            photographerName={photographerName}
            onSelect={() => openLightbox(index)} // On passe l'index issu du tableau trié
            isLiked={likedMediaIds.includes(media.id)}
            onLike={() => handleLikeToggle(media.id)}
          />
        ))}
      </section>

      {/* AFFICHAGE CONDITIONNEL DE LA LIGHTBOX */}
      {selectedIndex !== null && (
        <Lightbox 
          media={sortedMedias[selectedIndex]} // Injection du média trié actif
          photographerName={photographerName}
          onClose={closeLightbox}
          onPrev={prevMedia}
          onNext={nextMedia}
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