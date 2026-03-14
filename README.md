# HACCP Audit — Certification Agro-alimentaire Maroc

Application d'audit HACCP pour la certification des sociétés agro-alimentaires marocaines.

## Fonctionnalités

- Authentification par code d'accès (1317)
- Fiche société complète (identité, activité, audit)
- Chaîne de production interactive par secteur (11 secteurs)
- Questionnaire d'audit HACCP (12 catégories, questions adaptées au secteur)
- Rapport d'analyse avec scores, écarts, préconisations
- Génération PDF du rapport complet avec signatures

## Déploiement sur Netlify

### Méthode 1 : Depuis GitHub (recommandé)

1. **Créer un repo GitHub** :
   ```bash
   cd haccp-audit-maroc
   git init
   git add .
   git commit -m "Initial commit - HACCP Audit App"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/haccp-audit-maroc.git
   git push -u origin main
   ```

2. **Connecter à Netlify** :
   - Aller sur [app.netlify.com](https://app.netlify.com)
   - Cliquer **"Add new site"** → **"Import an existing project"**
   - Sélectionner **GitHub** et choisir le repo `haccp-audit-maroc`
   - Les paramètres sont auto-détectés via `netlify.toml` :
     - Build command : `npm run build`
     - Publish directory : `dist`
   - Cliquer **"Deploy site"**

3. **Configurer la clé API** (pour la génération PDF) :
   - Aller dans **Site settings** → **Environment variables**
   - Ajouter : `ANTHROPIC_API_KEY` = `sk-ant-votre-cle-api`
   - Redéployer le site

### Méthode 2 : Déploiement manuel (drag & drop)

> Note : cette méthode ne supporte PAS la génération PDF (pas de serverless functions)

1. **Builder le projet localement** :
   ```bash
   npm install
   npm run build
   ```

2. **Déployer** :
   - Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
   - Glisser-déposer le dossier `dist/`

### Méthode 3 : Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer (preview)
netlify deploy

# Déployer en production
netlify deploy --prod

# Configurer la variable d'environnement
netlify env:set ANTHROPIC_API_KEY "sk-ant-votre-cle-api"
```

## Structure du projet

```
haccp-audit-maroc/
├── index.html              # Point d'entrée HTML
├── package.json            # Dépendances (React + Vite)
├── vite.config.js          # Config Vite
├── netlify.toml            # Config Netlify (build + functions + redirects)
├── .gitignore
├── .env.example            # Variables d'environnement requises
├── public/
│   └── favicon.svg         # Icône du site
├── src/
│   ├── main.jsx            # Point d'entrée React
│   └── App.jsx             # Application complète
└── netlify/
    └── functions/
        └── generate-pdf.js # Proxy API Anthropic (serverless)
```

## Variables d'environnement

| Variable | Description | Requis pour |
|----------|-------------|-------------|
| `ANTHROPIC_API_KEY` | Clé API Anthropic (claude) | Génération PDF |

## Développement local

```bash
npm install
npm run dev
```

L'app sera accessible sur `http://localhost:5173`

Pour tester la génération PDF localement :
```bash
# Créer un fichier .env à la racine
echo "ANTHROPIC_API_KEY=sk-ant-votre-cle" > .env

# Utiliser Netlify CLI pour lancer avec les functions
netlify dev
```

## Accès

- **Code d'accès** : `1317`

## Technologies

- React 18 + Vite 5
- Netlify Functions (serverless)
- Anthropic Claude API (génération PDF)
- CSS-in-JS (inline styles)
