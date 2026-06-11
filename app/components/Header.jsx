// app/components/Header.jsx
// Ce composant est un Server Component. Il gère la barre de navigation supérieure de manière statique et ultra-rapide.

import Link from 'next/link';

// SOUTENANCE : On utilise une propriété (prop) booléenne 'isHomePage' avec une valeur par défaut (false).
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
        Pourquoi ? Sur la page du photographe, le titre principal (H1) doit être le nom du photographe 
        pour respecter la structure sémantique SEO et l'ordre logique des titres exigé par le WCAG.
      */}
      {isHomePage && <h1 className="header-title">Nos photographes</h1>}
    </header>
  );
}