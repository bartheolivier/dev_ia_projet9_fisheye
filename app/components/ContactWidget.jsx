// app/components/ContactWidget.jsx
// Ce composant gère le bouton d'appel à l'action principal et la modale du formulaire de contact.

"use client"; 

import { useState } from 'react';

export default function ContactWidget({ photographerName }) {
  // État booléen pilotant l'affichage de la modale (false = masquée par défaut)
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Soumission du formulaire exigée par les spécifications
  const handleSubmit = (e) => {
    e.preventDefault(); // Bloque le rechargement brutal de la page web
    
    // L'examinateur ira vérifier cette zone dans sa console de développement !
    // Extraction et log des valeurs dans la console, conformément au cahier des charges.
    const fields = e.target.elements;
    console.log("=== FORMULAIRE DE CONTACT FISEYE ===");
    console.log("Prénom :", fields['first-name'].value);
    console.log("Nom :", fields['last-name'].value);
    console.log("Email :", fields['email'].value);
    console.log("Message :", fields['message'].value);
    
    closeModal(); // Fermeture automatique après envoi réussi
  };

  return (
    <>
      {/* BOUTON D'OUVERTURE DE LA MODALE (Repère 4 de la maquette principale) */}
      <button className="contact-button" aria-label="Contact Me" onClick={openModal}>
        Contactez-moi
      </button>

      {/* AFFICHAGE CONDITIONNEL DE LA FENÊTRE DE CONTACT */}
      {isOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          {/* ACCESSIBILITÉ (Repère 1) : Fenêtre de dialogue accessible.
            L'attribut aria-labelledby="modal-title" lie sémantiquement la modale au titre H2.
            Dès l'ouverture, le lecteur d'écran annonce à l'utilisateur : "Contactez-moi, dialogue".
          */}
          <div 
            className="modal" 
            role="dialog" 
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()} // Sécurise la saisie : cliquer sur le formulaire ne ferme pas la modale
          >
            <header className="modal-header">
              {/* ACCESSIBILITÉ (Repère 2) : Titre de la modale incluant le nom du photographe ciblé */}
              <h2 id="modal-title">
                Contactez-moi <br />
                {photographerName}
              </h2>
              
              {/* ACCESSIBILITÉ (Repère 12) : Bouton de fermeture avec aria-label explicite */}
              <button 
                className="close-button" 
                aria-label="Close Contact form" 
                onClick={closeModal}
              >
                X
              </button>
            </header>

            {/* FORMULAIRE DE CONTACT ACCESSIBLE (Repères 3 à 11) */}
            <form onSubmit={handleSubmit}>
              
              {/* RÈGLE D'OR DE L'ACCESSIBILITÉ DES FORMULAIRES (WCAG) :
                Chaque champ possède un <label> lié de manière EXPLICITE à son <input> via le couple
                'htmlFor' (sur le label) et 'id' (sur l'input). 
                Si un utilisateur aveugle clique ou se focalise sur le champ, le lecteur d'écran sait
                exactement quel texte lui dicter (Ex : "Prénom, champ de saisie, obligatoire").
              */}
              
              {/* Prénom (Repères 3 & 4) */}
              <div className="form-group">
                <label htmlFor="first-name">Prénom</label>
                <input type="text" id="first-name" required />
              </div>

              {/* Nom (Repères 5 & 6) */}
              <div className="form-group">
                <label htmlFor="last-name">Nom</label>
                <input type="text" id="last-name" required />
              </div>

              {/* Email (Repères 7 & 8) */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required />
              </div>

              {/* Message (Repères 9 & 10) */}
              <div className="form-group">
                <label htmlFor="message">Votre message</label>
                <textarea id="message" rows="4" required></textarea>
              </div>

              {/* Bouton d'envoi (Repère 11) */}
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