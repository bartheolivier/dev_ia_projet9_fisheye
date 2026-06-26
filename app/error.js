// app/error.js
// Ce fichier intercepte les crashs inattendus de l'application et affiche une interface de secours.
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Une erreur applicative a été interceptée:", error);
  }, [error]);

  return (
    <div className="feedback-page">
      <h2>Oups ! Une erreur est survenue.</h2>
      <p>Nous n'avons pas pu charger cette page correctement.</p>
      {/* Le bouton reset tente de re-rendre le segment de page qui a planté */}
      <button className="contact-button" style={{ marginTop: '20px' }} onClick={() => reset()}>
        Réessayer
      </button>
    </div>
  );
}
