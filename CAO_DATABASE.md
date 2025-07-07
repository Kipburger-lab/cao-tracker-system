# CAO Database - Nederlandse Zorgsector

## Overzicht

Deze database bevat alle relevante Collectieve Arbeidsovereenkomsten (CAO's) voor de Nederlandse zorgsector. De database wordt gebruikt voor gerichte analyse en vergelijking van CAO-bepalingen.

## Database Structuur

### CAO Tabel Schema

```sql
CREATE TABLE caos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naam VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    organisatie VARCHAR(255) NOT NULL,
    vakbond VARCHAR(255),
    geldig_van DATE,
    geldig_tot DATE,
    status VARCHAR(50) DEFAULT 'actief',
    beschrijving TEXT,
    url VARCHAR(500),
    bestand_pad VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### CAO Categorieën

#### 1. Ziekenhuizen
- CAO Ziekenhuizen (NVZ)
- CAO Academische Ziekenhuizen (NFU)
- CAO UMC's

#### 2. Verpleging & Verzorging
- CAO Verpleeg- en Verzorgingshuizen (Actiz)
- CAO Thuiszorg (Actiz)
- CAO Gehandicaptenzorg (VGN)

#### 3. GGZ & Verslavingszorg
- CAO GGZ (GGZ Nederland)
- CAO Verslavingszorg

#### 4. Huisartsen & Eerstelijn
- CAO Huisartsenzorg (LHV)
- CAO Apotheken (KNMP)

#### 5. Overige Zorg
- CAO Jeugdzorg
- CAO Ambulancezorg
- CAO Kraamzorg

## Data Bronnen

### Primaire Bronnen
1. **FNV** - https://www.fnv.nl/cao-overzicht/
2. **CNV** - https://www.cnv.nl/cao/
3. **FWG** - https://www.fwg.nl/
4. **Werkgeversorganisaties**:
   - NVZ (Nederlandse Vereniging van Ziekenhuizen)
   - Actiz (Branchevereniging van zorgondernemers)
   - VGN (Vereniging Gehandicaptenzorg Nederland)
   - GGZ Nederland

### Secundaire Bronnen
1. CAO Register (overheid.nl)
2. Ministerie van SZW
3. Brancheverenigingen websites

## API Endpoints

### GET /api/caos
Haalt alle CAO's op met optionele filters

**Parameters:**
- `sector`: Filter op sector (ziekenhuis, verpleging, ggz, etc.)
- `status`: Filter op status (actief, verlopen, concept)
- `search`: Zoek in naam en beschrijving
- `geldig_op`: Filter op geldigheid op specifieke datum

**Response:**
```json
{
  "caos": [
    {
      "id": 1,
      "naam": "CAO Ziekenhuizen 2024",
      "sector": "ziekenhuis",
      "organisatie": "NVZ",
      "vakbond": "FNV, CNV, FWG",
      "geldig_van": "2024-01-01",
      "geldig_tot": "2024-12-31",
      "status": "actief",
      "beschrijving": "CAO voor alle ziekenhuizen aangesloten bij NVZ"
    }
  ],
  "total": 25
}
```

### POST /api/caos/select
Slaat geselecteerde CAO's op voor analyse

**Request Body:**
```json
{
  "selected_caos": [1, 3, 7, 12],
  "session_id": "user_session_123"
}
```

### GET /api/caos/selected
Haalt geselecteerde CAO's op voor huidige sessie

## Frontend Integratie

### CAO Selectie Component

```javascript
// CAOSelector.js
class CAOSelector {
    constructor() {
        this.selectedCAOs = JSON.parse(localStorage.getItem('selectedCAOs') || '[]');
        this.caos = [];
        this.filters = {
            sector: '',
            status: 'actief',
            search: ''
        };
    }
    
    async loadCAOs() {
        // Laad CAO's van backend API
    }
    
    toggleCAOSelection(caoId) {
        // Toggle selectie van CAO
    }
    
    saveSelection() {
        // Sla selectie op in localStorage en backend
    }
}
```

### UI Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ CAO Selectie voor Analyse                                   │
├─────────────────────────────────────────────────────────────┤
│ Filters: [Sector ▼] [Status ▼] [Zoeken...        ] [Filter]│
├─────────────────────────────────────────────────────────────┤
│ ☑ CAO Ziekenhuizen 2024 (NVZ)                             │
│ ☐ CAO Verpleeghuizen 2024 (Actiz)                         │
│ ☑ CAO GGZ 2024 (GGZ Nederland)                            │
│ ☐ CAO Thuiszorg 2024 (Actiz)                              │
│ ☑ CAO Gehandicaptenzorg 2024 (VGN)                        │
├─────────────────────────────────────────────────────────────┤
│ Geselecteerd: 3 CAO's                    [Opslaan Selectie]│
└─────────────────────────────────────────────────────────────┘
```

## Implementatie Planning

### Fase 1: Data Verzameling (Week 2)
1. Research en identificatie van alle relevante CAO's
2. Handmatige verzameling van CAO informatie
3. Structurering van data in Excel/CSV formaat

### Fase 2: Database Setup (Week 2)
1. Database schema implementeren
2. Seeding scripts voor initiële data
3. API endpoints ontwikkelen

### Fase 3: Frontend Integratie (Week 2-3)
1. CAO selectie component ontwikkelen
2. Filter en zoek functionaliteit
3. Integratie met bestaande CAO Tracker tab

### Fase 4: Testing & Validatie (Week 3)
1. Data validatie en correctie
2. UI/UX testing
3. Backend API testing

## Onderhoud

### Automatische Updates
- Maandelijkse check op nieuwe CAO's
- Validatie van vervaldatums
- Update van URL's en bestanden

### Handmatige Updates
- Nieuwe CAO's toevoegen bij publicatie
- Status updates bij wijzigingen
- Correcties op basis van gebruikersfeedback