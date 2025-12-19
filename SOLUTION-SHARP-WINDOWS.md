# Solutions pour résoudre le problème Sharp sur Windows

## Solution 1 : Activer le Mode Développeur Windows (RECOMMANDÉ)

Le Mode Développeur Windows permet de créer des symlinks sans privilèges administrateur.

### Étapes :

1. **Ouvrir les Paramètres Windows**
   - Appuyez sur `Windows + I`
   - Ou allez dans Démarrer → Paramètres

2. **Aller dans Confidentialité et sécurité**
   - Cliquez sur "Confidentialité et sécurité" dans le menu de gauche

3. **Activer le Mode Développeur**
   - Cliquez sur "Pour les développeurs" dans le menu de gauche
   - Activez le bouton "Mode développeur"
   - Acceptez les avertissements si demandé

4. **Redémarrer le terminal**
   - Fermez tous les terminaux PowerShell/CMD
   - Rouvrez un nouveau terminal
   - Réessayez `pnpm install` ou `pnpm dev`

## Solution 2 : Exécuter en tant qu'Administrateur

Si vous ne pouvez pas activer le Mode Développeur :

1. **Fermer tous les terminaux**

2. **Ouvrir PowerShell en tant qu'Administrateur**
   - Clic droit sur PowerShell dans le menu Démarrer
   - Sélectionner "Exécuter en tant qu'administrateur"

3. **Naviguer vers le projet**
   ```powershell
   cd F:\Work\IA-cleaner\ia-cleaner
   ```

4. **Réinstaller les dépendances**
   ```powershell
   pnpm install
   ```

## Solution 3 : Configurer pnpm pour éviter les symlinks

Si les solutions ci-dessus ne fonctionnent pas, configurez pnpm pour ne pas utiliser de symlinks :

Le fichier `.npmrc` est déjà configuré avec :
```
shamefully-hoist=true
node-linker=hoisted
```

Cela devrait déjà éviter les symlinks. Si le problème persiste, essayez :

1. **Supprimer node_modules et réinstaller**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Recurse -Force .next
   pnpm install
   ```

## Solution 4 : Utiliser Sharp sans optimisation (Fallback)

Le code est déjà configuré pour fonctionner sans Sharp si nécessaire. L'application utilisera le buffer d'image original si Sharp n'est pas disponible.

## Recommandation

**Utilisez la Solution 1 (Mode Développeur)** - C'est la solution la plus propre et permanente. Une fois activé, vous n'aurez plus jamais ce problème avec les symlinks.

