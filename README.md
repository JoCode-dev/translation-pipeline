
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)

# Translation Pipeline

Un pipeline de traduction automatisé utilisant l'API DeepL pour traduire des contenus dans plusieurs langues. Ce projet est conçu pour traiter des données JSON extraites d'un backend et générer des fichiers de traduction organisés par langue.

## Fonctionnalités

- ✅ Traduction automatique via l'API DeepL
- ✅ Support multi-langues (FR, EN, DE, IT)
- ✅ Système de cache pour éviter les traductions redondantes
- ✅ Gestion des erreurs et limitation de taux
- ✅ Logging détaillé des traductions
- ✅ Hash de contenu pour détecter les changements
- ✅ Génération dynamique de clés de traduction

## Structure du Projet

```
translation-pipeline/
├── data/                    # Données brutes (extraites du backend)
│   ├── categories.json
│   └── products.json
├── locales/                 # Fichiers de traduction par langue
│   ├── fr.json
│   ├── en.json
│   ├── de.json
│   └── it.json
├── logs/                    # Logs de traduction
├── .cache/                  # Cache pour éviter les traductions inutiles
├── services/                # Services externes
│   └── deeplService.ts      # Intégration DeepL avec gestion des erreurs
├── utils/                   # Fonctions utilitaires
│   ├── hash.ts             # Hash SHA1 du contenu
│   ├── json.ts             # Lecture/écriture JSON profonde
│   ├── keys.ts             # Génération dynamique de clés
│   └── logger.ts           # Système de logging
└── scripts/                # Scripts principaux
    └── translate.ts        # Script principal de traduction
```

## Tech Stack

- **Runtime:** Node.js
- **Langage:** TypeScript
- **API de traduction:** DeepL
- **Gestionnaire de paquets:** pnpm

## Prérequis

- Node.js (version 16+)
- pnpm
- Clé API DeepL

## Installation

Clonez le projet :

```bash
git clone [URL_DU_REPO]
cd translation-pipeline
```

Installez les dépendances :

```bash
pnpm install
```

Configurez votre clé API DeepL :

```bash
# Créez un fichier .env
echo "DEEP_L_API_KEY=votre_cle_api" > .env
```

## Utilisation

### Commandes disponibles

Le pipeline de traduction offre plusieurs commandes pour différentes tâches :

#### Traduction principale
```bash
# Traduction interactive (avec prompts)
pnpm run translate

# Exécuter la traduction directement
pnpm run translate:run

# Traduction avec options spécifiques
pnpm run translate:run --source="products.json" --target="en,de" --verbose
```

#### Vérification et maintenance
```bash
# Vérifier les traductions manquantes
pnpm run translate:check-missing

# Générer/régénérer le cache
pnpm run translate:generate-cache

# Synchroniser les traductions
pnpm run translate:sync

# Réinitialiser le système
pnpm run translate:reset
```

### Traduction des données

Placez vos fichiers JSON sources dans le dossier `data/` et lancez une des commandes de traduction ci-dessus.

### Structure des données d'entrée

Les fichiers dans `data/` doivent suivre un format JSON standard. Le pipeline génère automatiquement des clés de traduction basées sur la structure des données.

### Fichiers de sortie

Les traductions sont sauvegardées dans `locales/` avec la structure suivante :
- `fr.json` - Français
- `en.json` - Anglais  
- `de.json` - Allemand
- `it.json` - Italien

## Fonctionnalités avancées

### Système de cache

Le pipeline utilise un système de cache basé sur le hash SHA1 du contenu pour éviter de retraduire le même contenu. Le cache est stocké dans `.cache/translated-refs.json`.

### Logging

Tous les événements de traduction sont enregistrés dans `logs/` avec un horodatage pour faciliter le débogage et le suivi.

### Gestion des erreurs

Le service DeepL inclut :
- Gestion automatique des limites de taux
- Retry automatique en cas d'erreur temporaire
- Logging détaillé des erreurs

## Configuration

Vous pouvez configurer les langues cibles et autres paramètres dans le script `translate.ts`.

## Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feat/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'feat: ajouter nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feat/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

[MIT](https://choosealicense.com/licenses/mit/)

## Support

Pour obtenir de l'aide, ouvrez une issue sur GitHub.

