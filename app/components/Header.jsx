// app/components/Header.jsx
// Ce composant est un Server Component. Il gère la barre de navigation supérieure.

import Link from 'next/link';

// On utilise une propriété (prop) booléenne 'isHomePage' avec une valeur par défaut (false).
// Cela permet de réutiliser le même Header sur tout le site, tout en adaptant son comportement.
export default function Header({ isHomePage = false }) {
  return (
    <header className="header">
      {/* ACCESSIBILITÉ (Repère 1) : On enveloppe le logo dans un composant <Link> de Next.js.
        L'attribut alt="Fisheye Home page" sert de nom accessible au lien. Un utilisateur de lecteur d'écran
        entendra la destination du lien ("Fisheye Home page, lien") au lieu du simple mot "image".
      */}
      <Link href="/">
        <img 
          src="/assets/images/logo.png" 
          alt="Fisheye Home page" 
          className="logo"
        />
      </Link>
      
      {/* RENDU CONDITIONNEL : Le titre <h1> s'affiche UNIQUEMENT sur la page d'accueil.
        Sur la page du photographe, le titre principal (H1) est le nom du photographe 
      */}
      {isHomePage && <h1 className="header-title">Nos photographes</h1>}
    </header>
  );
}