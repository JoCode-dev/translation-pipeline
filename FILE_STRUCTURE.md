translation-pipeline/
├── data/ # Raw data (extracted from the backend)
│ ├── categories.json
│ └── products.json
│ 
├── locales/ # Translation files by language
│ ├── fr.json
│ ├── en.json
│ ├── de.json
│ └── it.json
│ 
├── logs/ # Translation logs
│ └── translation-log-2025-07-09.json
│ 
├── .cache/ # Cache to avoid unnecessary translations
│ └── translated-refs.json
│ 
├── services/ # External or internal services
│ └── deeplService.ts # DeepL integration with rate limit & error handling
│ 
├── utils/ # Utility functions
│ ├── hash.ts # SHA1 hash of content
│ ├── json.ts # Deep JSON file reading/writing
│ ├── keys.ts # Dynamic key generation
│ └── logger.ts # Logging system
│ 
├── scripts/ # Main script entry points
│ └── translate.ts # Main translation script
│ 
├── tsconfig.json # TypeScript config
└── package.json # Dépendances
