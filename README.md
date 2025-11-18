
---

#  **Flux Musicali**

Applicazione Node.js in TypeScript progettata per **acquisire eventi musicali**, **archiviarli**, **calcolare statistiche avanzate**, ed **esporle tramite API REST**.
L’architettura è modulare, estensibile e completamente testata tramite Jest.

---

# **Indice**

* [Riassunto](#riassunto)
* [Obiettivo e Motivazioni](#obiettivo-e-motivazioni)
* [Architettura Generale](#architettura-generale)
* [Componenti Chiave](#componenti-chiave)
* [Modello Dati](#modello-dati)
* [Installazione ed Esecuzione](#installazione-ed-esecuzione-passo-passo)
* [Utilizzo con Postman](#utilizzo-con-postman)
* [API Endpoints](#api-endpoints)
* [Test](#test)

---

#  **Riassunto**

Flux Musicali è un’applicazione costruita in **Node.js + TypeScript** che permette di:

* ricevere eventi musicali (letture)
* salvarli in un repository (in-memory o database)
* elaborarli tramite strategie modulari
* esporre statistiche tramite un’API REST

Il progetto utilizza pattern software professionali:

* **Strategy** per calcolo di metriche
* **Observer** per notifiche e ricalcoli
* **Repository** per astrazione dello storage
* **Service Layer** per orchestrare la logica aziendale

---

#  **Obiettivo e Motivazioni**

* Fornire un sistema semplice ma estensibile per **analizzare il comportamento degli utenti**.
* Calcolare metriche come:

  * durata media d’ascolto
  * artista più ascoltato
  * orari di punta
  * tendenze giornaliere
* Separare chiaramente:

  * acquisizione degli eventi
  * persistenza
  * calcolo delle statistiche
  * esposizione API
* Supportare l’aggiunta di nuove metriche senza modificare il core grazie al **pattern Strategy**.
* Supportare logiche reattive tramite **Observer Pattern**.

---

Compris !
Tu veux que **l’architecture générale** affiche aussi **Models, Observers, Strategies, Factory**, pour montrer clairement **tous les niveaux** de ton projet.

Voici une version **claire, complète, professionnelle** — prête à copier-coller dans ton README.

---

# 🔥 **Architettura Generale (Versione Completa)**

L’architettura di *Flux Musicali* segue una struttura modulare a livelli, che separa chiaramente responsabilità e facilita manutenzione, estensione e test.

```
HTTP Request
    ↓
Routes (src/routes)
    ↓
Controllers (src/controllers)
    ↓
Services (src/services)
    ↓
Repository (src/repositories)
    ↓
Models (src/models)
```

---

#  **Descrizione dei Livelli**

## 1️ **Routes (src/routes)**

Definiscono le URL disponibili e instradano le richieste verso i controller.

Esempi:

* `POST /api/events`
* `GET /api/statistics/durata_media`

---

## 2️ **Controllers (src/controllers)**

Ricevono la richiesta HTTP, validano input e delegano ai servizi.

Esempi:

* **EventController**
* **StatisticsController**

---

## 3️ **Services (src/services)**

Cuore della logica applicativa:

* processano eventi
* coordinano repository
* lanciano strategie statistiche

Esempi:

* **EventProcessingService**
* **StatisticService**

---

## 4️ **Repository (src/repositories)**

Strato di accesso ai dati:

* Memoria
* Database
* File
* Cache

Interfacce:

* `IRepository`
  Implementazioni:
* `MusicEventRepository`
* `StatistiqueRepository`

---

## 5️ **Models (src/models)**

Strutture dati principali:

### **MusicEvent**

Rappresenta ogni evento musicale registrato.

### **Statistic**

Rappresenta una statistica calcolata (media, artiste più ascoltato, ecc.)

---

#  **Observer Pattern (Reattività interna)**

## **EventSubject**

* mantiene una lista di osservatori
* notifica quando arriva un nuovo evento

## **StatisticsObserver**

* ricalcola statistiche automaticamente
* può persistente i risultati

```
Evento ricevuto → Subject → Observer → Aggiorna statistiche
```

---

#  **Strategy Pattern (Calcolo Statistiche)**

## **IStatistiqueStrategy**

Interfaccia comune:

```ts
compute(events: MusicEvent[]): Statistic
```

## Strategie implementate:

* **AverageDurationStrategy** → durata media
* **MostPlayedArtistStrategy** → artista più ascoltato
* **DailyTrendStrategy** → trend giornaliero
* **PeakHoursStrategy** → orari di punta

---

#  **Strategy Factory**

**StatisticsStrategyFactory**

* Seleziona e istanzia la strategia corretta
* Mantiene il codice aperto all’estensione e chiuso alla modifica (**principio OCP**)

Esempio:

```ts
factory.create("average_duration");
```

---

#  **Output Finale**

Ogni strategia produce un oggetto **Statistic**:

```ts
{
  type: "average_duration",
  value: 183,
  metadata: { count: 72 },
  computedAt: "2025-11-16T10:00:00Z"
}
```

---



Elaborazione statistiche:

* Ogni statistica = 1 strategia che implementa **IStatistiqueStrategy**
* Una **factory** crea la strategia corretta
* Gli osservatori reagiscono automaticamente all’arrivo di nuovi eventi

---

#  **Componenti Chiave**

##  Controllers (`src/controllers`)

### **EventController**

* gestisce la creazione e consultazione degli eventi
* separa logica HTTP dalla logica aziendale

### **StatisticsController**

* espone gli endpoint che restituiscono statistiche
* delega tutto alle strategie tramite `StatisticService`

---

##  Services (`src/services`)

### **EventProcessingService**

* valida gli eventi in ingresso
* li normalizza
* li salva tramite il repository
* notifica i subscribers (observer)

### **StatisticService**

* esegue le strategie statistiche
* centralizza la logica di aggregazione

---

##  Repository (`src/repositories`)

### **IRepository**

Interfaccia generica di persistenza (DB, cache, memoria).

### **MusicEventRepository**

* implementazione in-memory
* query semplici
* facilmente sostituibile con PostgreSQL, MongoDB, ecc.

### **StatistiqueRepository**

* salva statistiche già calcolate (opzionale)

---

##  Strategie (`src/strategies`)

Tutte implementano:

```ts
interface IStatistiqueStrategy {
  compute(events: MusicEvent[]): Statistic;
}
```

### Strategie disponibili:

* **AverageDurationStrategy**
* **MostPlayedArtistStrategy**
* **PeakHoursStrategy**
* **DailyTrendStrategy**

### **StatisticsStrategyFactory**

* crea la strategia richiesta
* rispetta il principio Open/Closed

---

##  Observer (`src/observers`)

### **EventSubject**

* gestisce gli osservatori registrati
* li notifica dopo inserimento/aggiornamento eventi

### **StatisticsObserver**

* ricalcola statistiche o avvia processi secondari

---

##  Script (`src/scripts/init-db.ts`)

Script per caricare dati iniziali (da `music_events_data.json`).

---

#  **Modello Dati**

##  MusicEvent (`src/models/MusicEvent.ts`)

| Campo     | Tipo            | Descrizione         |
| --------- | --------------- | ------------------- |
| id        | string | number | Identificativo      |
| userId    | string          | Utente che ascolta  |
| artist    | string          | Artista             |
| genre     | string?         | Genere (opzionale)  |
| country   | string?         | Paese               |
| device    | string?         | Mobile/Desktop      |
| duration  | number          | Durata dell’ascolto |
| timestamp | string | number | Data                |
| metadata  | object          | Extra               |

---

##  Statistic (`src/models/Statistic.ts`)

| Campo      | Tipo                |
| ---------- | ------------------- |
| type       | string              |
| value      | number | object     |
| metadata   | Record<string, any> |
| computedAt | timestamp           |

---

#  **Installazione ed Esecuzione (passo-passo)**

Clona il repository:

```bash
git clone <url>
cd flux_musicali
```

---

## 1️ Installa le dipendenze

```bash
npm install
```

---

## 2️ Crea il file `.env`

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
PORT=
NODE_ENV=development
```

---

## 3️ Compila TypeScript

```bash
npm run build
```

---

## 4️ Avvia PostgreSQL con Docker

```bash
docker-compose up -d postgres
```

Controlla:

```bash
docker ps
```

---

## 5️ Inizializza il database

```bash
npm run init-db
```

---

## 6️ Avvia l’API in modalità sviluppo

```bash
npm run dev
```

---

#  **Utilizzo con Postman**

## Importa la collection

1. Apri Postman
2. **Import**
3. Seleziona `data.json`
4. Appare la collection **Music Flow Analyzer API**

---

## Crea un evento

* Apri: **Events → Create Event**
* Clicca **Send**

**Risposta esempio:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": "u123",
    "trackId": "t567",
    "artist": "Radiohead",
    "duration": 180,
    "timestamp": "2025-11-10T21:30:00.000Z",
    "genre": "Rock",
    "country": "IT",
    "device": "mobile"
  }
}
```

---

## Creare eventi in batch

Apri:

> **Events → Create Batch Events**

Clicca **Send**

---

#  **API Endpoints**

##  Eventi

| Metodo | Endpoint                     | Descrizione        |
| ------ | ---------------------------- | ------------------ |
| GET    | `/api/events`                | Tutti gli eventi   |
| GET    | `/api/events/:id`            | Evento per ID      |
| GET    | `/api/events/artist/:artist` | Eventi per artista |
| POST   | `/api/events`                | Crea evento        |
| POST   | `/api/events/batch`          | Crea più eventi    |

---

##  Statistiche

| Metodo | Endpoint                               | Descrizione          |
| ------ | -------------------------------------- | -------------------- |
| GET    | `/api/statistics/artista_piu_suonato`  | Artista più suonato  |
| GET    | `/api/statistics/durata_media`         | Durata media         |
| GET    | `/api/statistics/tendenza_giornaliera` | Trend giornaliero    |
| GET    | `/api/statistics/ore_di_punta`         | Ore di punta         |
| GET    | `/api/statistics/all`                  | Tutte le statistiche |

Tutti gli endpoint accettano:

```
?date=YYYY-MM-DD
?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

---

#  **Test**

* Framework: **Jest**
* Coprono controller, servizi, repository, strategie e observer

Comandi:

```bash
npm test
npm run test:coverage
```

## Test per singoli componenti

### Strategie

```bash
npm test -- AverageDurationStrategy.test.ts
npm test -- DailyTrendStrategy.test.ts
npm test -- MostPlayedArtistStrategy.test.ts
npm test -- PeakHoursStrategy.test.ts
npm test -- StatisticsStrategyFactory.test.ts
```

### Controller

```bash
npm test -- EventController.test.ts
npm test -- StatisticsController.test.ts
```

---
