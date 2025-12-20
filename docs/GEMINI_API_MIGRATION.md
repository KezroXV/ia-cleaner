# Migration vers Gemini API (Google AI Studio)

## Changements Effectués

### 1. Remplacement Vertex AI → Gemini API

**Avant** : Vertex AI (complexe, GCP, Service Account)  
**Après** : Gemini API (simple, juste API key)

### 2. Fichier Principal

- **Ancien** : `lib/vertex-ai.ts`
- **Nouveau** : `lib/gemini.ts`

### 3. Configuration Simplifiée

**Variables supprimées** :
- ❌ `GOOGLE_CLOUD_PROJECT_ID`
- ❌ `GOOGLE_APPLICATION_CREDENTIALS`
- ❌ `GCP_LOCATION`

**Variable ajoutée** :
- ✅ `GOOGLE_GEMINI_API_KEY` (de https://aistudio.google.com)

### 4. Prompts Améliorés

- **ANALYSIS_PROMPT** : Analyse ultra-détaillée (9 sections)
- **GENERATION_PROMPTS** : Focus sur préservation de structure

### 5. Approche Image-to-Image

- L'image originale est passée à Gemini
- Gemini édite l'image au lieu de la recréer
- Fallback automatique si édition non supportée

## Flux de Traitement

```
Upload image → Buffer
    ↓
Gemini Vision analyse l'image (détails structurels)
    ↓
Gemini Edit transforme l'image (garde structure, nettoie)
    ↓
Cloudinary stocke le résultat
    ↓
URL retournée au frontend
```

## API Utilisée

**Modèle** : `gemini-2.0-flash-exp`  
**Capacités** :
- Vision (analyse d'image)
- Multimodal (texte + image input/output)
- Édition d'image

## Tests

```bash
# Créer dossier test
mkdir -p test-images

# Placer une image test
# test-images/messy-room.jpg

# Lancer le test
npm run test:gemini
```

## Avantages vs Vertex AI

| Critère | Gemini API | Vertex AI |
|---------|-----------|-----------|
| Setup | 5 min | 1.5h |
| Config | API key | GCP project + Service Account |
| Complexité | ⭐ Simple | ⭐⭐⭐ Complexe |
| Coût tests | Gratuit (50/jour) | ~$3-5 |
| Maintenance | Facile | Difficile |

## Dépannage

### Erreur "API key invalid"

→ Vérifie `GOOGLE_GEMINI_API_KEY` dans `.env.local`  
→ Génère une nouvelle clé sur https://aistudio.google.com/app/api-keys

### Quota dépassé

→ Free tier : 50 requêtes/jour, 2 req/min  
→ Attends quelques minutes ou upgrade

### Résultat pas identique à l'original

→ Normal si Gemini ne supporte pas l'édition directe  
→ Le système utilise alors la description détaillée (fallback)  
→ Résultat quand même meilleur qu'avant grâce aux prompts améliorés

## Configuration Requise

### Variables d'environnement (.env.local)

```env
# Google Gemini API (remplace Vertex AI)
GOOGLE_GEMINI_API_KEY=AIzaSy...  # Ta clé de https://aistudio.google.com/app/api-keys

# Cloudinary (inchangé)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS (inchangé)
ALLOWED_ORIGINS=http://localhost:3000,https://your-site.webflow.io

# Config (inchangé)
MAX_FILE_SIZE_MB=10
NODE_ENV=development
```

### Installation des dépendances

```bash
npm install @google/generative-ai
# ou
pnpm install @google/generative-ai
```

## Fichiers Modifiés

- ✅ `package.json` - Ajout de `@google/generative-ai` et script `test:gemini`
- ✅ `lib/gemini.ts` - Nouveau fichier (remplace `lib/vertex-ai.ts`)
- ✅ `lib/prompts.ts` - Prompts améliorés
- ✅ `app/api/clean-image/route.ts` - Import mis à jour
- ✅ `scripts/test-gemini-editing.ts` - Nouveau script de test

## Fichiers Conservés (pour référence)

- `lib/vertex-ai.ts` - Ancien système (peut être supprimé après validation)
- `scripts/test-imagen.ts` - Ancien script de test (peut être supprimé)

## Prochaines Étapes

1. ✅ Installer `@google/generative-ai`
2. ✅ Configurer `GOOGLE_GEMINI_API_KEY` dans `.env.local`
3. ✅ Tester avec `npm run test:gemini`
4. ✅ Valider les résultats
5. ⚠️ Supprimer les anciens fichiers si tout fonctionne

## Notes Importantes

- Gemini API peut ne pas retourner d'image directement dans certains cas
- Le système a un fallback automatique vers la génération basée sur description
- Les prompts améliorés garantissent de meilleurs résultats même avec le fallback
- Le mode image-to-image est la fonctionnalité principale recherchée

