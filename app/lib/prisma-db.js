// app/lib/prisma-db.js
// L'interface de la base de données
// Le fichier prisma-db.js fait office de Data Access Layer (couche d'accès aux données). 
// Il encapsule l'intégralité des requêtes à l'aide de l'ORM Prisma, ce qui nous isole du langage SQL brut.
//
// Note d'architecture : Les fonctions de ce fichier (comme updateNumberOfLikes) ne sont pas appelées 
// directement par les composants clients. Elles sont encapsulées et sécurisées en arrière-plan 
// par les Server Actions du fichier actions.js, garantissant qu'aucun accès direct à la BDD ne soit exposé au navigateur.

import { PrismaClient } from '../generated/prisma/index.js'; // Importation du client Prisma auto-généré

// Instanciation unique du client Prisma. C'est l'objet technique qui gère le pool de connexions 
// vers notre fichier de base de données SQLite.
const prisma = new PrismaClient();

/**
 * Récupère l'intégralité des photographes de la table.
 * Équivalent SQL : "SELECT * FROM Photographer;"
 * Utilisé sur la page d'accueil pour générer les cartes de profils.
 */
export const getAllPhotographers = () => prisma.photographer.findMany();

/**
 * Récupère un photographe par son identifiant unique.
 * Équivalent SQL : "SELECT * FROM Photographer WHERE id = id LIMIT 1;"
 * @param {string|number} id - L'ID récupéré depuis les paramètres dynamiques de l'URL
 */
export const getPhotographer = (id) =>
  prisma.photographer.findUnique({
    // Les paramètres d'URL de Next.js arrivent sous forme de chaînes de caractères (string).
    // Notre base de données stockant des entiers (INTEGER), l'utilisation de parseInt(id) est 
    // INDISPENSABLE pour éviter un conflit de types et une erreur de requêtage.
    where: { id: parseInt(id) },
  });

/**
 * Récupère tous les médias (photos/vidéos) liés à un photographe spécifique.
 * Équivalent SQL : "SELECT * FROM Media WHERE photographerId = id;"
 * @param {string|number} photographerId - L'ID du photographe dont on veut extraire la galerie
 */
export const getAllMediasForPhotographer = (photographerId) =>
  prisma.media.findMany({
    // Utilisation d'une clause de filtrage sémantique "where" pour cibler la clé étrangère (photographerId)
    where: { photographerId: parseInt(photographerId) },
  });

/**
 * Écrase la valeur actuelle des likes d'un média par un nouveau score absolu.
 * Équivalent SQL : "UPDATE Media SET likes = newNumberOfLikes WHERE id = mediaId;"
 * @param {string|number} mediaId - L'identifiant du média à modifier
 * @param {number} newNumberOfLikes - Le nouveau total absolu calculé par l'application
 */
export const updateNumberOfLikes = (mediaId, newNumberOfLikes) =>
  prisma.media.update({
    where: { id: parseInt(mediaId) }, // Ciblage strict de la ligne par son ID unique
    data: { likes: newNumberOfLikes }, // Injection de la nouvelle valeur dans la colonne "likes"
  });