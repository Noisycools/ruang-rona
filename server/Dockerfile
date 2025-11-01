# Gunakan base image Node.js
FROM node:18-alpine

# Buat direktori kerja di dalam kontainer
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Jalankan migrasi saat build (opsional, tapi bagus)
RUN npx prisma generate

# Perintah untuk menjalankan aplikasi
CMD ["npm", "run", "dev"]