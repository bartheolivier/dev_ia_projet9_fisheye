// app/lib/prisma-db.js
// l'interface base de données
// Ce fichier est la couche d'accès aux données (DAL - Data Access Layer). Il utilise l'ORM Prisma pour dialoguer en JavaScript avec la base de données SQLite physique.
// Pour la gestion des interactions avec la base de données SQLite, j'ai implémenté une architecture découplée respectant les bonnes pratiques de Next.js. 
// Le fichier prisma-db.js fait office de Data Access Layer (couche d'accès aux données). 
// Il encapsule l'intégralité des requêtes à l'aide de l'ORM Prisma, ce qui nous isole du langage SQL brut et sécurise l'application 
// contre les injections SQL grâce au requêtage typé.  
// Afin de lier l'interface utilisateur à cette couche de données de manière sécurisée, 
// j'ai configuré une Server Action (saveLikeToDB) dotée de la directive 'use server'. 
// Ce choix technique moderne permet d'exécuter l'écriture exclusivement sur le serveur. 
// Le client ne fait qu'appeler une fonction asynchrone, sans jamais avoir de visibilité ni d'accès direct sur les identifiants ou le moteur de la base de données, 
// garantissant un niveau de sécurité optimal pour l'application.

import { PrismaClient } from '../generated/prisma/index.js'; // Importation du client Prisma auto-généré

// Instanciation unique du client Prisma. C'est l'objet technique qui gère le pool de connexions 
// vers notre fichier de base de données SQLite.
const prisma = new PrismaClient();

/**
 * SOUTENANCE (Lecture globale) : Récupère l'intégralité des photographes de la table.
 * Équivalent SQL : "SELECT * FROM Photographer;"
 * Utilisé sur la page d'accueil pour générer les cartes de profils[cite: 12, 16].
 */
export const getAllPhotographers = () => prisma.photographer.findMany();

/**
 * SOUTENANCE (Lecture ciblée) : Récupère un unique photographe par son identifiant unique.
 * Équivalent SQL : "SELECT * FROM Photographer WHERE id = id LIMIT 1;"
 * @param {string|number} id - L'ID récupéré depuis les paramètres dynamiques de l'URL[cite: 14, 16]
 */
export const getPhotographer = (id) =>
  prisma.photographer.findUnique({
    // PIÈGE ÉVITÉ : Les paramètres d'URL de Next.js arrivent sous forme de chaînes de caractères (string)[cite: 14].
    // Notre base de données stockant des entiers (INTEGER), l'utilisation de parseInt(id) est 
    // INDISPENSABLE pour éviter un conflit de types et une erreur de requêtage[cite: 16].
    where: { id: parseInt(id) },
  });

/**
 * SOUTENANCE (Lecture filtrée) : Récupère tous les médias (photos/vidéos) liés à un photographe spécifique.
 * Équivalent SQL : "SELECT * FROM Media WHERE photographerId = id;"
 * @param {string|number} photographerId - L'ID du photographe dont on veut extraire la galerie[cite: 16]
 */
export const getAllMediasForPhotographer = (photographerId) =>
  prisma.media.findMany({
    // Utilisation d'une clause de filtrage sémantique "where" pour cibler la clé étrangère (photographerId)[cite: 16]
    where: { photographerId: parseInt(photographerId) },
  });

/**
 * SOUTENANCE (Écriture/Mutation) : Écrase la valeur actuelle des likes d'un média par un nouveau score absolu.
 * Équivalent SQL : "UPDATE Media SET likes = newNumberOfLikes WHERE id = mediaId;"
 * @param {string|number} mediaId - L'identifiant du média à modifier[cite: 16]
 * @param {number} newNumberOfLikes - Le nouveau total absolu calculé par l'application[cite: 16]
 */
export const updateNumberOfLikes = (mediaId, newNumberOfLikes) =>
  prisma.media.update({
    where: { id: parseInt(mediaId) }, // Ciblage strict de la ligne par son ID unique[cite: 16]
    data: { likes: newNumberOfLikes }, // Injection de la nouvelle valeur dans la colonne "likes"[cite: 16]
  });