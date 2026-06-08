// app/components/Header.jsx

export default function Header() {
  return (
    <header className="header">
      {/* On utilise la balise img standard pour plus de simplicité */}
      <img 
        src="/assets/images/logo.png" 
        alt="Fisheye Home page" 
        className="logo"
      />
      <h1 className="header-title">Nos photographes</h1>
    </header>
  );
}