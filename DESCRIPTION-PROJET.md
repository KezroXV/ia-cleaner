# Description du Projet IA-Cleaner

## 📋 Vue d'ensemble

**IA-Cleaner** (également appelé **Clear AI**) est une application web Next.js qui utilise l'intelligence artificielle pour transformer des images de pièces en désordre en versions nettoyées et organisées. L'application combine Google Vertex AI (Gemini Vision pour l'analyse et Imagen 3 pour la génération) avec Cloudinary pour l'hébergement des images.

## 🎯 Fonctionnalité principale

L'application permet aux utilisateurs de :
1. **Uploader une image** d'une pièce en désordre (cuisine, chambre, salon, bureau, etc.)
2. **Analyser automatiquement** l'image avec Gemini Vision pour extraire tous les détails structurels
3. **Générer une version nettoyée** en préservant la structure exacte de la pièce (image-to-image editing)
4. **Obtenir le résultat** via une URL Cloudinary

## 🏗️ Architecture technique

### Stack technologique

- **Framework** : Next.js 16.1.0 (App Router)
- **Langage** : TypeScript
- **UI** : React 19.2.3, Tailwind CSS 4, Radix UI, Lucide React
- **IA** : Google Cloud Vertex AI
  - Gemini 2.0 Flash Exp (analyse d'image)
  - Imagen 3.0 Generate 002 (génération d'image)
- **Stockage** : Cloudinary (hébergement d'images)
- **Traitement d'image** : Sharp (optimisation, redimensionnement)
- **Gestion de formulaires** : Formidable (parsing FormData)

### Structure du projet

```
ia-cleaner/
├── app/
│   ├── api/
│   │   └── clean-image/
│   │       └── route.ts          # Endpoint API principal
│   ├── page.tsx                  # Page principale (client)
│   ├── layout.tsx                # Layout global
│   └── globals.css               # Styles globaux
├── components/
│   ├── image-upload/
│   │   ├── ImageUploadPanel.tsx  # Panneau d'upload (drag & drop)
│   │   ├── ImageResultPanel.tsx  # Panneau de résultat
│   │   └── ArrowConnector.tsx    # Connecteur visuel
│   ├── layout/
│   │   └── Header.tsx            # En-tête de l'application
│   ├── cta/
│   │   └── TestCTA.tsx           # Bouton d'action principal
│   └── ui/                       # Composants shadcn/ui
├── lib/
│   ├── vertex-ai.ts              # Intégration Vertex AI (Gemini + Imagen)
│   ├── cloudinary.ts             # Intégration Cloudinary
│   ├── prompts.ts                # Prompts pour l'IA
│   └── utils.ts                  # Utilitaires (cn, etc.)
├── utils/
│   └── file-handler.ts           # Gestion des fichiers (parsing, validation, optimisation)
├── types/
│   └── index.ts                  # Types TypeScript
└── scripts/                      # Scripts de test
```

## 🔄 Flux de traitement actuel

### 1. Frontend (Client)

**Fichier** : `app/page.tsx`

- L'utilisateur sélectionne ou dépose une image via `ImageUploadPanel`
- L'image est prévisualisée localement
- Au clic sur le bouton "Test", un `FormData` est créé avec :
  - `image` : le fichier image
  - `promptType` : "realistic" | "marketing" | "stylized" (par défaut "realistic")
- Requête POST vers `/api/clean-image`

### 2. API Route Handler

**Fichier** : `app/api/clean-image/route.ts`

**Fonctionnalités** :
- Gestion CORS (headers configurables via `ALLOWED_ORIGINS`)
- Parsing du FormData avec `formidable`
- Validation du type d'image (PNG, JPG uniquement)
- Optimisation de l'image avec Sharp (redimensionnement max 2048x2048, qualité 90%)
- Appel à `processImageTransformation()` pour la transformation IA
- Upload du résultat vers Cloudinary
- Retour d'une réponse JSON avec l'URL de l'image générée

**Configuration** :
- `runtime: "nodejs"` (obligatoire pour Sharp et Vertex AI)
- `maxDuration: 60` secondes (pour Vercel Pro)

### 3. Traitement IA

**Fichier** : `lib/vertex-ai.ts`

#### Étape 1 : Analyse avec Gemini Vision

**Fonction** : `analyzeMessyRoom(imageBuffer: Buffer)`

- Convertit l'image en base64
- Envoie à Gemini 2.0 Flash Exp avec un prompt d'analyse détaillée
- Retourne une description textuelle complète incluant :
  - Type de pièce et layout
  - Éléments architecturaux (fenêtres, portes, murs)
  - Meubles et positions exactes
  - Éclairage et palette de couleurs
  - Éléments en désordre à retirer
  - Angle de caméra et perspective

#### Étape 2 : Génération avec Imagen 3

**Fonction** : `generateCleanImage(analysis, promptType, originalImageBuffer?)`

- Utilise l'API REST d'Imagen 3 (pas le SDK)
- Authentification via Google Auth Library (service account)
- **Mode image-to-image** : utilise l'image originale comme `baseImage` pour préserver la structure
- Paramètres importants :
  - `imageEditingStrength: 0.7` (fidélité à l'original)
  - `guidanceScale: 7.5` (fidélité au prompt)
  - `aspectRatio: "1:1"`
  - `negativePrompt` pour éviter les artefacts
- Retourne un Buffer de l'image générée

#### Fonction principale

**Fonction** : `processImageTransformation(imageBuffer, promptType)`

- Orchestre les deux étapes
- Retourne `{ generatedImage: Buffer, analysis: string }`

### 4. Prompts IA

**Fichier** : `lib/prompts.ts`

#### Prompt d'analyse (`ANALYSIS_PROMPT`)

Extrêmement détaillé pour extraire tous les éléments structurels nécessaires à la préservation de la pièce.

#### Prompts de génération (`GENERATION_PROMPTS`)

Trois variantes selon le style souhaité :
- **realistic** : Transformation naturelle, même pièce après nettoyage
- **marketing** : Style magazine, professionnel, aspirational
- **stylized** : Esthétique minimaliste, Pinterest-worthy

Tous les prompts insistent sur la **PRÉSERVATION** de la structure exacte.

### 5. Upload Cloudinary

**Fichier** : `lib/cloudinary.ts`

**Fonction** : `uploadToCloudinary(imageBuffer, options)`

- Configuration lazy (validation au moment de l'utilisation)
- Upload via stream
- Options par défaut :
  - `folder: "clear-ai/generated"`
  - `format: "jpg"`
  - `quality: "auto:good"`
- Retourne les métadonnées (URL, dimensions, format, etc.)

### 6. Gestion des fichiers

**Fichier** : `utils/file-handler.ts`

**Fonctions** :
- `parseFormData()` : Convertit NextRequest FormData en format formidable
- `processImage()` : Validation taille + optimisation Sharp
- `validateImageType()` : Vérification MIME type

## 🔐 Configuration et variables d'environnement

### Variables requises

```env
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GCP_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account.json

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS (optionnel)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Taille max fichier (optionnel, défaut 10MB)
MAX_FILE_SIZE_MB=10
```

### Authentification Google Cloud

- Utilise un service account JSON (`gcp-service-account.json`)
- Scopes : `https://www.googleapis.com/auth/cloud-platform`
- Lazy initialization pour permettre le chargement des variables d'environnement

## 📊 Types TypeScript

**Fichier** : `types/index.ts`

```typescript
interface CleanImageRequest {
  imageFile: File;
  promptType?: "realistic" | "marketing" | "stylized";
}

interface CleanImageResponse {
  success: boolean;
  generatedImageUrl?: string;
  meta?: {
    width: number;
    height: number;
    format: string;
    analysisText?: string;
  };
  error?: string;
  details?: string;
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}
```

## 🎨 Interface utilisateur

### Composants principaux

1. **ImageUploadPanel** : Zone de drag & drop avec prévisualisation
2. **ImageResultPanel** : Affichage du résultat avec état de chargement
3. **ArrowConnector** : Connecteur visuel entre avant/après
4. **TestCTA** : Bouton d'action principal
5. **Header** : En-tête de l'application

### Design

- Design moderne avec Tailwind CSS
- Responsive (grid adaptatif)
- États visuels : drag & drop, chargement, erreur
- Badges "Avant" / "Après" pour identifier les panneaux

## ⚠️ Points d'attention pour la migration API

### 1. Authentification Vertex AI

- Actuellement : Service account JSON avec Google Auth Library
- Lazy initialization dans `lib/vertex-ai.ts`
- Token obtenu via `auth.getClient().getAccessToken()`

### 2. Appel API Imagen 3

- **Méthode** : API REST (pas le SDK)
- **URL** : `https://{location}-aiplatform.googleapis.com/v1/projects/{projectId}/locations/{location}/publishers/google/models/imagen-3.0-generate-002:predict`
- **Méthode HTTP** : POST
- **Headers** : `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Body** : Structure complexe avec `instances`, `parameters`, `baseImage` (optionnel)

### 3. Gestion des erreurs

- Vérification que la réponse n'est pas du HTML (erreur API)
- Parsing JSON avec gestion d'erreurs
- Validation de la structure de réponse (`predictions` array)
- Support de différents formats de réponse (`bytesBase64Encoded`, `image`, string)

### 4. Mode image-to-image

- Utilisation de `baseImage` avec `bytesBase64Encoded`
- Paramètre `imageEditingStrength` pour contrôler la fidélité
- **Note** : Ces paramètres pourraient ne pas être supportés par toutes les versions d'Imagen

### 5. CORS

- Headers CORS configurables
- Support OPTIONS pour preflight
- Origine vérifiée contre `ALLOWED_ORIGINS`

### 6. Traitement d'image

- Sharp utilisé pour optimisation (peut être absent sur certaines plateformes)
- Fallback vers buffer original si Sharp indisponible
- Redimensionnement max 2048x2048, qualité 90%

## 🚀 Déploiement

### Configuration Vercel

- Runtime Node.js requis
- Timeout max 60 secondes (Vercel Pro)
- Variables d'environnement à configurer
- Service account JSON à inclure (ou utiliser Vercel Secrets)

### Scripts disponibles

```bash
pnpm dev      # Développement local
pnpm build    # Build de production
pnpm start    # Serveur de production
pnpm lint     # Linting
```

## 📝 Notes importantes

1. **Préservation de structure** : Le système est conçu pour préserver la structure exacte de la pièce (inspiré de Nano Banana), pas pour générer une nouvelle pièce.

2. **Image-to-image** : L'utilisation de `baseImage` est cruciale pour obtenir des résultats similaires à Nano Banana. Si l'API ne supporte pas ce paramètre, les prompts détaillés devraient quand même aider.

3. **Gestion d'erreurs robuste** : Le code gère plusieurs cas d'erreur (Sharp indisponible, réponse HTML, parsing JSON, etc.)

4. **Lazy initialization** : Les clients Vertex AI et Cloudinary sont initialisés de manière lazy pour permettre le chargement des variables d'environnement.

5. **Optimisation images** : Sharp est utilisé mais avec fallback si indisponible (important pour compatibilité Windows/autres plateformes).

## 🔄 Migration API - Points à considérer

Lors de la migration vers une nouvelle API :

1. **Structure de requête** : Adapter le format de requête Imagen 3
2. **Authentification** : Vérifier le système d'auth (service account, API key, etc.)
3. **Paramètres** : Vérifier quels paramètres sont supportés (`baseImage`, `imageEditingStrength`, etc.)
4. **Format de réponse** : Adapter le parsing selon le format de réponse
5. **Gestion d'erreurs** : Adapter selon les codes d'erreur de la nouvelle API
6. **Timeout** : Vérifier les limites de temps d'exécution
7. **Rate limiting** : Gérer les limites de requêtes si nécessaire

## 📚 Documentation supplémentaire

- `AMELIORATIONS-NANO-BANANA.md` : Détails sur les améliorations pour se rapprocher de Nano Banana
- `CONFIGURATION-CLOUDINARY.md` : Configuration Cloudinary
- `SOLUTION-SHARP-WINDOWS.md` : Solutions pour Sharp sur Windows
- `INSTALL-SHADCN.md` : Installation des composants UI

