// app/components/ContactWidget.jsx
"use client"; // Indispensable : ce composant a besoin d'interactivité !

import { useState } from 'react';

export default function ContactWidget({ photographerName }) {
  // Définition de l'état : par défaut, la modale est fermée (false)
  const [isOpen, setIsOpen] = useState(false);

  // Fonctions pour ouvrir et fermer
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Fonction pour gérer l'envoi du formulaire (pour l'instant, on empêche le rechargement)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire envoyé !");
    closeModal();
  };

  return (
    <>
      {/* LE BOUTON D'OUVERTURE */}
      <button className="contact-button" aria-label="Contact Me" onClick={openModal}>
        Contactez-moi
      </button>

      {/* LA MODALE (Ne s'affiche que si isOpen est true) */}
      {isOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          {/* Annotation 1 : role="dialog" et aria-labelledby
            Le onClick={(e) => e.stopPropagation()} empêche la modale de se fermer 
            si on clique à l'intérieur du formulaire.
          */}
          <div 
            className="modal" 
            role="dialog" 
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              {/* Annotation 2 : h1 (ou h2 logique) avec le titre */}
              <h2 id="modal-title">
                Contactez-moi <br />
                {photographerName}
              </h2>
              
              {/* Annotation 12 : Bouton de fermeture */}
              <button 
                className="close-button" 
                aria-label="Close Contact form" 
                onClick={closeModal}
              >
                X
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              {/* Annotations 3 et 4 : Label et Input Prénom */}
              <div className="form-group">
                <label htmlFor="first-name">Prénom</label>
                <input type="text" id="first-name" required />
              </div>

              {/* Annotations 5 et 6 : Label et Input Nom */}
              <div className="form-group">
                <label htmlFor="last-name">Nom</label>
                <input type="text" id="last-name" required />
              </div>

              {/* Annotations 7 et 8 : Label et Input Email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required />
              </div>

              {/* Annotations 9 et 10 : Label et Input Message */}
              <div className="form-group">
                <label htmlFor="message">Votre message</label>
                <textarea id="message" rows="4" required></textarea>
              </div>

              {/* Annotation 11 : Bouton d'envoi */}
              <button type="submit" className="submit-button" aria-label="Send">
                Envoyer
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}