# GitHub Repository Setup - CAO Tracker System

## Repository Informatie

**Repository URL**: https://github.com/Kipburger-lab/cao-tracker-system
**Clone URL**: https://github.com/Kipburger-lab/cao-tracker-system.git

## Branch Strategie

### Hoofdbranches
- **master**: Productie-klare code, stabiele releases
- **develop**: Ontwikkeling branch, integratie van nieuwe features

### Feature Branches
Voor nieuwe functionaliteiten:
```bash
git checkout develop
git checkout -b feature/cao-selectie
# Ontwikkel feature
git push -u origin feature/cao-selectie
# Maak Pull Request naar develop
```

### Hotfix Branches
Voor kritieke fixes:
```bash
git checkout master
git checkout -b hotfix/critical-bug
# Fix bug
git push -u origin hotfix/critical-bug
# Maak Pull Request naar master EN develop
```

## Workflow

### 1. Lokale Development
```bash
# Clone repository
git clone https://github.com/Kipburger-lab/cao-tracker-system.git
cd cao-tracker-system

# Switch naar develop branch
git checkout develop

# Maak nieuwe feature branch
git checkout -b feature/nieuwe-functionaliteit

# Ontwikkel en commit
git add .
git commit -m "feat: nieuwe functionaliteit toegevoegd"

# Push naar GitHub
git push -u origin feature/nieuwe-functionaliteit
```

### 2. Pull Requests
1. Maak Pull Request van feature branch naar develop
2. Code review en testing
3. Merge naar develop
4. Delete feature branch

### 3. Release Process
1. Test develop branch grondig
2. Maak Pull Request van develop naar master
3. Tag release in master
4. Deploy naar productie

## Commit Conventies

### Commit Message Format
```
type(scope): beschrijving

[optionele body]

[optionele footer]
```

### Types
- **feat**: Nieuwe functionaliteit
- **fix**: Bug fix
- **docs**: Documentatie wijzigingen
- **style**: Code formatting (geen functionaliteit wijziging)
- **refactor**: Code refactoring
- **test**: Test toevoegingen of wijzigingen
- **chore**: Build process of auxiliary tool wijzigingen

### Voorbeelden
```bash
git commit -m "feat(cao-selectie): CAO lijst component toegevoegd"
git commit -m "fix(frontend): datumfilter bug opgelost"
git commit -m "docs(readme): installatie instructies bijgewerkt"
git commit -m "refactor(api): CAO endpoints geherstructureerd"
```

## Project Structuur in Repository

```
cao-tracker-system/
├── .gitignore                 # Git ignore regels
├── README.md                  # Project overzicht
├── PROJECT_PLAN.md           # Sprint planning
├── TODOIST_TASKS.md          # Takenlijst
├── CAO_DATABASE.md           # CAO database documentatie
├── GITHUB_SETUP.md           # Deze file
├── frontend/                 # Frontend applicatie
│   ├── index.html
│   ├── css/
│   └── js/
├── backend/                  # Backend API (toekomstig)
│   ├── app.py
│   ├── requirements.txt
│   └── models/
└── docs/                     # Aanvullende documentatie
```

## Belangrijke Bestanden

### .gitignore
Voorkomt dat gevoelige bestanden worden gecommit:
- API keys en secrets
- Database bestanden
- CAO documenten (privacy)
- Dependency directories
- IDE configuraties

### README.md
Hoofdoverzicht van het project met:
- Systeem architectuur
- Installatie instructies
- Workflow beschrijving
- Technische stack

## Security & Privacy

### Gevoelige Data
- **NOOIT** API keys committen
- **NOOIT** echte CAO documenten committen
- **NOOIT** database credentials committen
- Gebruik environment variables voor configuratie

### .env Template
```bash
# API Keys
OPENAI_API_KEY=your_openai_key_here
BRAVE_SEARCH_API_KEY=your_brave_key_here

# Database
DATABASE_URL=sqlite:///cao_tracker.db

# Flask
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
```

## Volgende Stappen

### Sprint 2 Development
1. **CAO Database Setup**
   - Branch: `feature/cao-database`
   - Research Nederlandse zorg-CAO's
   - Database schema implementeren

2. **CAO Selectie Interface**
   - Branch: `feature/cao-selectie-ui`
   - Frontend component ontwikkelen
   - Integratie met bestaande tabs

3. **Backend API**
   - Branch: `feature/backend-api`
   - Flask server opzetten
   - CAO endpoints implementeren

### Code Review Process
1. Alle Pull Requests vereisen review
2. Minimaal 1 approval voor merge
3. Automated testing (toekomstig)
4. Documentation updates verplicht

## Troubleshooting

### Veelvoorkomende Problemen

**Push rejected**
```bash
git pull origin develop
git push origin feature-branch
```

**Merge conflicts**
```bash
git checkout develop
git pull origin develop
git checkout feature-branch
git merge develop
# Resolve conflicts
git commit
git push
```

**Branch cleanup**
```bash
# Lokaal
git branch -d feature-branch

# Remote
git push origin --delete feature-branch
```

## Contact & Support

Voor vragen over de repository setup of Git workflow, raadpleeg de project documentatie of maak een issue aan in GitHub.