# Dockerfile - Front (Next.js)
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

RUN npm install

# Copier le reste des fichiers après l'installation des dépendances
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]