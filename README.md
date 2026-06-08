# EPF Marketplace — Frontend React

Frontend React pour la plateforme **EPF Marketplace**, connecté à l'API REST Laravel du projet backend.

## Prérequis

- Node.js 20+
- Backend Laravel en cours d'exécution ([epf-marketplace](https://github.com/libasseld/epf-marketplace))

## Installation

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

L'application démarre sur `http://localhost:5173`.

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_API_URL` | URL de base de l'API | `http://localhost:8000/api` |

Exemple `.env` :

```env
VITE_API_URL=http://localhost:8000/api
```

Pour la production (Vercel), configurez `VITE_API_URL` avec l'URL publique de votre backend.

## Backend (démarrage rapide)

```bash
# À la racine du repo backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

### Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Acheteur | buyer@example.com | secret12 |
| Vendeur | seller@example.com | secret12 |
| Admin | admin@example.com | secret12 |

Coupon de test : **DEMO10**

## Structure du projet

```
src/
├── components/     # Composants réutilisables (layout, UI, produits, auth)
├── contexts/       # AuthContext, CartContext
├── hooks/          # Custom hooks (useDebounce)
├── pages/          # Pages par route (buyer, seller, admin)
├── services/       # Appels API (axios)
├── App.jsx         # Routes React Router
└── main.jsx
```

## Fonctionnalités

- **Authentification** : inscription, connexion, profil, déconnexion (token Bearer Sanctum)
- **Catalogue** : liste, détail, filtres, pagination, catégories, recherche globale
- **Acheteur** : panier, commandes, favoris, messagerie, coupons
- **Vendeur** : CRUD produits, commandes reçues, dashboard, statistiques
- **Admin** : stats, gestion utilisateurs, modération produits, CRUD coupons
- **UX** : loading states, toasts d'erreur, déconnexion auto sur 401, message 403

## Déploiement Vercel

1. Poussez le dossier `frontend/` sur GitHub
2. Importez le projet sur [Vercel](https://vercel.com)
3. Framework preset : **Vite**
4. Root directory : `frontend`
5. Variable d'environnement : `VITE_API_URL=https://votre-backend.com/api`
6. Build command : `npm run build`
7. Output directory : `dist`

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build |

## Stack technique

- React 19 + Hooks
- React Router DOM 7
- Context API (auth + panier)
- Axios
- react-hook-form
- react-hot-toast
- Tailwind CSS 4
