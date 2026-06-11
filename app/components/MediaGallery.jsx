// app/components/MediaGallery.jsx
"use client";

import { useState } from 'react';
import MediaCard from './MediaCard';
import Lightbox from './Lightbox';
import { saveLikeToDB } from '../lib/actions';

export default function MediaGallery({ medias: initialMedias, photographerName, photographerPrice }) {
  const [medias, setMedias] = useState(initialMedias);
  const [likedMediaIds, setLikedMediaIds] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  // 1. Nouvel état pour mémoriser le critère de tri (Popularité par défaut)
  const [sortBy, setSortBy] = useState('popularity');

  // 2. Algorithme de tri appliqué à la volée sur une copie du tableau
  const sortedMedias = [...medias].sort((a, b) => {
    if (sortBy === 'popularity') {
      return b.likes - a.likes; // Du plus liké au moins liké
    }
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date); // Du plus récent au plus ancien
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title); // Ordre alphabétique A-Z
    }
    return 0;
  });

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  // 3. Navigation sécurisée basée sur le tableau trié
  const nextMedia = () => {
    setSelectedIndex((prev) => (prev + 1) % sortedMedias.length);
  };

  const prevMedia = () => {
    setSelectedIndex((prev) => (prev - 1 + sortedMedias.length) % sortedMedias.length);
  };

  const handleLikeToggle = async (mediaId) => {
    const isAlreadyLiked = likedMediaIds.includes(mediaId);
    const targetMedia = medias.find((m) => m.id === mediaId);
    if (!targetMedia) return;

    const newLikesCount = targetMedia.likes + (isAlreadyLiked ? -1 : 1);

    setMedias((prevMedias) =>
      prevMedias.map((media) =>
        media.id === mediaId ? { ...media, likes: newLikesCount } : media
      )
    );

    setLikedMediaIds((prevIds) =>
      isAlreadyLiked ? prevIds.filter((id) => id !== mediaId) : [...prevIds, mediaId]
    );

    try {
      await saveLikeToDB(mediaId, newLikesCount);
    } catch (error) {
      console.error("Erreur de synchronisation avec la base de données", error);
    }
  };

  const totalLikes = medias.reduce((acc, currentMedia) => acc + currentMedia.likes, 0);

  return (
    <>
      {/* 4. Zone du menu de sélection conforme à la matrice d'accessibilité (Repères 7 & 8) */}
      <div className="sort-wrapper">
        <label htmlFor="sort-select" id="sort-label" className="sort-label">Trier par</label>
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

      {/* 5. Affichage de la grille basée sur le tableau trié */}
      <section className="media-grid">
        {sortedMedias.map((media, index) => (
          <MediaCard 
            key={media.id} 
            media={media} 
            photographerName={photographerName}
            onSelect={() => openLightbox(index)} // Transmet l'index trié correct
            isLiked={likedMediaIds.includes(media.id)}
            onLike={() => handleLikeToggle(media.id)}
          />
        ))}
      </section>

      {/* 6. Affichage du média actif basé sur le tableau trié */}
      {selectedIndex !== null && (
        <Lightbox 
          media={sortedMedias[selectedIndex]} 
          photographerName={photographerName}
          onClose={closeLightbox}
          onPrev={prevMedia}
          onNext={nextMedia}
        />
      )}

      <aside className="sticky-stats">
        <div className="total-likes">
          {totalLikes} <span className="heart-icon" aria-label="likes">♥</span>
        </div>
        <span>{photographerPrice}€ / jour</span>
      </aside>
    </>
  );
}