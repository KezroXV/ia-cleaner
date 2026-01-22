# 🚗🛋️ Systèmes Spécialisés - Voiture & Canapé

Ce document décrit les deux nouveaux systèmes **complètement indépendants** ajoutés à IA Cleaner :

1. **Système Voiture** - Nettoyage d'intérieurs automobiles
2. **Système Canapé** - Nettoyage de canapés et salons

---

## 🚗 SYSTÈME VOITURE

### Architecture

Le système voiture est **complètement indépendant** du système général. Il possède ses propres :

- **Types** : `lib/types/car-types.ts`
- **Prompts** : `lib/prompts/car-prompts/`
- **Processor** : `lib/api/processors/car-processor.ts`
- **Endpoint API** : `app/api/clean-car/route.ts`

### Types d'Espaces Automobiles

```typescript
type CarSpaceType = 
  | "car-interior-full"   // Habitacle complet
  | "car-seats"           // Sièges uniquement
  | "car-dashboard"       // Tableau de bord et volant
  | "car-trunk";          // Coffre
```

### Modes de Rendu

Le système voiture propose **3 modes de rendu** avec des niveaux de fidélité différents :

#### 1. **Perfect Clean** (92% fidélité)
- **Cible** : Services de nettoyage, avant/après, annonces
- **Caractéristiques** :
  - Structure 100% identique
  - Couleurs légèrement accentuées
  - Contraste naturel augmenté
  - Aspect ultra-frais
- **Temperature** : 0.1 (très cohérent)

#### 2. **Enhanced Beauty** (85% fidélité)
- **Cible** : Marketing premium, brochures, catalogues
- **Caractéristiques** :
  - Éclairage optimisé
  - Couleurs vibrantes (+20-30%)
  - Composition professionnelle
  - Style magazine haute gamme
- **Temperature** : 0.2 (légère créativité)

#### 3. **Stylized Luxury** (70% fidélité)
- **Cible** : Social media, Pinterest, inspiration
- **Caractéristiques** :
  - Couleurs saturées et vibrantes
  - Éclairage cinématique
  - Esthétique aspirationnelle
  - Style luxe conceptuel
- **Temperature** : 0.4 (créativité maximale)

### Utilisation de l'API

**Endpoint** : `POST /api/clean-car`

**Paramètres** :
```typescript
{
  image: File,              // Image de l'intérieur automobile
  renderMode?: CarRenderMode // "perfect-clean" | "enhanced-beauty" | "stylized-luxury"
}
```

**Exemple de requête** :
```javascript
const formData = new FormData();
formData.append('image', carImageFile);
formData.append('renderMode', 'perfect-clean');

const response = await fetch('/api/clean-car', {
  method: 'POST',
  body: formData
});

const result = await response.json();
// result.generatedImageUrl contient l'image nettoyée
// result.meta.spaceType contient le type détecté (ex: "car-seats")
```

### Prompts Spécialisés

Le système voiture utilise des prompts ultra-spécialisés pour :

1. **Détection** : Identifier le type d'espace automobile
2. **Analyse** : Description détaillée avec focus sur :
   - Configuration des sièges
   - Matériaux automobiles (cuir, tissu, plastique)
   - Particules microscopiques dans les crevasses
   - Tableau de bord et volant
   - Problèmes spécifiques aux voitures (miettes, cendres, etc.)
3. **Génération** : Nettoyage avec préservation exacte de la structure

---

## 🛋️ SYSTÈME CANAPÉ

### Architecture

Le système canapé est **complètement indépendant** du système général. Il possède ses propres :

- **Types** : `lib/types/sofa-types.ts`
- **Prompts** : `lib/prompts/sofa-prompts/`
- **Processor** : `lib/api/processors/sofa-processor.ts`
- **Endpoint API** : `app/api/clean-sofa/route.ts`

### Types d'Espaces Canapé

```typescript
type SofaSpaceType = 
  | "sofa"                // Canapé isolé
  | "sofa-living-room"    // Canapé dans salon
  | "living-room-full"    // Salon complet avec canapé
  | "armchair";           // Fauteuil
```

### Modes de Rendu

Le système canapé propose **3 modes de rendu** avec des niveaux de fidélité différents :

#### 1. **Professional Clean** (95% fidélité)
- **Cible** : Services de nettoyage, annonces immobilières, location
- **Caractéristiques** :
  - Structure 100% identique
  - Couleurs restaurées comme neuves
  - Aspect ultra-frais et naturel
  - Nettoyage professionnel authentique
- **Temperature** : 0.05 (ultra-cohérent)

#### 2. **Magazine Worthy** (85% fidélité)
- **Cible** : Marketing premium, magazines déco, portfolios
- **Caractéristiques** :
  - Nettoyage complet + staging professionnel
  - Couleurs vibrantes et attractives
  - Éclairage optimisé
  - Composition beautifully styled
- **Temperature** : 0.15 (légère créativité)

#### 3. **Designer Dream** (70% fidélité)
- **Cible** : Instagram, Pinterest, inspiration design
- **Caractéristiques** :
  - Couleurs saturées et vibrantes
  - Éclairage cinématique
  - Style aspirationnel Pinterest-perfect
  - Transformation créative luxe
- **Temperature** : 0.35 (créativité élevée)

### Utilisation de l'API

**Endpoint** : `POST /api/clean-sofa`

**Paramètres** :
```typescript
{
  image: File,              // Image du canapé/salon
  renderMode?: SofaRenderMode // "professional-clean" | "magazine-worthy" | "designer-dream"
}
```

**Exemple de requête** :
```javascript
const formData = new FormData();
formData.append('image', sofaImageFile);
formData.append('renderMode', 'professional-clean');

const response = await fetch('/api/clean-sofa', {
  method: 'POST',
  body: formData
});

const result = await response.json();
// result.generatedImageUrl contient l'image nettoyée
// result.meta.spaceType contient le type détecté (ex: "sofa-living-room")
```

### Prompts Spécialisés

Le système canapé utilise des prompts ultra-spécialisés pour :

1. **Détection** : Identifier le type d'espace canapé/salon
2. **Analyse** : Description détaillée avec focus sur :
   - Type de tissu (cuir, microsuède, lin, velours, etc.)
   - Configuration des coussins
   - Taches absorbées dans le tissu
   - Pieds et structure du canapé
   - Contexte du salon (si visible)
3. **Génération** : Nettoyage avec préservation exacte du tissu et des couleurs

---

## 📂 Structure des Fichiers

```
ia-cleaner/
├── lib/
│   ├── types/
│   │   ├── car-types.ts          # Types voiture
│   │   ├── sofa-types.ts         # Types canapé
│   │   └── index.ts              # Export centralisé
│   │
│   ├── prompts/
│   │   ├── car-prompts/
│   │   │   ├── detection.ts      # Détection type d'espace auto
│   │   │   ├── analysis.ts       # Analyse intérieur auto
│   │   │   ├── generation.ts     # Génération (3 modes)
│   │   │   └── index.ts
│   │   │
│   │   ├── sofa-prompts/
│   │   │   ├── detection.ts      # Détection type d'espace canapé
│   │   │   ├── analysis.ts       # Analyse canapé/salon
│   │   │   ├── generation.ts     # Génération (3 modes)
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts              # Export centralisé
│   │
│   └── api/
│       └── processors/
│           ├── car-processor.ts   # Logique complète voiture
│           ├── sofa-processor.ts  # Logique complète canapé
│           └── index.ts
│
└── app/
    └── api/
        ├── clean-car/
        │   └── route.ts          # Endpoint voiture
        │
        └── clean-sofa/
            └── route.ts          # Endpoint canapé
```

---

## 🎯 Pourquoi des Systèmes Indépendants ?

### Problèmes Spécifiques aux Voitures
- Particules microscopiques dans les crevasses
- Géométrie complexe (sièges, volant, tableau de bord)
- Matériaux automobiles spécifiques (cuir perforé, plastique soft-touch)
- Problèmes uniques (miettes entre sièges, cendres, boissons renversées)

### Problèmes Spécifiques aux Canapés
- Tissus variés nécessitant des analyses différentes
- Taches absorbées dans le tissu
- Perte de couleur et décoloration
- Pilling et usure du tissu
- Contexte du salon à préserver

**Fusionner ces deux domaines** avec le système général rendrait **impossible** de tenir les promesses de qualité pour chacun.

---

## 🧪 Tests & Validation

### Tests Voiture

```bash
# Test perfect-clean (92% fidélité)
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@test-car-interior.jpg" \
  -F "renderMode=perfect-clean"

# Test enhanced-beauty (85% fidélité)
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@test-car-interior.jpg" \
  -F "renderMode=enhanced-beauty"

# Test stylized-luxury (70% fidélité)
curl -X POST http://localhost:3000/api/clean-car \
  -F "image=@test-car-interior.jpg" \
  -F "renderMode=stylized-luxury"
```

### Tests Canapé

```bash
# Test professional-clean (95% fidélité)
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@test-sofa.jpg" \
  -F "renderMode=professional-clean"

# Test magazine-worthy (85% fidélité)
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@test-sofa.jpg" \
  -F "renderMode=magazine-worthy"

# Test designer-dream (70% fidélité)
curl -X POST http://localhost:3000/api/clean-sofa \
  -F "image=@test-sofa.jpg" \
  -F "renderMode=designer-dream"
```

---

## ✅ Checklist de Validation

### Système Voiture
- [ ] Types créés et exportés
- [ ] Prompts de détection fonctionnels
- [ ] Prompts d'analyse ultra-détaillés
- [ ] Prompts de génération pour les 3 modes
- [ ] Processor fonctionnel
- [ ] Endpoint API opérationnel
- [ ] Test perfect-clean validé
- [ ] Test enhanced-beauty validé
- [ ] Test stylized-luxury validé
- [ ] Fidélité conforme aux cibles

### Système Canapé
- [ ] Types créés et exportés
- [ ] Prompts de détection fonctionnels
- [ ] Prompts d'analyse ultra-détaillés
- [ ] Prompts de génération pour les 3 modes
- [ ] Processor fonctionnel
- [ ] Endpoint API opérationnel
- [ ] Test professional-clean validé
- [ ] Test magazine-worthy validé
- [ ] Test designer-dream validé
- [ ] Fidélité conforme aux cibles

---

## 💰 Coûts

Les deux systèmes utilisent **Gemini 2.5 Flash Image** :

- **Coût par image** : ~$0.039
- **Processus** : Détection → Analyse → Génération (3 appels API)
- **Durée estimée** : 30-60 secondes par image

---

## 🚀 Prochaines Étapes

1. **Tests approfondis** avec images réelles
2. **Validation des niveaux de fidélité** (92%, 85%, 70% pour voiture / 95%, 85%, 70% pour canapé)
3. **Optimisation des prompts** selon les résultats
4. **Documentation utilisateur** pour le frontend
5. **Intégration UI** pour les modes de rendu

---

## 📝 Notes Techniques

### Configuration Gemini par Mode

**Voiture** :
- Perfect Clean : temp=0.1, topK=20, topP=0.8
- Enhanced Beauty : temp=0.2, topK=25, topP=0.85
- Stylized Luxury : temp=0.4, topK=40, topP=0.95

**Canapé** :
- Professional Clean : temp=0.05, topK=15, topP=0.75
- Magazine Worthy : temp=0.15, topK=30, topP=0.85
- Designer Dream : temp=0.35, topK=45, topP=0.95

Ces configurations garantissent le bon équilibre entre **fidélité** et **créativité** pour chaque mode.
