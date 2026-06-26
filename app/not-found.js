// app/not-found.js
// Fichier natif de Next.js qui s'affiche automatiquement lorsqu'une page est introuvable (404)
// ou lorsque la fonction notFound() est appelée depuis un composant serveur.
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="feedback-page">
      <h2>Photographe introuvable</h2>
      <p>Désolé, le profil que vous cherchez n'existe pas ou a été supprimé.</p>
      <Link href="/" className="contact-button" style={{ display: 'inline-block', marginTop: '20px' }}>
        Retour à l'accueil
      </Link>
    </div>
  );
}
