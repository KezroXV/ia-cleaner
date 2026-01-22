# 🚀 Guide d'Utilisation - Systèmes Spécialisés

Ce guide vous explique comment utiliser les deux nouveaux systèmes spécialisés de IA Cleaner.

---

## 🏁 Démarrage Rapide

### Prérequis

1. **Clé API Gemini** configurée dans `.env.local` :
   ```bash
   GOOGLE_GEMINI_API_KEY=votre_cle_api
   ```

2. **Serveur de développement** en cours d'exécution :
   ```bash
   npm run dev
   ```

---

## 🚗 Système Voiture

### Utilisation via API

**Endpoint** : `POST /api/clean-car`

**Paramètres** :
- `image` : Fichier image de l'intérieur automobile
- `renderMode` : Mode de rendu (optionnel, par défaut `perfect-clean`)
  - `perfect-clean` : 92% fidélité - Nettoyage professionnel
  - `enhanced-beauty` : 85% fidélité - Magazine haute gamme
  - `stylized-luxury` : 70% fidélité - Style luxe aspirationnel

### Exemple JavaScript

```javascript
const formData = new FormData();
formData.append('image', carImageFile);
formData.append('renderMode', 'perfect-clean');

const response = await fetch('http://localhost:3000/api/clean-car', {
  method: 'POST',
  body: formData
});

const result = await response.json();

if (result.success) {
  console.log('Image nettoyée:', result.generatedImageUrl);
  console.log('Type détecté:', result.meta.spaceType);
  // result.meta.spaceType peut être:
  // - "car-interior-full" (habitacle complet)
  // - "car-seats" (sièges)
  // - "car-dashboard" (tableau de bord)
  // - "car-trunk" (coffre)
}
```

### Test via cURL

```bash
# Mode Perfect Clean (92% fidélité)
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@./test-images/car-interior.jpg" \
  -F "renderMode=perfect-clean"

# Mode Enhanced Beauty (85% fidélité)
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@./test-images/car-interior.jpg" \
  -F "renderMode=enhanced-beauty"

# Mode Stylized Luxury (70% fidélité)
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@./test-images/car-interior.jpg" \
  -F "renderMode=stylized-luxury"
```

### Test via Script TypeScript

```bash
# Installer les dépendances (si nécessaire)
npm install

# Tester avec une image
npm run test:specialized car ./test-images/car.jpg perfect-clean
npm run test:specialized car ./test-images/car.jpg enhanced-beauty
npm run test:specialized car ./test-images/car.jpg stylized-luxury
```

---

## 🛋️ Système Canapé

### Utilisation via API

**Endpoint** : `POST /api/clean-sofa`

**Paramètres** :
- `image` : Fichier image du canapé/salon
- `renderMode` : Mode de rendu (optionnel, par défaut `professional-clean`)
  - `professional-clean` : 95% fidélité - Nettoyage professionnel
  - `magazine-worthy` : 85% fidélité - Magazine décoration
  - `designer-dream` : 70% fidélité - Style Pinterest aspirationnel

### Exemple JavaScript

```javascript
const formData = new FormData();
formData.append('image', sofaImageFile);
formData.append('renderMode', 'professional-clean');

const response = await fetch('http://localhost:3000/api/clean-sofa', {
  method: 'POST',
  body: formData
});

const result = await response.json();

if (result.success) {
  console.log('Image nettoyée:', result.generatedImageUrl);
  console.log('Type détecté:', result.meta.spaceType);
  // result.meta.spaceType peut être:
  // - "sofa" (canapé isolé)
  // - "sofa-living-room" (canapé dans salon)
  // - "living-room-full" (salon complet)
  // - "armchair" (fauteuil)
}
```

### Test via cURL

```bash
# Mode Professional Clean (95% fidélité)
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@./test-images/sofa.jpg" \
  -F "renderMode=professional-clean"

# Mode Magazine Worthy (85% fidélité)
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@./test-images/sofa.jpg" \
  -F "renderMode=magazine-worthy"

# Mode Designer Dream (70% fidélité)
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@./test-images/sofa.jpg" \
  -F "renderMode=designer-dream"
```

### Test via Script TypeScript

```bash
# Tester avec une image
npm run test:specialized sofa ./test-images/sofa.jpg professional-clean
npm run test:specialized sofa ./test-images/sofa.jpg magazine-worthy
npm run test:specialized sofa ./test-images/sofa.jpg designer-dream
```

---

## 📊 Comparaison des Modes de Rendu

### Système Voiture

| Mode | Fidélité | Temperature | Cas d'Usage | Créativité |
|------|----------|-------------|-------------|------------|
| **Perfect Clean** | 92% | 0.1 | Services de nettoyage, avant/après | Très faible |
| **Enhanced Beauty** | 85% | 0.2 | Marketing premium, brochures | Modérée |
| **Stylized Luxury** | 70% | 0.4 | Social media, Pinterest | Élevée |

### Système Canapé

| Mode | Fidélité | Temperature | Cas d'Usage | Créativité |
|------|----------|-------------|-------------|------------|
| **Professional Clean** | 95% | 0.05 | Services de nettoyage, annonces | Très très faible |
| **Magazine Worthy** | 85% | 0.15 | Magazines déco, portfolios | Modérée |
| **Designer Dream** | 70% | 0.35 | Instagram, Pinterest, inspiration | Élevée |

**💡 Règle générale** :
- **Fidélité élevée (90%+)** : Structure 100% identique, nettoyage seulement
- **Fidélité moyenne (85%)** : Structure identique + améliorations esthétiques
- **Fidélité basse (70%)** : Reconnaissance + créativité maximale

---

## 🔧 Dépannage

### Erreur "GOOGLE_GEMINI_API_KEY manquante"

```bash
# Créer/modifier .env.local
echo "GOOGLE_GEMINI_API_KEY=votre_cle_api" > .env.local

# Redémarrer le serveur
npm run dev
```

### Erreur "Quota dépassé"

Le système utilise Gemini 2.5 Flash Image. Si vous dépassez le quota :

1. Vérifiez votre quota sur https://aistudio.google.com/app/apikey
2. Attendez quelques minutes (le quota se réinitialise)
3. Upgradez votre plan si nécessaire

### Erreur "Image trop grande"

Les images sont automatiquement optimisées, mais si l'erreur persiste :

1. Réduisez la taille de l'image source
2. Compressez l'image avant upload
3. Maximum recommandé : 2048x2048 pixels

---

## 📝 Format de Réponse API

### Succès

```json
{
  "success": true,
  "generatedImageUrl": "https://res.cloudinary.com/...",
  "meta": {
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "analysisText": "Aperçu de l'analyse...",
    "spaceType": "car-interior-full",
    "renderMode": "perfect-clean"
  }
}
```

### Erreur

```json
{
  "success": false,
  "error": "Message d'erreur",
  "details": "Détails techniques (en développement seulement)"
}
```

---

## ⚡ Performance

### Temps de Traitement

- **Détection du type** : ~2-3 secondes
- **Analyse détaillée** : ~5-10 secondes
- **Génération image** : ~15-30 secondes
- **Total** : ~30-60 secondes par image

### Coûts

- **Coût par image** : ~$0.039
- **Processus** : 3 appels API Gemini (détection + analyse + génération)

---

## 🧪 Tests Recommandés

### Pour le Système Voiture

Testez avec des images variées :

1. **Habitacle complet** (sièges avant + arrière visibles)
2. **Sièges seuls** (focus sur banquette)
3. **Tableau de bord** (volant + écran + console)
4. **Coffre** (vue arrière du véhicule)

Variez les niveaux de saleté :
- Légèrement sale (quelques miettes)
- Modérément sale (taches, poussière visible)
- Très sale (déchets, beaucoup de crasse)

### Pour le Système Canapé

Testez avec des images variées :

1. **Canapé isolé** (fond neutre)
2. **Canapé dans salon** (meuble principal visible)
3. **Salon complet** (vue large avec décoration)
4. **Fauteuil** (siège individuel)

Variez les tissus :
- Cuir / simili-cuir
- Tissu uni
- Tissu à motifs
- Velours / microsuède

---

## 📞 Support

Pour toute question ou problème :

1. Consultez `SYSTEMES_SPECIALISES.md` pour la documentation technique
2. Vérifiez les logs du serveur pour les erreurs détaillées
3. Testez avec les scripts fournis pour isoler le problème

---

## 🎯 Bonnes Pratiques

### Images Sources

✅ **Recommandé** :
- Format JPG ou PNG
- Résolution 1024-2048 pixels
- Bonne luminosité
- Mise au point nette

❌ **À éviter** :
- Images floues
- Trop sombres
- Trop petites (<512px)
- Trop grandes (>4K)

### Choix du Mode

**Perfect Clean / Professional Clean** :
- Pour des photos avant/après réalistes
- Pour des annonces immobilières/commerciales
- Quand la fidélité maximale est requise

**Enhanced Beauty / Magazine Worthy** :
- Pour du marketing premium
- Pour des brochures professionnelles
- Quand l'esthétique compte autant que la réalité

**Stylized Luxury / Designer Dream** :
- Pour les réseaux sociaux
- Pour l'inspiration design
- Quand la créativité prime sur la fidélité
