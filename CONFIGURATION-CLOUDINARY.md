# Configuration Cloudinary

## Problème actuel

L'erreur `Invalid cloud_name cleaner` indique que la variable `CLOUDINARY_CLOUD_NAME` dans votre `.env.local` contient une valeur invalide.

## Solution : Configurer Cloudinary correctement

### Étape 1 : Créer un compte Cloudinary (si pas déjà fait)

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit
3. Connectez-vous au Dashboard

### Étape 2 : Récupérer vos credentials

Dans le Dashboard Cloudinary :

1. **Cloud Name** : Trouvé en haut à droite du dashboard
   - Format : `dxyz1234` ou `my-cloud-name`
   - ⚠️ **IMPORTANT** : Ce n'est PAS juste "cleaner" ou un nom générique
   - C'est un identifiant unique fourni par Cloudinary

2. **API Key** : Menu → Settings → Security
   - Copiez l'API Key

3. **API Secret** : Menu → Settings → Security
   - ⚠️ Cliquez sur "Reveal" pour voir le secret
   - Copiez l'API Secret

### Étape 3 : Mettre à jour `.env.local`

Ouvrez votre fichier `.env.local` et mettez à jour :

```env
# Cloudinary - REMPLACEZ par vos vraies valeurs
CLOUDINARY_CLOUD_NAME=votre-cloud-name-reel  # Ex: dxyz1234
CLOUDINARY_API_KEY=votre-api-key-reelle
CLOUDINARY_API_SECRET=votre-api-secret-reel
```

**Exemple correct :**
```env
CLOUDINARY_CLOUD_NAME=dxyz1234
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

**❌ Exemple incorrect (ce que vous avez probablement) :**
```env
CLOUDINARY_CLOUD_NAME=cleaner  # ❌ Trop générique, invalide
```

### Étape 4 : Tester la configuration

```bash
pnpm tsx scripts/test-cloudinary.ts
```

Si tout est correct, vous verrez :
```
✅ Connexion Cloudinary réussie !
```

### Étape 5 : Redémarrer le serveur

```bash
pnpm dev
```

## Vérification rapide

Pour vérifier que votre configuration est correcte :

1. Le `CLOUDINARY_CLOUD_NAME` doit être un identifiant unique (pas "cleaner", "test", etc.)
2. L'API Key doit être une longue chaîne de chiffres
3. L'API Secret doit être une longue chaîne alphanumérique

## Note importante

Le code a maintenant une meilleure validation qui vous donnera un message d'erreur plus clair si la configuration est incorrecte.

