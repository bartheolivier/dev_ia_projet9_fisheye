// app/page.js
import { getAllPhotographers } from './lib/prisma-db';
import Header from './components/Header';
import PhotographerCard from './components/PhotographerCard';

export default async function Home() {
  // On récupère les données brutes
  const rawPhotographers = await getAllPhotographers();

  // On définit l'ordre précis des IDs tels qu'ils apparaissent sur la maquette
  const mockupOrder = [243, 930, 82, 527, 925, 195];

  // On prépare une nouvelle liste, vide pour l'instant
  const photographers = [];

  // On parcourt notre liste d'ID de référence, un par un
  for (let i = 0; i < mockupOrder.length; i++) {
    const currentId = mockupOrder[i];

    // On identifie dans les données de la base CELUI qui a cet ID
    const matchingPhotographer = rawPhotographers.find(
      (photographer) => photographer.id === currentId
    );

    // on l'ajoute à la fin de notre nouvelle liste
      photographers.push(matchingPhotographer);
    
  }

  return (
    <main>
      {/* On informe le composant qu'il est bien sur la page d'accueil */}
      <Header isHomePage={true} />
      {/* La section contenant la grille de nos photographes */}
      <section className="photographers-grid">
        {photographers.map((photographer) => (
           // On passe les données du photographe au composant enfant via la prop "photographer"
          <PhotographerCard key={photographer.id} photographer={photographer} />
        ))}
      </section>
    </main>
  );
}