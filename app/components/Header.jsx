// app/components/Header.jsx
import Link from 'next/link';

// On ajoute une "prop" isHomePage, qui est fausse par défaut
export default function Header({ isHomePage = false }) {
  return (
    <header className="header">
      {/* On enveloppe le logo dans un Link pour pouvoir revenir à l'accueil */}
      <Link href="/">
        <img 
          src="/assets/images/logo.png" 
          alt="Fisheye Home page" 
          className="logo"
        />
      </Link>
      
      {/* Le titre s'affiche UNIQUEMENT si isHomePage est vrai */}
      {isHomePage && <h1 className="header-title">Nos photographes</h1>}
    </header>
  );
}