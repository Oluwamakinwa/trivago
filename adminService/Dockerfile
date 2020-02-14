FROM  node:12 
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
# Expose application port
EXPOSE 8000:8000
# Start application
CMD [ "node","-r","dotenv/config","-r","esm", "index.js" ]