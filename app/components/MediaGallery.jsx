// app/components/MediaGallery.jsx
"use client";

import { useState } from 'react';
import MediaCard from './MediaCard';
import Lightbox from './Lightbox';
import { saveLikeToDB } from '../lib/actions'; // Importation de notre action

export default function MediaGallery({ medias: initialMedias, photographerName, photographerPrice }) {
  // 1. DÉCLARATION DES ÉTATS (C'est ce qui manquait !)
  // On place les médias dans un état local pour pouvoir modifier leurs likes en direct
  const [medias, setMedias] = useState(initialMedias);
  // On crée un tableau pour mémoriser les IDs des médias que l'utilisateur a aimés
  const [likedMediaIds, setLikedMediaIds] = useState([]);
  // L'état stocke l'index du média sélectionné pour la Lightbox (null = fermé)
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Gestion de la Lightbox
  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  // Aller au média suivant (et revenir au début si on dépasse la fin)
  const nextMedia = () => {
    setSelectedIndex((prev) => (prev + 1) % medias.length);
  };

  // Aller au média précédent (et basculer à la fin si on descend sous 0)
  const prevMedia = () => {
    setSelectedIndex((prev) => (prev - 1 + medias.length) % medias.length);
  };

  // Gestion du clic sur le cœur
  const handleLikeToggle = async (mediaId) => {
    const isAlreadyLiked = likedMediaIds.includes(mediaId);
    
    // Trouver le média actuel pour calculer sa future valeur
    const targetMedia = medias.find((m) => m.id === mediaId);
    if (!targetMedia) return;

    // Calcul de la nouvelle valeur absolue attendue par la BDD
    const newLikesCount = targetMedia.likes + (isAlreadyLiked ? -1 : 1);

    // Mise à jour de l'affichage (Interface + Encart du bas)
    setMedias((prevMedias) =>
      prevMedias.map((media) =>
        media.id === mediaId ? { ...media, likes: newLikesCount } : media
      )
    );

    // Enregistrement de l'état du clic (pour savoir si le cœur doit changer de couleur)
    setLikedMediaIds((prevIds) =>
      isAlreadyLiked ? prevIds.filter((id) => id !== mediaId) : [...prevIds, mediaId]
    );

    // Envoi de la valeur calculée à la fonction du backend
    try {
      await saveLikeToDB(mediaId, newLikesCount);
    } catch (error) {
      console.error("Erreur de synchronisation avec la base de données", error);
    }
  };

  // Calcul du total général pour l'encart
  const totalLikes = medias.reduce((acc, currentMedia) => acc + currentMedia.likes, 0);

  return (
    <>
      {/* On affiche notre grille de cartes */}
      <section className="media-grid">
        {medias.map((media, index) => (
          <MediaCard 
            key={media.id} 
            media={media} 
            photographerName={photographerName}
            onSelect={() => openLightbox(index)} // Donne son index au clic
            isLiked={likedMediaIds.includes(media.id)}
            onLike={() => handleLikeToggle(media.id)}
          />
        ))}
      </section>

      {/* Si un index est actif, on affiche la Lightbox */}
      {selectedIndex !== null && (
        <Lightbox 
          media={medias[selectedIndex]} 
          photographerName={photographerName}
          onClose={closeLightbox}
          onPrev={prevMedia}
          onNext={nextMedia}
        />
      )}

      {/* L'encart des statistiques */}
      <aside className="sticky-stats">
        <div className="total-likes">
          {totalLikes} <span className="heart-icon" aria-label="likes">♥</span>
        </div>
        <span>{photographerPrice}€ / jour</span>
      </aside>
    </>
  );
}