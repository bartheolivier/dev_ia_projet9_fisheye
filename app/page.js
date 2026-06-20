// app/page.js
// La page d'accueil du site
// Elle est configurée comme un Server Component. Cela permet de centraliser la logique de récupération des données avec Prisma directement sur le serveur. 
// Pour coller fidèlement aux exigences graphiques du projet, j'ai implémenté un algorithme de tri 
// qui réaligne les objets de la base de données sur l'ordre exact de la maquette Figma avant d'exécuter le cycle d'affichage. 

import { getAllPhotographers } from './lib/prisma-db';
import Header from './components/Header';
import PhotographerCard from './components/PhotographerCard';

// La fonction est marquée 'async'. Cela permet d'utiliser le mot-clé 'await'
// pour suspendre l'exécution le temps que la base de données SQLite renvoie les données,
// sans bloquer le reste de l'application. Tout se passe côté serveur.
export default async function Home() {
  
  // 1. REQUÊTAGE SERVEUR : On récupère les données brutes directement via Prisma.
  // Pas besoin de 'fetch()' ou de route d'API .
  const rawPhotographers = await getAllPhotographers();


  // 2. CONFORMITÉ MAQUETTE : Réalignement des données sur l'ordre visuel de Figma
  const mockupOrder = [243, 930, 82, 527, 925, 195];

  const photographers = mockupOrder
    .map((id) => rawPhotographers.find((p) => p.id === id))
    .filter((p) => p !== undefined);
    
  return (
    <main>
      {/* RENDU CONDITIONNEL : On informe le composant enfant Header qu'il est sur l'accueil.
        Cela déclenchera l'affichage du titre H1 "Nos photographes" requis pour le SEO de cette page.
      */}
      <Header isHomePage={true} />
      
      {/* SÉMANTIQUE HTML5 : Utilisation de la balise <section> pour regrouper la grille de profils */}
      <section className="photographers-grid">
        {/* BOUCLE DE RENDU DYNAMIQUE : On parcourt le tableau ordonné à l'aide de .map() */}
        {photographers.map((photographer) => (
          /* La prop 'key' : En React, chaque élément généré dans une boucle 
             doit posséder une propriété 'key' unique (ici l'id du photographe). 
             Cela permet au moteur virtuel de React d'identifier précisément quel élément change,
             est ajouté ou supprimé, optimisant ainsi les performances de re-rendu.
          */
          <PhotographerCard key={photographer.id} photographer={photographer} />
        ))}
      </section>
    </main>
  );
}