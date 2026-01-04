# Configuration Stripe

## 🔑 Clés API Stripe

### Clé Publique (Publishable Key)
```
pk_test_51SlrugRBqZMgxLz91D6wYUITOLvYSfiKsGladwTKICmwOPiSJHmw9Ui0ktpOdExLI574JjRuBLJoPppgLFzbt6uX00M15sraZg
```

### Clé Secrète (Secret Key)
⚠️ **ATTENTION** : La clé secrète fournie semble incomplète. Une clé secrète Stripe complète devrait ressembler à :
```
sk_test_51SlrugRBqZMgxLz9... (beaucoup plus longue)
```

Veuillez vérifier votre clé secrète complète dans le dashboard Stripe : https://dashboard.stripe.com/test/apikeys

## 📝 Configuration des fichiers .env

### Backend (`server/.env`)

Ajoutez ces lignes à votre fichier `.env` dans le dossier `server/` :

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51SlrugRBqZMgxLz9... (votre clé complète)
STRIPE_PUBLISHABLE_KEY=pk_test_51SlrugRBqZMgxLz91D6wYUITOLvYSfiKsGladwTKICmwOPiSJHmw9Ui0ktpOdExLI574JjRuBLJoPppgLFzbt6uX00M15sraZg
STRIPE_WEBHOOK_SECRET=whsec_... (optionnel, pour les webhooks)
```

### Frontend (`client/.env`)

Ajoutez cette ligne à votre fichier `.env` dans le dossier `client/` :

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SlrugRBqZMgxLz91D6wYUITOLvYSfiKsGladwTKICmwOPiSJHmw9Ui0ktpOdExLI574JjRuBLJoPppgLFzbt6uX00M15sraZg
```

## 🧪 Test des Paiements

### Cartes de Test Stripe

Pour tester les paiements, utilisez ces cartes de test :

**Paiement Réussi :**
- Numéro : `4242 4242 4242 4242`
- Date d'expiration : N'importe quelle date future (ex: `12/34`)
- CVC : N'importe quel 3 chiffres (ex: `123`)
- Code postal : N'importe quel code postal (ex: `12345`)

**Paiement Refusé :**
- Numéro : `4000 0000 0000 0002`

**3D Secure (Authentification) :**
- Numéro : `4000 0025 0000 3155`
- Utilisez le code d'authentification : `1234`

## ⚠️ Dépannage

### Erreur `ERR_BLOCKED_BY_CLIENT`

Si vous voyez des erreurs `ERR_BLOCKED_BY_CLIENT` pour `r.stripe.com/b`, cela signifie qu'un bloqueur de publicité ou une extension de navigateur bloque les requêtes Stripe.

**Solutions :**
1. **Désactiver temporairement les bloqueurs** (AdBlock, uBlock Origin, etc.) pour tester
2. **Ajouter une exception** pour `stripe.com` et `r.stripe.com` dans votre bloqueur
3. **Utiliser un navigateur en mode privé** sans extensions pour tester
4. **Tester dans un autre navigateur** (Chrome, Firefox, Edge)

### Avertissements Stripe

Les avertissements suivants sont **normaux en développement** et n'empêchent pas le fonctionnement :

- **"link payment method not activated"** : Normal, Link n'est pas activé (fonctionne en test mode)
- **"apple_pay not enabled"** : Normal, Apple Pay nécessite un domaine vérifié (pas disponible en localhost)

Ces méthodes de paiement sont désactivées dans le code pour ne montrer que les cartes (Visa, Mastercard).

## 🔒 Sécurité

⚠️ **IMPORTANT** :
- Ne commitez JAMAIS vos clés API dans Git
- Les fichiers `.env` sont déjà dans `.gitignore`
- Utilisez les clés de test (`pk_test_` et `sk_test_`) pour le développement
- Pour la production, utilisez les clés live (`pk_live_` et `sk_live_`)

## 📚 Ressources

- Dashboard Stripe : https://dashboard.stripe.com
- Documentation Stripe : https://stripe.com/docs
- Guide de test : https://stripe.com/docs/testing

