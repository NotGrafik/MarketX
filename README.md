# 🛒 MarketX - Marketplace API

## 📌 Le Projet
MarketX est une API de marketplace construite avec AdonisJS. Ce projet permet aux utilisateurs de vendre et d'acheter des chaussures en ligne. Il inclut des fonctionnalités telles que la gestion des utilisateurs, des paniers, des commandes, et des statuts de commande.

---

## 📖 Description du Projet
MarketX vise à offrir une API robuste pour une marketplace en ligne. Les utilisateurs peuvent créer des comptes, lister des articles (chaussures), ajouter des articles à leur panier, passer des commandes et suivre l'évolution de ces commandes grâce à un système de statuts.

---

## 🛠 Technologies
- **Backend** : [AdonisJS](https://adonisjs.com/) (Node.js Framework)
- **Base de données** : MySQL
- **ORM** : Lucid (AdonisJS ORM)
- **Documentation API** : Swagger (adonis5-swagger)
- **Authentification** : API Tokens (JWT)

---

## 📥 Guide d'installation

### Prérequis :
- Node.js (v18+)
- NPM / Yarn / PNPM
- Docker (optionnel pour MySQL)

### 1. Cloner le répertoire
```bash
git clone https://github.com/votre-repo/marketx.git
cd marketx
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'application
```bash
cp .env.example .env
```
Modifiez les variables d'environnement :
```ini
HOST=127.0.0.1
PORT=3333
APP_KEY=your_app_key
DB_CONNECTION=mysql
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=secret
MYSQL_DB_NAME=marketx_db
```

### 4. Lancer la base de données (Docker)
```bash
docker-compose up -d
```

### 5. Créer les tables et remplir avec des données par défaut
```bash
node ace migration:run
node ace db:seed
```

### 6. Lancer le serveur
```bash
node ace serve --watch
```
Accédez à l'API :
```bash
http://localhost:3333
```

### 7. Accéder à la documentation Swagger
```bash
http://localhost:3333/docs
```

---

## ✨ Fonctionnalités
- **Gestion des utilisateurs** : Création, connexion, mise à jour
- **Marketplace** : Ajout, modification, suppression d'articles (chaussures)
- **Panier** : Ajout et suppression d'articles
- **Commandes** : Passer une commande à partir du panier
- **Suivi des commandes** : Historique des statuts (pending, shipped, delivered)

---

## 🛤 Routes API

### **Authentification**
| Verbe | Route             | Description                |
|-------|-------------------|----------------------------|
| POST  | /auth/login       | Connexion utilisateur      |
| POST  | /auth/register    | Création d'utilisateur     |
| POST  | /auth/logout      | Déconnexion utilisateur    |

### **Utilisateurs**
| Verbe | Route             | Description                 |
|-------|-------------------|-----------------------------|
| GET   | /users            | Liste tous les utilisateurs |
| POST  | /users            | Créer un utilisateur        |

### **Produits (Chaussures)**
| Verbe | Route             | Description                         |
|-------|-------------------|-------------------------------------|
| GET   | /shoes            | Liste toutes les chaussures         |
| POST  | /shoes            | Ajouter une chaussure               |
| DELETE| /shoes/:id        | Supprimer une chaussure             |

### **Panier**
| Verbe | Route                     | Description                          |
|-------|---------------------------|--------------------------------------|
| GET   | /cart                     | Afficher le panier de l'utilisateur  |
| POST  | /cart/add/:id             | Ajouter une chaussure au panier      |
| DELETE| /cart/remove/:id          | Retirer une chaussure du panier      |
| POST  | /cart/checkout            | Passer la commande                  |

### **Commandes**
| Verbe | Route                    | Description                          |
|-------|--------------------------|--------------------------------------|
| GET   | /orders/show                  | Liste des commandes de l'utilisateur                 |
| GET   | /orders/checkout              | Passer une commande              |
| POST | /orders/update-status/:id       | Mettre à jour le statut d'une commande |
| GET | /orders/:id/status-history       | Mettre à jour le statut d'une commande |

---

## 🚀 Améliorations futures
- **Notifications** lors du changement de statut d'une commande
- **Gestion des stocks avancée**
- **Système de filtres et recherche** pour les produits
- **Intégration d'un système de paiement (Stripe, PayPal)**

