FROM node:18-alpine

WORKDIR /app

# Copia i file del pacchetto
COPY package*.json ./

# Installa tutte le dipendenze (incluse le dipendenze di sviluppo per la build)
RUN npm ci

# Copia il codice sorgente
COPY . .

# Costruisci TypeScript
RUN npm run build

# Rimuovi le dipendenze dello sviluppatore per ridurre le dimensioni dell'immagine
RUN npm prune --production

# Esporre il porto
EXPOSE 3000

# Avvia l'applicazione
CMD ["npm", "start"]

