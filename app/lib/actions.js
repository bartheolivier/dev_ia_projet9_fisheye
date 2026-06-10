// app/lib/actions.js
'use server';

// On importe la fonction officielle préparée par le backend
import { updateNumberOfLikes } from './prisma-db';

/**
 * Enregistre le nouveau nombre de likes en base de données
 * @param {number} mediaId - L'identifiant du média à modifier
 * @param {number} newLikesCount - La nouvelle valeur totale des likes
 */
export async function saveLikeToDB(mediaId, newLikesCount) {
  try {
    // Appel direct de la fonction du backend scolaire
    return await updateNumberOfLikes(mediaId, newLikesCount);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du like :", error);
    throw new Error("Impossible de mettre à jour le compteur.");
  }
}