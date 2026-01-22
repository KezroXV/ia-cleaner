# ⚡ Commandes Rapides - Systèmes Spécialisés

Guide de référence rapide pour utiliser les systèmes voiture et canapé.

---

## 🚀 Démarrage

```bash
# Installation des dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Le serveur démarre sur http://localhost:3000
```

---

## 🚗 Tests Système Voiture

### Via Script TypeScript

```bash
# Mode Perfect Clean (92% fidélité)
npm run test:specialized car ./images/car-interior.jpg perfect-clean

# Mode Enhanced Beauty (85% fidélité)
npm run test:specialized car ./images/car-interior.jpg enhanced-beauty

# Mode Stylized Luxury (70% fidélité)
npm run test:specialized car ./images/car-interior.jpg stylized-luxury
```

### Via cURL

```bash
# Mode Perfect Clean
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@./images/car-interior.jpg" \
  -F "renderMode=perfect-clean"

# Mode Enhanced Beauty
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@./images/car-interior.jpg" \
  -F "renderMode=enhanced-beauty"

# Mode Stylized Luxury
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@./images/car-interior.jpg" \
  -F "renderMode=stylized-luxury"
```

### Via JavaScript/Fetch

```javascript
// Upload image voiture
const formData = new FormData();
formData.append('image', carImageFile);
formData.append('renderMode', 'perfect-clean'); // ou 'enhanced-beauty', 'stylized-luxury'

const response = await fetch('http://localhost:3000/api/clean-car', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Image nettoyée:', result.generatedImageUrl);
console.log('Type détecté:', result.meta.spaceType);
```

---

## 🛋️ Tests Système Canapé

### Via Script TypeScript

```bash
# Mode Professional Clean (95% fidélité)
npm run test:specialized sofa ./images/sofa.jpg professional-clean

# Mode Magazine Worthy (85% fidélité)
npm run test:specialized sofa ./images/sofa.jpg magazine-worthy

# Mode Designer Dream (70% fidélité)
npm run test:specialized sofa ./images/sofa.jpg designer-dream
```

### Via cURL

```bash
# Mode Professional Clean
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@./images/sofa.jpg" \
  -F "renderMode=professional-clean"

# Mode Magazine Worthy
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@./images/sofa.jpg" \
  -F "renderMode=magazine-worthy"

# Mode Designer Dream
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@./images/sofa.jpg" \
  -F "renderMode=designer-dream"
```

### Via JavaScript/Fetch

```javascript
// Upload image canapé
const formData = new FormData();
formData.append('image', sofaImageFile);
formData.append('renderMode', 'professional-clean'); // ou 'magazine-worthy', 'designer-dream'

const response = await fetch('http://localhost:3000/api/clean-sofa', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Image nettoyée:', result.generatedImageUrl);
console.log('Type détecté:', result.meta.spaceType);
```

---

## 📋 Modes de Rendu - Référence Rapide

### 🚗 Voiture

| Mode | Commande | Fidélité | Cas d'Usage |
|------|----------|----------|-------------|
| **Perfect Clean** | `perfect-clean` | 92% | Services nettoyage, avant/après |
| **Enhanced Beauty** | `enhanced-beauty` | 85% | Marketing premium, brochures |
| **Stylized Luxury** | `stylized-luxury` | 70% | Social media, Pinterest |

### 🛋️ Canapé

| Mode | Commande | Fidélité | Cas d'Usage |
|------|----------|----------|-------------|
| **Professional Clean** | `professional-clean` | 95% | Services nettoyage, annonces |
| **Magazine Worthy** | `magazine-worthy` | 85% | Magazines déco, portfolios |
| **Designer Dream** | `designer-dream` | 70% | Instagram, Pinterest |

---

## 🛠️ Dépannage Rapide

### Vérifier que le serveur fonctionne

```bash
curl http://localhost:3000/api/health
```

### Vérifier les variables d'environnement

```bash
# Dans .env.local, vérifier :
cat .env.local | grep GOOGLE_GEMINI_API_KEY
```

### Réinstaller les dépendances

```bash
rm -rf node_modules package-lock.json
npm install
```

### Redémarrer le serveur

```bash
# Arrêter (Ctrl+C) puis redémarrer
npm run dev
```

---

## 📊 Vérifier les Logs

### Logs du Serveur

```bash
# Les logs s'affichent automatiquement dans le terminal où vous avez lancé npm run dev
# Recherchez les lignes commençant par :
# 🚗 (pour voiture)
# 🛋️ (pour canapé)
```

### Format des Logs

```
🚗 Nouvelle requête clean-car
📦 Parsing FormData...
✔️ Validation de l'image...
🔧 Optimisation de l'image...
🎨 Mode de rendu automobile: perfect-clean
🤖 Démarrage de la transformation automobile...
🔎 Étape 1/3: Détection du type d'espace automobile...
✅ Type d'espace automobile détecté: car-interior-full
📊 Étape 2/3: Analyse de l'intérieur automobile...
✅ Analyse automobile complétée: 5234 caractères
🎨 Étape 3/3: Génération de l'image nettoyée...
✅ Image automobile générée: 1234567 bytes
☁️ Upload du résultat...
✅ Succès en 42.5s
```

---

## 🔍 Exemples de Réponses API

### Succès

```json
{
  "success": true,
  "generatedImageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/clear-ai/car/car_perfect-clean_1234567890.jpg",
  "meta": {
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "analysisText": "This car interior features a modern dashboard layout with...",
    "spaceType": "car-interior-full",
    "renderMode": "perfect-clean"
  }
}
```

### Erreur

```json
{
  "success": false,
  "error": "Mode de rendu invalide. Modes autorisés: perfect-clean, enhanced-beauty, stylized-luxury"
}
```

---

## ⚙️ Configuration

### Variables d'Environnement Requises

```bash
# .env.local
GOOGLE_GEMINI_API_KEY=votre_cle_api_gemini
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_cloudinary_api_key
CLOUDINARY_API_SECRET=votre_cloudinary_api_secret
```

---

## 📈 Performance

### Temps Moyens

- **Détection** : 2-3 secondes
- **Analyse** : 5-10 secondes
- **Génération** : 15-30 secondes
- **Upload** : 2-5 secondes
- **Total** : ~30-60 secondes par image

### Coûts

- **Par image** : ~$0.039 (3 appels Gemini API)
- **Détection** : ~$0.013
- **Analyse** : ~$0.013
- **Génération** : ~$0.013

---

## 🎨 Exemples d'Utilisation

### Exemple 1 : Voiture Sale → Clean

```bash
# Image avec miettes, taches, désordre
npm run test:specialized car ./dirty-car.jpg perfect-clean

# Résultat : Même voiture, impeccablement propre, 92% fidélité
```

### Exemple 2 : Voiture → Marketing

```bash
# Même image, mais pour brochure
npm run test:specialized car ./dirty-car.jpg enhanced-beauty

# Résultat : Voiture propre, couleurs vibrantes, éclairage optimisé, 85% fidélité
```

### Exemple 3 : Voiture → Pinterest

```bash
# Même image, style aspirationnel
npm run test:specialized car ./dirty-car.jpg stylized-luxury

# Résultat : Version rêve de la voiture, couleurs saturées, 70% fidélité
```

### Exemple 4 : Canapé Taché → Clean

```bash
# Image avec taches, poussière
npm run test:specialized sofa ./dirty-sofa.jpg professional-clean

# Résultat : Même canapé, impeccablement nettoyé, 95% fidélité
```

### Exemple 5 : Canapé → Magazine

```bash
# Même image, pour magazine déco
npm run test:specialized sofa ./dirty-sofa.jpg magazine-worthy

# Résultat : Canapé propre + staging professionnel, 85% fidélité
```

---

## 🚨 Erreurs Courantes

### Erreur : "GOOGLE_GEMINI_API_KEY manquante"

```bash
# Solution
echo "GOOGLE_GEMINI_API_KEY=votre_cle" >> .env.local
npm run dev
```

### Erreur : "Quota dépassé"

```bash
# Attendre quelques minutes ou vérifier quota sur :
# https://aistudio.google.com/app/apikey
```

### Erreur : "Format d'image non supporté"

```bash
# Utiliser PNG ou JPG uniquement
# Convertir si nécessaire :
convert image.webp image.jpg
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

1. **SYSTEMES_SPECIALISES.md** - Documentation technique
2. **GUIDE_UTILISATION.md** - Guide utilisateur détaillé
3. **ARCHITECTURE.md** - Architecture et flux
4. **RECAP_CREATION.md** - Récapitulatif de création

---

## 💡 Astuces

### Test Rapide des 3 Modes

```bash
# Voiture
for mode in perfect-clean enhanced-beauty stylized-luxury; do
  npm run test:specialized car ./test.jpg $mode
done

# Canapé
for mode in professional-clean magazine-worthy designer-dream; do
  npm run test:specialized sofa ./test.jpg $mode
done
```

### Sauvegarder les Résultats

```bash
# Voiture
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@./test.jpg" \
  -F "renderMode=perfect-clean" \
  > result.json

# Extraire l'URL
cat result.json | jq -r '.generatedImageUrl'
```

---

## 🎯 Checklist de Test

- [ ] Serveur démarré (`npm run dev`)
- [ ] Variables d'environnement configurées
- [ ] Image de test préparée
- [ ] Tester détection automatique
- [ ] Tester les 3 modes voiture
- [ ] Tester les 3 modes canapé
- [ ] Vérifier la fidélité des résultats
- [ ] Vérifier les temps de traitement
- [ ] Valider les URLs générées

---

**Prêt à tester ! 🚀**
