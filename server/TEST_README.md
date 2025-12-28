# Tests d'authentification - Buvette EHTP

Ce document explique comment exécuter les tests pour l'endpoint de connexion.

## Prérequis

1. **MongoDB** doit être installé et en cours d'exécution
2. **Node.js** et **npm** doivent être installés
3. Les dépendances doivent être installées : `npm install`

## Configuration

Les tests utilisent une base de données de test séparée. Par défaut, ils se connectent à :
- `mongodb://localhost:27017/buvette-ehtp-test`

Vous pouvez modifier cette URL en définissant la variable d'environnement `MONGODB_URI` :
```bash
export MONGODB_URI="mongodb://localhost:27017/your-test-db"
```

## Exécution des tests

### Exécuter tous les tests
```bash
npm test
```

### Exécuter uniquement les tests d'authentification
```bash
npm test -- auth.test.ts
```

### Exécuter en mode watch (re-exécute les tests à chaque modification)
```bash
npm test -- --watch
```

### Exécuter avec couverture de code
```bash
npm test -- --coverage
```

## Tests inclus

Les tests couvrent les scénarios suivants pour l'endpoint `/api/auth/login` :

1. ✅ **Connexion réussie** avec des identifiants valides
2. ✅ **Connexion avec studentId insensible à la casse** (EHTP-1234 ou ehtp-1234)
3. ✅ **Erreur 401** pour un studentId invalide
4. ✅ **Erreur 401** pour un mot de passe invalide
5. ✅ **Erreur 401** pour un utilisateur non vérifié
6. ✅ **Erreur 400** pour un studentId manquant
7. ✅ **Erreur 400** pour un mot de passe manquant
8. ✅ **Erreur 400** pour un studentId vide
9. ✅ **Erreur 400** pour un mot de passe vide
10. ✅ **Mise à jour du timestamp lastLogin** lors d'une connexion réussie
11. ✅ **Génération d'un token JWT valide** et utilisable

## Structure des tests

```
server/
├── src/
│   └── __tests__/
│       ├── setup.ts          # Configuration globale des tests
│       └── auth.test.ts       # Tests d'authentification
├── jest.config.js             # Configuration Jest
└── TEST_README.md             # Ce fichier
```

## Exemple de réponse réussie

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "Test User",
      "email": "test@ehtp.ac.ma",
      "studentId": "EHTP-1234",
      "role": "student",
      "preferredLanguage": "fr"
    }
  }
}
```

## Dépannage

### Erreur de connexion à MongoDB
Assurez-vous que MongoDB est en cours d'exécution :
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# ou
mongod
```

### Erreur "Cannot find module"
Réinstallez les dépendances :
```bash
npm install
```

### Les tests échouent avec des erreurs de timeout
Augmentez le timeout dans `jest.config.js` :
```javascript
testTimeout: 30000 // 30 secondes
```

## Notes importantes

- Les tests nettoient automatiquement les données de test après exécution
- Chaque test est indépendant et peut être exécuté séparément
- La base de données de test est isolée de la base de données de développement

