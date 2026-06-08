import { getAllPhotographers } from './lib/prisma-db';

export default async function Home() {
  // On récupère les données via la fonction que nous venons de créer
  const photographers = await getAllPhotographers();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test de connexion FishEye</h1>
      <p>Voici la liste des photographes récupérée depuis la base de données :</p>
      
      <ul>
        {photographers.map((photographer) => (
          <li key={photographer.id} style={{ margin: '1rem 0' }}>
            <strong>{photographer.name}</strong> - {photographer.city}, {photographer.country}
            <br />
            <small>{photographer.tagline}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}