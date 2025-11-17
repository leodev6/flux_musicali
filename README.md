# Flux Musicali

## Riassunto

Flux Musicali è un'applicazione Node.js scritta in TypeScript progettata per acquisire, archiviare, elaborare ed esporre statistiche calcolate da eventi musicali (letture). Il progetto è stato strutturato per essere modulare, testabile e facilmente estensibile (modelli di Repository, Service, Observer e Strategy).

## Obiettivo e motivazioni

-Fornire una piattaforma semplice per raccogliere eventi musicali e calcolare metriche aziendali (durata media, artista più ascoltato, orari di punta, tendenze giornaliere).
-Responsabilità separate: acquisizione, archiviazione, elaborazione ed esposizione tramite un'API REST.
-Facilitare l'aggiunta di nuove metriche senza modificare il nucleo dell'elaborazione (uso del pattern Strategy e di una factory).
-Supporta la notifica reattiva interna (modello Observer) per consentire l'elaborazione asincrona o hook esterni.

## Architettura generale

-Ingresso HTTP -> Percorsi -> Controller -> Servizi -> Repository (archiviazione)
-Elaborazione di statistiche effettuate per strategie (IStatistiqueStrategy).
-Osservatori registrati su un oggetto di evento (EventSubject) per attivare azioni secondarie durante aggiunte/aggiornamenti.
-Implementazione comune del repository: archiviazione in memoria (facilmente sostituibile da un DB tramite l'interfaccia IRepository).

## Componenti chiave

-Sorgente/controller
  -EventController: espone l'inserimento di eventi e gli endpoint di richiesta. Separa la logica HTTP dalla logica aziendale.
  -StatisticsController: espone gli endpoint per ottenere statistiche calcolate.

-Sorgente/servizi
  -EventProcessingService: orchestra l'elaborazione degli eventi in ingresso (convalida, trasformazione, persistenza). Centralizza la logica aziendale.
  -StatisticService: compone ed esegue strategie per produrre statistiche riutilizzabili.

-origine/repository
  -IRepository: interfaccia alla persistenza astratta (permette di sostituire l'implementazione della memoria con un DB relazionale o NoSQL).
  -MusicEventRepository: implementazione della memoria per l'archiviazione e query semplici.
  -StatistiqueRepository: archiviazione/recupero delle statistiche calcolate se si desidera un uso persistente.

-Origine/strategie
  -IStatistiqueStrategy: interfaccia unica per garantire una firma comune (input/eventi -> Statistica).
  -Strategie concrete:
    -AverageDurationStrategy: calcola la durata media di ascolto.
    -MostPlayedArtistStrategy: identifica l'artista più suonato.
    -PeakHoursStrategy: identifica le ore con più letture.
    -DailyTrendStrategy: calcola il trend giornaliero (aggregazione giornaliera).
-Statistiche della Strategy Factory: fabbrica per istanziare/comandare la strategia desiderata (favorisce l'apertura/chiusura).

-src/osservatori
  -EventSubject: oggetto che avvisa gli osservatori registrati dopo le modifiche (utile per attivare ricalcoli, inviare eventi esterni, ecc.).
  -StatisticsObserver: esempio di osservatore che può avviare ricalcoli o memorizzare risultati.
-src/scripts/init-db.ts
  -Script per inizializzare l'ambiente dati (ad esempio: caricare music_events_data.json nel repository).

## Modello dati