// app/lib/actions.js
// La server action
// Ce fichier centralise les actions de modification des données exécutées à la demande du client, mais propulsées à 100% sur le serveur.

'use server'; // SOUTENANCE : Directive Next.js cruciale. Elle indique au framework que toutes les fonctions 
              // de ce fichier sont des "Server Actions". Next.js va automatiquement générer un endpoint 
              // sécurisé en arrière-plan. Cela nous évite de devoir créer un fichier d'API complet 
              // (comme une route du type app/api/likes/route.js) pour gérer une simple interaction.

// On importe la fonction officielle d'écriture préparée par l'équipe backend
import { updateNumberOfLikes } from './prisma-db';

/**
 * SOUTENANCE : Enregistre le nouveau nombre de likes en base de données de manière asynchrone.
 * @param {number} mediaId - L'identifiant du média à modifier[cite: 15]
 * @param {number} newLikesCount - La nouvelle valeur totale calculée à lui attribuer[cite: 15]
 */
export async function saveLikeToDB(mediaId, newLikesCount) {
  try {
    // SÉCURITÉ & ROBUSTESSE : On encapsule l'appel dans un bloc try/catch (programmation défensive).
    // Si la base de données est temporairement verrouillée ou inaccessible, l'erreur est interceptée 
    // proprement dans la console du serveur au lieu de faire planter brutalement l'application client[cite: 15].
    
    // Appel direct de la fonction de mise à jour du fichier d'interface Prisma[cite: 15]
    return await updateNumberOfLikes(mediaId, newLikesCount);
  } catch (error) {
    // Log visible uniquement côté serveur (dans le terminal du développeur, pas dans le navigateur de l'utilisateur)[cite: 15]
    console.error("Erreur lors de la mise à jour du like :", error);
    
    // On lève une erreur explicite pour informer le composant client que la persistance a échoué[cite: 15]
    throw new Error("Impossible de mettre à jour le compteur.");
  }
}