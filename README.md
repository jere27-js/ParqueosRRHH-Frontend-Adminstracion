# FrontParqueosRRHH
Este es el repositorio para la parte del FrontEnd para la aplicación de Gestión de Parqueos para RRHH

Paso 1: Construir tu aplicación de Angular
Navega al directorio raíz de tu proyecto Angular:
cd tu-aplicacion-angular

Construye la aplicación:
ng build --prod
Esto generará una carpeta dist/ con los archivos de tu aplicación.
Paso 2: Crear un archivo Dockerfile
Crea un archivo llamado Dockerfile en el directorio raíz de tu proyecto:
# Etapa 1: Construcción
FROM node:14-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/tu-aplicacion-angular /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

Paso 3: Crear un archivo de configuración de Nginx
Crea un archivo llamado nginx.conf en el directorio raíz de tu proyecto:
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    server {
        listen 80;
        server_name localhost;
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
        gzip on;
        gzip_types text/plain application/javascript text/css;
        gzip_min_length 256;
    }
}

Paso 4: Crear un archivo .dockerignore
Crea un archivo .dockerignore para excluir archivos innecesarios:
node_modules
dist
.git

Paso 5: Construir y ejecutar el contenedor Docker
Construye la imagen Docker:
docker build -t tu-aplicacion-angular .

Ejecuta el contenedor Docker:
docker run -d -p 80:80 tu-aplicacion-angular

Paso 6: Acceder a tu aplicación
Abre tu navegador y navega a http://localhost para ver tu aplicación en funcionamiento.