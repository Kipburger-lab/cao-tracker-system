# CAO Tracker - Project Structuur

```
cao-tracker/
├── README.md
├── PROJECT_PLAN.md
├── requirements.txt
├── .gitignore
├── .env.example
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── styles.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── chat.js
│   │   ├── documents.js
│   │   └── tracker.js
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   └── components/
│       ├── chat-interface.html
│       ├── document-list.html
│       └── cao-tracker.html
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py
│   │   ├── analist_agent.py
│   │   ├── notulist_agent.py
│   │   ├── excel_expert_agent.py
│   │   └── controleur_agent.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   ├── chat_routes.py
│   │   ├── document_routes.py
│   │   └── tracker_routes.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── document.py
│   │   ├── chat.py
│   │   └── tracker.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── file_service.py
│   │   ├── excel_service.py
│   │   ├── search_service.py
│   │   └── ai_service.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── helpers.py
│   │   ├── validators.py
│   │   └── exceptions.py
│   └── tests/
│       ├── __init__.py
│       ├── test_agents.py
│       ├── test_api.py
│       └── test_services.py
│
├── database/
│   ├── migrations/
│   ├── schema.sql
│   └── seed_data.sql
│
├── uploads/
│   ├── cao_files/
│   └── temp/
│
├── outputs/
│   ├── excel_files/
│   ├── reports/
│   └── logs/
│
├── docs/
│   ├── api_documentation.md
│   ├── user_guide.md
│   ├── deployment_guide.md
│   └── architecture.md
│
└── scripts/
    ├── setup.py
    ├── deploy.py
    └── backup.py
```

## Beschrijving van Mappen

### Frontend
- **index.html**: Hoofdpagina met tab-navigatie
- **css/**: Styling bestanden voor responsive design
- **js/**: JavaScript modules voor functionaliteit
- **assets/**: Statische bestanden (afbeeldingen, iconen)
- **components/**: Herbruikbare HTML componenten

### Backend
- **app.py**: Hoofdapplicatie en Flask configuratie
- **agents/**: AI-agent implementaties
- **api/**: REST API endpoints
- **models/**: Database modellen en ORM
- **services/**: Business logic en externe integraties
- **utils/**: Hulpfuncties en utilities
- **tests/**: Unit en integration tests

### Database
- **migrations/**: Database schema wijzigingen
- **schema.sql**: Initiële database structuur
- **seed_data.sql**: Test data voor ontwikkeling

### Uploads
- **cao_files/**: Geüploade CAO documenten
- **temp/**: Tijdelijke bestanden tijdens verwerking

### Outputs
- **excel_files/**: Gegenereerde Excel bestanden
- **reports/**: Agent rapporten en analyses
- **logs/**: Applicatie logs

### Docs
- **api_documentation.md**: API endpoint documentatie
- **user_guide.md**: Gebruikershandleiding
- **deployment_guide.md**: Deployment instructies
- **architecture.md**: Technische architectuur

### Scripts
- **setup.py**: Automatische project setup
- **deploy.py**: Deployment automatisering
- **backup.py**: Database backup scripts

## Volgende Stappen

1. Mappen aanmaken volgens structuur
2. Basis bestanden creëren
3. Requirements.txt opstellen
4. Git repository initialiseren
5. Frontend skeleton implementeren
6. Backend API basis opzetten