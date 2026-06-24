// app/components/ContactWidget.jsx
// Ce composant gère le bouton d'appel à l'action principal et la modale du formulaire de contact.

"use client"; 

import { useState } from 'react';

export default function ContactWidget({ photographerName }) {
  // État booléen pilotant l'affichage de la modale (false = masquée par défaut)
  const [isOpen, setIsOpen] = useState(false);

  // Déclaration des états pour contrôler chaque champ
  // Chaque saisie de l'utilisateur sera stockée en temps réel dans la mémoire de React.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const openModal = () => setIsOpen(true);
  
  // À la fermeture, on réinitialise proprement les champs 
  // pour que le formulaire soit entièrement vide et propre lors de la prochaine ouverture.
  const closeModal = () => {
    setIsOpen(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
  };

  // Soumission du formulaire exigée par les spécifications
  const handleSubmit = (e) => {
    e.preventDefault(); // Bloque le rechargement de la page web (comportement par defaut du navigateur)
    
    // Extraction et log des valeurs dans la console, conformément au cahier des charges.
    console.log("=== FORMULAIRE DE CONTACT ===");
    console.log("Prénom :", firstName);
    console.log("Nom :", lastName);
    console.log("Email :", email);
    console.log("Message :", message);
    
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
                {/* SOUTENANCE (Approche Scolaire - Étape 2) : Input Contrôlé par React
                    - value : l'input affiche en permanence la valeur de notre état.
                    - onChange : à chaque touche pressée, on met à jour l'état avec la valeur tapée (e.target.value).
                */}
                <input 
                  type="text" 
                  id="first-name" 
                  required 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* Nom (Repères 5 & 6) */}
              <div className="form-group">
                <label htmlFor="last-name">Nom</label>
                <input 
                  type="text" 
                  id="last-name" 
                  required 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Email (Repères 7 & 8) */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Message (Repères 9 & 10) */}
              <div className="form-group">
                <label htmlFor="message">Votre message</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
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