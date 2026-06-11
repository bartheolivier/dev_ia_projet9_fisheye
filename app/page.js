// app/page.js
// La page d'accueil
// Ce fichier est un Server Component. 
// Il effectue le requêtage de la base de données directement sur le serveur, garantissant une vitesse d'affichage optimale et un excellent référencement (SEO).
// J'ai configuré la page d'accueil comme un Server Component. Cela permet de centraliser la logique de récupération des données avec Prisma directement sur le serveur. 
// Pour coller fidèlement aux exigences graphiques du projet, j'ai implémenté un algorithme de tri 
// qui réaligne les objets de la base de données sur l'ordre exact de la maquette Figma avant d'exécuter le cycle d'affichage. 

import { getAllPhotographers } from './lib/prisma-db';
import Header from './components/Header';
import PhotographerCard from './components/PhotographerCard';

// SOUTENANCE : La fonction est marquée 'async'. Cela permet d'utiliser le mot-clé 'await'
// pour suspendre l'exécution le temps que la base de données SQLite renvoie les données,
// sans bloquer le reste de l'application. Tout se passe côté serveur.
export default async function Home() {
  
  // 1. REQUÊTAGE SERVEUR : On récupère les données brutes directement via Prisma.
  // Pas besoin de 'fetch()', de route d'API intermédiaire ou de 'useEffect' côté client.
  const rawPhotographers = await getAllPhotographers();

  // 2. LOGIQUE MÉTIER / CONFORMTÉ MAQUETTE :
  // La base de données renvoie les photographes dans un ordre aléatoire ou par ID croissant.
  // Pour respecter SCRUPULEUSEMENT l'ordre d'affichage visuel imposé par la maquette Figma
  // (Mimi Keel en premier, etc.), on définit un tableau d'index de référence.
  const mockupOrder = [243, 930, 82, 527, 925, 195];

  // On initialise un tableau vide destiné à recevoir les objets réordonnés
  const photographers = [];

  // Algorithme de tri d'ordonnancement basé sur la maquette :
  // On boucle sur notre tableau de référence (mockupOrder)
  for (let i = 0; i < mockupOrder.length; i++) {
    const currentId = mockupOrder[i];

    // Pour chaque ID de la maquette, on cherche le photographe correspondant dans les données brutes
    const matchingPhotographer = rawPhotographers.find(
      (photographer) => photographer.id === currentId
    );

    // Si on le trouve, on l'ajoute à la fin de notre liste ordonnée
    if (matchingPhotographer) {
      photographers.push(matchingPhotographer);
    }
  }

  return (
    <main>
      {/* RENDU CONDITIONNEL : On informe le composant Header qu'il est sur l'accueil.
        Cela déclenchera l'affichage du titre H1 "Nos photographes" requis pour le SEO de cette page.
      */}
      <Header isHomePage={true} />
      
      {/* SÉMANTIQUE HTML5 : Utilisation de la balise <section> pour regrouper la grille de profils */}
      <section className="photographers-grid">
        {/* BOUCLE DE RENDU DYNAMIQUE : On parcourt le tableau ordonné à l'aide de .map() */}
        {photographers.map((photographer) => (
          /* SOUTENANCE (La prop 'key') : En React, chaque élément généré dans une boucle 
             doit posséder une propriété 'key' unique (ici l'id du photographe). 
             Cela permet au moteur virtuel de React d'identifier précisément quel élément change,
             est ajouté ou supprimé, optimisant ainsi drastiquement les performances de re-rendu.
          */
          <PhotographerCard key={photographer.id} photographer={photographer} />
        ))}
      </section>
    </main>
  );
}