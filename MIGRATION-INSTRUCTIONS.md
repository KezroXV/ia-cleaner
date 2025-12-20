# ✅ Migration Gemini API - Instructions Finales

## 🎉 Migration Terminée !

Tous les fichiers ont été modifiés. Il reste quelques étapes manuelles à faire :

## 📦 Étape 1 : Installer la dépendance

```bash
cd ia-cleaner
pnpm install @google/generative-ai
# ou
npm install @google/generative-ai
```

## 🔑 Étape 2 : Configurer la clé API Gemini

1. Va sur https://aistudio.google.com/app/api-keys
2. Crée ou récupère ta clé API
3. Ajoute-la dans `.env.local` :

```env
# Google Gemini API (remplace Vertex AI)
GOOGLE_GEMINI_API_KEY=AIzaSy...  # Ta clé ici

# Supprime ces lignes (plus nécessaires) :
# ❌ GOOGLE_CLOUD_PROJECT_ID
# ❌ GOOGLE_APPLICATION_CREDENTIALS
# ❌ GCP_LOCATION
```

## 🧪 Étape 3 : Tester la migration

```bash
# Créer le dossier de test
mkdir -p test-images

# Placer une image de test dans test-images/messy-room.jpg
# (copie une photo de pièce en désordre)

# Lancer le test
pnpm run test:gemini
# ou
npm run test:gemini
```

## ✅ Checklist de Validation

- [ ] `@google/generative-ai` installé
- [ ] `GOOGLE_GEMINI_API_KEY` configuré dans `.env.local`
- [ ] Variables Vertex AI supprimées de `.env.local`
- [ ] Test `pnpm run test:gemini` fonctionne
- [ ] Serveur de dev `pnpm run dev` démarre sans erreur

## 📊 Résumé des Changements

### Fichiers Créés
- ✅ `lib/gemini.ts` - Nouveau module Gemini API
- ✅ `scripts/test-gemini-editing.ts` - Script de test
- ✅ `docs/GEMINI_API_MIGRATION.md` - Documentation
- ✅ `MIGRATION-INSTRUCTIONS.md` - Ce fichier

### Fichiers Modifiés
- ✅ `package.json` - Ajout dépendance + script test
- ✅ `lib/prompts.ts` - Prompts améliorés
- ✅ `app/api/clean-image/route.ts` - Import mis à jour

### Fichiers à Supprimer (optionnel, après validation)
- ⚠️ `lib/vertex-ai.ts` - Ancien système
- ⚠️ `scripts/test-imagen.ts` - Ancien script de test
- ⚠️ `gcp-service-account.json` - Plus nécessaire

## 🚀 Démarrer le Serveur

```bash
pnpm run dev
```

Le serveur devrait démarrer sur http://localhost:3000

## ⚠️ Notes Importantes

1. **Quota Gemini API** : Free tier = 50 requêtes/jour, 2 req/min
2. **Fallback automatique** : Si Gemini ne retourne pas d'image directement, le système utilise la génération basée sur description
3. **Prompts améliorés** : Même avec fallback, les résultats sont meilleurs grâce aux prompts ultra-détaillés

## 🆘 Dépannage

### Erreur "GOOGLE_GEMINI_API_KEY manquante"
→ Vérifie que la variable est bien dans `.env.local` (pas `.env`)

### Erreur "API key invalid"
→ Vérifie que la clé est correcte et active sur https://aistudio.google.com

### Erreur "Quota exceeded"
→ Attends quelques minutes ou upgrade ton plan Gemini API

### Test échoue avec "Cannot find module"
→ Lance `pnpm install` pour installer toutes les dépendances

## 📚 Documentation

Voir `docs/GEMINI_API_MIGRATION.md` pour plus de détails techniques.

