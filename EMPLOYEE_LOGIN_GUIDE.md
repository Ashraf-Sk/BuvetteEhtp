# Guide de connexion pour les employés

## 📋 Compte de test employé

Un compte employé de test est créé automatiquement par le script de seed. Voici les identifiants :

### Identifiants de connexion
- **Student ID** : `EHTP-0002`
- **Mot de passe** : `Employee1234!`
- **Email** : `employee@ehtp.ac.ma`
- **Rôle** : `employee`

## 🚀 Étapes pour se connecter

### 1. S'assurer que le compte existe

Si le compte n'existe pas encore, exécutez le script de seed :

```bash
cd server
npm run seed
```

Cela créera le compte employé avec les identifiants ci-dessus.

### 2. Se connecter via l'interface

1. Allez sur la page de connexion : `/auth/login`
2. Entrez les identifiants :
   - **Student ID** : `EHTP-0002`
   - **Mot de passe** : `Employee1234!`
3. Cliquez sur "Se connecter"

### 3. Redirection automatique

Après connexion, vous serez automatiquement redirigé vers :
- **Dashboard employé** : `/employee/dashboard`

## 🎯 Fonctionnalités disponibles

Une fois connecté en tant qu'employé, vous avez accès à :

1. **Dashboard** (`/employee/dashboard`)
   - Statistiques en temps réel
   - Vue d'ensemble de l'activité

2. **Gestion des commandes** (`/employee/orders`)
   - Voir toutes les commandes
   - Changer le statut des commandes
   - Filtrer par statut

3. **Inventaire** (`/employee/inventory`)
   - Gérer les produits
   - Mettre à jour les stocks
   - Créer/modifier/supprimer des produits

4. **Rapports** (`/employee/reports`)
   - Statistiques de ventes
   - Produits les plus vendus
   - Évolution des revenus

## 🔐 Créer un nouveau compte employé

Pour créer un nouveau compte employé, vous devez :

1. **Via l'interface d'inscription** (si autorisé) :
   - Aller sur `/auth/register`
   - Remplir le formulaire avec un email `@ehtp.ac.ma`
   - Le rôle sera automatiquement défini comme `student` par défaut
   - ⚠️ **Note** : Les comptes créés via l'interface sont des étudiants par défaut

2. **Via la base de données** (recommandé pour les employés) :
   - Modifier directement dans MongoDB
   - Ou créer un script personnalisé
   - Définir `role: 'employee'` et `isVerified: true`

3. **Via l'API** (si vous avez les droits admin) :
   ```bash
   POST /api/auth/register
   {
     "fullName": "Nom Employé",
     "email": "nouveau.employe@ehtp.ac.ma",
     "studentId": "EHTP-XXXX",
     "password": "MotDePasse123!",
     "role": "employee"  // Définir manuellement après création
   }
   ```

## ⚠️ Notes importantes

- Le **Student ID** est utilisé pour la connexion (pas l'email)
- Le compte doit être **vérifié** (`isVerified: true`) pour pouvoir se connecter
- Le format du Student ID doit être : `EHTP-XXXX` (4 chiffres)
- L'email doit être du domaine `@ehtp.ac.ma`

## 🐛 Dépannage

### Problème : "Invalid credentials"
- Vérifiez que le Student ID est en majuscules : `EHTP-0002`
- Vérifiez que le mot de passe est correct : `Employee1234!`
- Assurez-vous que le compte existe dans la base de données

### Problème : "Please verify your email first"
- Le compte n'est pas vérifié
- Exécutez le script seed pour créer un compte vérifié
- Ou vérifiez manuellement l'email

### Problème : Redirection vers la page étudiant
- Vérifiez que le rôle dans la base de données est bien `employee`
- Déconnectez-vous et reconnectez-vous
- Videz le cache du navigateur

## 📝 Commandes utiles

```bash
# Créer le compte employé de test
cd server
npm run seed

# Vérifier la connexion MongoDB
# (assurez-vous que MongoDB est démarré)

# Démarrer le serveur
cd server
npm run dev

# Démarrer le client
cd client
npm run dev
```

