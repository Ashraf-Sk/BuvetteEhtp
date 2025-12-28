# 🔐 Identifiants de Test - Buvette EHTP

Ce document liste les identifiants de test pour se connecter à l'application.

## 📝 Créer les utilisateurs de test

Pour créer les utilisateurs de test dans votre base de données, exécutez :

```bash
cd server
npm run seed
```

## 👤 Utilisateurs de Test

### 📚 Étudiant (Student)

**Identifiants de connexion :**
- **Student ID** : `EHTP-1234` (ou `ehtp-1234` - insensible à la casse)
- **Mot de passe** : `Test1234!`
- **Email** : `test@ehtp.ac.ma`
- **Rôle** : `student`
- **Statut** : ✅ Vérifié (peut se connecter directement)

**Utilisation :**
- Peut voir le menu
- Peut ajouter des produits au panier
- Peut passer des commandes
- Peut voir l'historique des commandes
- Peut gérer ses favoris

---

### 👑 Administrateur (Admin)

**Identifiants de connexion :**
- **Student ID** : `EHTP-0001`
- **Mot de passe** : `Admin1234!`
- **Email** : `admin@ehtp.ac.ma`
- **Rôle** : `admin`
- **Statut** : ✅ Vérifié

**Utilisation :**
- Accès complet à toutes les fonctionnalités
- Gestion des produits
- Gestion des commandes
- Gestion des utilisateurs
- Accès au dashboard administrateur

---

### 👔 Employé (Employee)

**Identifiants de connexion :**
- **Student ID** : `EHTP-0002`
- **Mot de passe** : `Employee1234!`
- **Email** : `employee@ehtp.ac.ma`
- **Rôle** : `employee`
- **Statut** : ✅ Vérifié

**Utilisation :**
- Gestion des commandes
- Mise à jour du statut des commandes
- Gestion de l'inventaire
- Accès au dashboard employé

---

## 🔄 Réinitialiser les utilisateurs de test

Pour supprimer et recréer les utilisateurs de test :

```bash
cd server
npm run seed
```

⚠️ **Attention** : Cette commande supprime les utilisateurs existants avec ces identifiants avant de les recréer.

---

## 📡 Tester avec l'API

### Connexion (Login)

**Endpoint :** `POST /api/auth/login`

**Requête :**
```json
{
  "studentId": "EHTP-1234",
  "password": "Test1234!"
}
```

**Réponse réussie :**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "fullName": "Étudiant Test",
      "email": "test@ehtp.ac.ma",
      "studentId": "EHTP-1234",
      "role": "student",
      "preferredLanguage": "fr"
    }
  }
}
```

### Utiliser le token

Pour les requêtes authentifiées, ajoutez le header :
```
Authorization: Bearer <token>
```

**Exemple avec cURL :**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <votre-token>"
```

---

## 🧪 Tester avec le Frontend

1. Ouvrez http://localhost:5173
2. Cliquez sur "Se connecter" (Login)
3. Entrez :
   - **Student ID** : `EHTP-1234`
   - **Mot de passe** : `Test1234!`
4. Cliquez sur "Connexion"

---

## 📋 Format des identifiants

### Student ID
- Format : `EHTP-XXXX` où XXXX sont 4 chiffres
- Exemples valides : `EHTP-1234`, `EHTP-0001`, `EHTP-9999`
- Insensible à la casse : `ehtp-1234` fonctionne aussi

### Email
- Format : `xxxxx@ehtp.ac.ma`
- Doit se terminer par `@ehtp.ac.ma`

### Mot de passe
- Minimum 8 caractères
- Peut contenir lettres, chiffres et caractères spéciaux

---

## ⚠️ Notes importantes

- Ces identifiants sont **uniquement pour le développement**
- Ne les utilisez **jamais en production**
- Les utilisateurs de test sont automatiquement vérifiés (`isVerified: true`)
- Vous pouvez modifier les mots de passe dans MongoDB Compass si nécessaire

---

## 🔧 Créer un nouvel utilisateur de test

Si vous voulez créer un utilisateur personnalisé, vous pouvez utiliser MongoDB Compass ou créer un script personnalisé basé sur `src/scripts/seed.ts`.

