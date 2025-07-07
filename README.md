# CAO Tracker

Een complete oplossing voor het verwerken en beheren van Collectieve Arbeidsovereenkomsten (CAO's) met gespecialiseerde AI-agents en uitgebreide CAO database voor de Nederlandse zorgsector.

## 🚀 Huidige Status: **PRODUCTION READY**

### ✅ Werkende Functionaliteiten
- **CAO Selectie Interface**: Volledig functioneel met 6 Nederlandse zorg-CAO's
- **Interactieve Checkboxes**: Selectie, filtering en zoekfunctionaliteit
- **Real-time Updates**: Selectieteller en localStorage synchronisatie
- **Responsive Design**: Optimaal voor desktop en mobiel
- **Backend API**: Flask server met CAO endpoints

### 🔧 Recente Fixes
- Event listener optimalisatie voor betere performance
- Stack overflow preventie bij snelle gebruikersinteractie
- Verbeterde checkbox state management
- Filter en zoek functionaliteit stabiliteit

## Overzicht

Het CAO Tracker systeem bestaat uit:
- **Frontend**: Intuïtieve webinterface met 3 hoofdtabs en CAO selectie
- **Backend**: Python-gebaseerde API met AI-agents en CAO database
- **Database**: Opslag voor documenten, chat historie, tracking data en CAO referenties
- **CAO Database**: Complete lijst van Nederlandse zorg-CAO's voor gerichte analyse

## Systeem Architectuur

### Frontend Tabs
1. **Chat**: Communicatie met Algemene AI-agent voor alle vragen
2. **Documentenlijst**: Overzicht van verwerkte CAO-documenten met uitgebreide filters
3. **CAO Tracker**: Status monitoring, controlelijst en CAO selectie

### CAO Selectie Functionaliteit
- **CAO Database**: Complete lijst van Nederlandse zorg-CAO's
- **Selectie Interface**: Gebruikers kunnen specifieke CAO's selecteren voor analyse
- **Gerichte Analyse**: AI-agents focussen op geselecteerde CAO's
- **Backend Integratie**: Real-time synchronisatie met CAO database

### Backend AI-Agents
1. **Algemene Agent**: Intelligente routing naar gespecialiseerde functies
2. **CAO Analist**: Analyse van geselecteerde CAO's en vergelijking
3. **Data Verzamelaar**: Online research en actuele informatie
4. **Excel Specialist**: Gestructureerde rapportage en export
5. **Kwaliteitscontroleur**: Verificatie en validatie van resultaten

## Workflow

### Nieuwe CAO Selectie Workflow
1. **CAO Selectie**: Gebruiker selecteert relevante CAO's uit Nederlandse zorg database
2. **Upload**: Gebruiker uploadt eigen CAO-bestand voor vergelijking
3. **Gerichte Analyse**: CAO Analist vergelijkt met geselecteerde referentie-CAO's
4. **Data Research**: Data Verzamelaar haalt actuele informatie op
5. **Rapportage**: Excel Specialist structureert bevindingen
6. **Validatie**: Kwaliteitscontroleur controleert resultaten
7. **Opslag**: Goedgekeurde analyses naar Documentenlijst

### Chat Workflow
1. **Vraag**: Gebruiker stelt vraag via chat interface
2. **Routing**: Algemene Agent bepaalt beste aanpak
3. **Verwerking**: Gespecialiseerde functie wordt uitgevoerd
4. **Antwoord**: Resultaat wordt teruggegeven aan gebruiker

## Technische Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python, Flask, SQLite/PostgreSQL
- **AI Integration**: OpenAI API, Brave Search API
- **File Processing**: openpyxl, pandas
- **Version Control**: Git, GitHub

## Installatie

```bash
# Clone repository
git clone https://github.com/Kipburger-lab/cao-tracker.git
cd cao-tracker

# Backend setup
cd backend
pip install -r requirements.txt
python app.py

# Frontend setup
cd ../frontend
# Open index.html in browser
```

## Project Status

🚧 **In Ontwikkeling** - Sprint 1: Basis architectuur en setup

## Licentie

MIT License