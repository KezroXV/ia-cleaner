# 🔧 Résolution des Problèmes de Quota Gemini API

## ❌ Erreur : "Quota dépassé" ou "429 Too Many Requests"

### Symptômes

```
Error: [GoogleGenerativeAI Error]: Error fetching from ...:generateContent: [429 Too Many Requests]
Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
limit: 0
```

### Causes Possibles

1. **Quota Free Tier épuisé** : Vous avez atteint la limite gratuite (50 requêtes/jour)
2. **Quota à 0** : Votre compte n'a pas de quota activé
3. **Rate limit** : Trop de requêtes en peu de temps (2 req/min pour free tier)
4. **Compte non configuré** : La clé API n'est pas associée à un compte avec quota

## ✅ Solutions

### Solution 1 : Vérifier votre Quota

1. Va sur https://ai.dev/usage?tab=rate-limit
2. Connecte-toi avec le même compte que ta clé API
3. Vérifie :
   - **Quota disponible** : Doit être > 0
   - **Requêtes restantes aujourd'hui** : Doit être > 0
   - **Rate limit** : 2 requêtes/minute max pour free tier

### Solution 2 : Attendre le Reset

- **Quota quotidien** : Reset à minuit (heure du serveur Google)
- **Rate limit** : Reset après 1 minute
- Le message d'erreur indique souvent : `Please retry in XX seconds`

### Solution 3 : Utiliser un Modèle Différent (Temporaire)

Si `gemini-2.0-flash-exp` n'a plus de quota, tu peux essayer :

```typescript
// Dans lib/gemini.ts, remplacer :
model: 'gemini-2.0-flash-exp'

// Par :
model: 'gemini-1.5-flash'  // ou 'gemini-1.5-pro'
```

**Note** : Les modèles 1.5 peuvent avoir des quotas différents.

### Solution 4 : Créer une Nouvelle Clé API

1. Va sur https://aistudio.google.com/app/api-keys
2. Supprime l'ancienne clé (si nécessaire)
3. Crée une nouvelle clé API
4. Mets à jour `.env.local` :
   ```env
   GOOGLE_GEMINI_API_KEY=ta-nouvelle-cle
   ```

### Solution 5 : Upgrade vers un Plan Payant

Si tu as besoin de plus de quota :

1. Va sur https://ai.google.dev/pricing
2. Consulte les plans disponibles
3. Upgrade ton compte Google Cloud
4. Les quotas augmenteront automatiquement

## 🔄 Retry Automatique

Le code inclut maintenant un système de retry automatique :

- **3 tentatives maximum**
- **Backoff exponentiel** : 1s, 2s, 4s
- **Respect du délai** : Si l'API indique un délai (ex: "retry in 52s"), le code attend ce délai

### Comportement

1. **Première tentative** : Appel direct à l'API
2. **Si erreur 429 avec délai** : Attente du délai spécifié puis retry
3. **Si erreur 429 sans délai** : Backoff exponentiel (1s, 2s, 4s)
4. **Après 3 tentatives** : Erreur retournée à l'utilisateur

## 📊 Quotas Free Tier

| Métrique | Limite |
|----------|--------|
| Requêtes par jour | 50 |
| Requêtes par minute | 2 |
| Tokens par minute | Variable selon le modèle |

**Source** : https://ai.google.dev/gemini-api/docs/rate-limits

## 🧪 Tester le Quota

```bash
# Vérifier que la clé API est valide
node -e "require('dotenv').config({path:'.env.local'}); console.log('API Key:', process.env.GOOGLE_GEMINI_API_KEY?.substring(0,10)+'...');"

# Tester une requête simple
npm run test:gemini
```

## ⚠️ Messages d'Erreur Améliorés

Le code détecte maintenant automatiquement les erreurs de quota et affiche :

- **Quota à 0** : "Votre quota free tier est à 0. Vérifiez votre compte..."
- **Quota dépassé avec délai** : "Réessayez dans XX secondes"
- **Quota dépassé sans délai** : "Vérifiez votre quota sur https://ai.dev/usage"

## 🔍 Debug

Si le problème persiste :

1. **Vérifie les logs** : Regarde les messages dans la console
2. **Vérifie la clé API** : Assure-toi qu'elle est correcte dans `.env.local`
3. **Vérifie le compte** : Même compte pour la clé API et le dashboard
4. **Vérifie les quotas** : https://ai.dev/usage?tab=rate-limit

## 📝 Exemple de Logs

```
🔍 Analyse détaillée de l'image avec Gemini Vision...
❌ Erreur lors de l'analyse: [429 Too Many Requests]
⏳ Attente de 52s avant retry (tentative 1/3)...
🔍 Analyse détaillée de l'image avec Gemini Vision...
✅ Analyse complétée: 1234 caractères
```

## 🆘 Support

Si rien ne fonctionne :

1. **Documentation officielle** : https://ai.google.dev/gemini-api/docs
2. **Support Google** : https://support.google.com/cloud
3. **GitHub Issues** : Si c'est un bug du SDK

