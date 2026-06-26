# Fisheye - Plateforme de photographes freelances

Ce projet est une plateforme web dynamique développée avec Next, React, et Prisma connectée à une base de données **SQLite**. Il s'agit du prototype développé dans le cadre du Projet 9 du parcours Développeur IA d'OpenClassrooms.

## 🚀 Lancement Rapide (Commandes)

Si vous venez de cloner ce dépôt, voici les 3 commandes principales pour tester le projet. Elles ont été testées et vérifiées :

1. **Installer les dépendances** :
   ```bash
   npm install
   ```
2. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
3. **Tester la compilation de production** (Optionnel) :
   ```bash
   npm run build
   ```

Une fois le serveur lancé avec `npm run dev`, ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour visualiser le site.

---

## 🛠️ Architecture de Données : Prisma & SQLite

Le projet utilise **Prisma** pour communiquer avec la base de données depuis les Server Components de Next.js.

### SQLite
La base de données choisie est **SQLite**. La base de données entière tient dans un seul fichier local situé à la racine du dossier prisma :
👉 `prisma/dev.db`

### Le Schéma Prisma
Le fichier `prisma/schema.prisma` définit la structure de nos données (Modèles `Photographer` et `Media`).
Prisma génère automatiquement un client que nous utilisons dans `app/lib/prisma-db.js` pour interroger la base de données de manière sécurisée côté serveur.

### Le Seed (Injection des données de test)
Le projet est fourni avec la base de données SQLite déjà initialisée et remplie.
Cependant, si vous avez besoin de réinitialiser la base de données avec les données par défaut de la maquette, un script de "seed" a été configuré.
Vous pouvez l'exécuter avec la commande officielle :
```bash
npx prisma db seed
```
*Le fichier responsable de cette injection se trouve dans `prisma/seed.js`.*

---

## 📁 Structure du projet
- `app/` : Contient le routing dynamique (App Router), les pages, et les layouts.
- `app/components/` : Les composants React d'interface (Header, Galerie, Lightbox).
- `app/lib/` : Les utilitaires (connexion Prisma et Server Actions).
- `prisma/` : Schéma de la base de données et fichier de données SQLite.
- `public/` : Contient tous les médias statiques (photos des photographes, vidéos, logos).
