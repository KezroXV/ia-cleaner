# Améliorations pour se rapprocher de Nano Banana

## 🎯 Objectif

Transformer le projet pour obtenir des résultats similaires à **Nano Banana**, qui génère des images en préservant la structure exacte de l'image originale (image-to-image editing).

## 🔍 Problème identifié

**Avant** : Le système générait une **nouvelle image** basée uniquement sur une description textuelle, ce qui ne préservait pas la structure exacte de l'image originale.

**Maintenant** : Le système utilise l'image originale comme **référence** pour préserver la structure exacte, comme Nano Banana.

## ✨ Améliorations apportées

### 1. **Analyse améliorée avec Gemini Vision**

Le prompt d'analyse a été considérablement amélioré pour extraire **beaucoup plus de détails structurels** :

- **Architecture précise** : positions exactes des fenêtres, portes, murs
- **Meubles et positions** : emplacement exact, tailles, orientations
- **Éclairage détaillé** : sources de lumière, directions, ombres
- **Palette de couleurs** : couleurs dominantes et accents
- **Perspective caméra** : angle de vue, point focal, profondeur

**Fichier modifié** : `lib/prompts.ts` - `ANALYSIS_PROMPT`

### 2. **Prompts de génération améliorés**

Les trois types de prompts (realistic, marketing, stylized) ont été améliorés pour :

- **PRÉSERVER** la structure identique de la pièce
- **MAINTENIR** les positions exactes des meubles
- **GARDER** le même angle de caméra et perspective
- **ENLEVER** uniquement le désordre et nettoyer les surfaces

**Fichier modifié** : `lib/prompts.ts` - `GENERATION_PROMPTS`

### 3. **Mode Image-to-Image (comme Nano Banana)**

La fonction `generateCleanImage` a été modifiée pour :

- **Accepter l'image originale** comme paramètre de référence
- **Utiliser l'image comme base** pour l'édition (au lieu de générer de zéro)
- **Préserver la structure** exacte de la pièce

**Fichier modifié** : `lib/vertex-ai.ts` - `generateCleanImage()`

### 4. **Paramètres améliorés**

Ajout de paramètres pour améliorer la qualité :

- `imageEditingStrength: 0.7` : Contrôle la fidélité à l'image originale
- `guidanceScale: 7.5` : Contrôle la fidélité au prompt
- Meilleur `negativePrompt` pour éviter les artefacts

## 📋 Comment ça fonctionne maintenant

### Flux amélioré :

1. **Upload de l'image** → Validation et optimisation
2. **Analyse détaillée** → Gemini Vision extrait TOUS les détails structurels
3. **Génération avec référence** → Imagen 3 utilise l'image originale comme base
4. **Édition précise** → Seuls le désordre et les saletés sont enlevés
5. **Structure préservée** → La pièce reste identique, juste nettoyée

## ⚠️ Note importante

L'API Imagen 3 pourrait ne pas supporter tous les paramètres ajoutés (`baseImage`, `imageEditingStrength`, `guidanceScale`). 

**Si vous obtenez des erreurs** lors de la génération :

1. Vérifiez les logs pour voir quel paramètre cause l'erreur
2. Retirez les paramètres non supportés de la requête
3. Le système fonctionnera toujours, mais avec moins de contrôle sur la préservation de la structure

**Alternative** : Si l'API ne supporte pas `baseImage`, les prompts améliorés devraient quand même donner de meilleurs résultats car ils sont beaucoup plus précis sur la structure à préserver.

## 🧪 Test

Pour tester les améliorations :

```bash
# Tester avec une image
npm run test:imagen
# ou
pnpm test:imagen
```

## 📊 Résultats attendus

Avec ces améliorations, vous devriez obtenir :

✅ **Structure identique** : La même pièce, mêmes meubles, même agencement  
✅ **Nettoyage précis** : Seul le désordre est enlevé  
✅ **Cohérence visuelle** : Même éclairage, même palette de couleurs  
✅ **Qualité professionnelle** : Résultats comparables à Nano Banana  

## 🔄 Prochaines étapes possibles

Si vous voulez aller encore plus loin :

1. **Tester avec différentes valeurs** de `imageEditingStrength` (0.5 à 0.9)
2. **Ajuster les prompts** selon vos résultats réels
3. **Ajouter des contrôles utilisateur** pour choisir le niveau de préservation
4. **Implémenter l'inpainting** pour des modifications plus précises

