# Installation des composants shadcn/ui

## Commandes d'installation

### Composants essentiels (actuellement utilisés)

```bash
npx shadcn@latest add button
```

### Composants recommandés pour l'avenir

```bash
# Pour les formulaires et inputs
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add select

# Pour les feedbacks utilisateur
npx shadcn@latest add alert
npx shadcn@latest add sonner
npx shadcn@latest add dialog
npx shadcn@latest add progress

# Pour l'affichage
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add badge

# Pour la navigation
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add tabs

# Pour les images et médias
npx shadcn@latest add avatar
npx shadcn@latest add skeleton
```

## Installation en une seule commande (tous les composants)

```bash
npx shadcn@latest add button input label textarea select alert sonner dialog progress card separator badge dropdown-menu sheet tabs avatar skeleton
```

## Installation par catégorie

### 1. Composants de base (essentiels)

```bash
npx shadcn@latest add button card
```

### 2. Composants de formulaire

```bash
npx shadcn@latest add input label textarea select
```

### 3. Composants de feedback

```bash
npx shadcn@latest add alert sonner dialog progress
```

### 4. Composants d'affichage

```bash
npx shadcn@latest add separator badge avatar skeleton
```

### 5. Composants de navigation

```bash
npx shadcn@latest add dropdown-menu sheet tabs
```

## Notes

- Tous les composants seront installés dans `components/ui/`
- Les dépendances nécessaires seront automatiquement ajoutées
- Les styles seront automatiquement configurés dans `globals.css`
