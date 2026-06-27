// app/layout.js
// Le layout racine, Il configure le code HTML de base commun à toutes les pages (la structure globale, la langue et l'injection des polices de caractères).
// Le Root Layout joue le rôle de gabarit universel. 
// J'y ai centralisé l'importation de la feuille de style globale et configuré l'objet de métadonnées pour optimiser le référencement. 
// Pour garantir une accessibilité rigoureuse dès le squelette HTML, j'ai ajusté l'attribut sémantique de langue sur la valeur fr, 
// garantissant ainsi le déclenchement automatique du bon moteur de synthèse vocale par les lecteurs d'écran.

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Chargement centralisé de notre feuille de style pour tout le site

// OPTIMISATION DES POLICES (Google Fonts) :
// Next.js intègre un système d'optimisation natif pour les polices. Au lieu de télécharger les fichiers 
// de polices depuis les serveurs Google à chaque visite, Next.js télécharge les polices lors de la compilation et les sert localement.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ACCESSIBILITÉ & SEO (Métadonnées) :
// Configure les balises de l'en-tête HTML (<title> et <meta name="description">).
// Important pour l'indexation Google et l'annonce du nom de l'onglet par les lecteurs d'écran.
export const metadata = {
  title: "FishEye - Plateforme de photographes freelances",
  description: "Découvrez les galeries de nos meilleurs photographes professionnels et contactez-les pour vos projets.",
};

// COMPOSANT MAÎTRE : RootLayout enveloppe TOUTES les pages de l'application.
// Le paramètre '{children}' représente de manière dynamique le fichier de la page demandée (page.js d'accueil ou de profil du photographe).
export default function RootLayout({ children }) {
  return (
    /* ACCESSIBILITÉ (La prop 'lang') : 
       Le cahier des charges s'organisant autour d'un public francophone, il est techniquement 
       recommandé de basculer l'attribut de langue à lang="fr". 
       Pourquoi ? Si un aveugle navigue sur le site, son lecteur d'écran détecte cet attribut pour 
       activer instantanément la bonne synthèse vocale (accent français). Si on laisse "en", le logiciel 
       essaiera de lire les textes français avec un accent anglais, rendant le site incompréhensible.
    */
    <html lang="fr">
      {/* C'est ici que s'injecte le corps de nos pages dynamiques */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}