# Fix Nano Banana - Utilisation du Bon Modèle

## Problème Initial

Le code utilisait `gemini-2.0-flash-exp` qui est un **modèle texte uniquement**.

## Solution

Utiliser `gemini-2.5-flash-image-preview` qui est **Nano Banana** - le modèle qui génère des images.

## Changements Effectués

### 1. Modèle Corrigé

**Avant** :
```typescript
model: 'gemini-2.0-flash-exp' // ❌ Texte uniquement
```

**Après** :
```typescript
model: 'gemini-2.5-flash-image-preview' // ✅ Nano Banana !
```

### 2. Fonction Simplifiée

Suppression de la fonction `generateImageFromDescription` car Nano Banana génère directement les images.

### 3. Gestion d'Erreurs Améliorée

Messages d'erreur plus clairs pour :
- Billing non activé
- Quota dépassé  
- API key invalide

## Vérification

Pour vérifier que tu utilises le bon modèle :
```bash
# Cherche dans le code
grep -r "gemini-2.0-flash-exp" lib/

# Ne devrait rien retourner !
```

Si tu vois encore `gemini-2.0-flash-exp`, remplace par `gemini-2.5-flash-image-preview`.

## Tests

```bash
# Test complet
npm run test:nano

# Si succès, tu devrais voir :
# ✅ Image générée avec succès
# 🔗 URL de l'image générée
```

## Coûts

- **Nano Banana** : $0.039 par image (1024x1024)
- **Avec $1** : ~25 images
- **Gratuit dans AI Studio** pour prototyper

## Billing

**IMPORTANT** : Le billing DOIT être activé sur ton projet Google Cloud.

1. Va sur https://console.cloud.google.com/billing
2. Sélectionne ton projet (celui de la clé API)
3. Active le billing
4. Ajoute une carte de crédit

Sans billing, tu auras l'erreur : "Billing not enabled"

## Exemple de Code Correct

```typescript
// BON EXEMPLE - FONCTIONNE
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash-image-preview',
});

const result = await model.generateContent([
  { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
  { text: 'Clean this messy room' },
]);

// L'image est dans response.candidates[0].content.parts[X].inlineData.data
```

## Ressources

- [Nano Banana Docs](https://ai.google.dev/gemini-api/docs/image-generation)
- [Pricing](https://ai.google.dev/gemini-api/docs/pricing#gemini-2.5-flash-image-preview)
- [AI Studio](https://aistudio.google.com/) (test gratuit)

