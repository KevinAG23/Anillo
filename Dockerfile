FROM nginx:alpine

# Copy custom nginx configuration for optimal caching, gzip, and UTF-8 support
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    charset utf-8; \
    gzip on; \
    gzip_types text/plain text/css application/javascript application/json image/svg+xml; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(jpg|jpeg|png|webp|avif|ico|svg|css|js)$ { \
        expires 7d; \
        add_header Cache-Control "public, no-transform"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy web application assets
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY Imagenes/ /usr/share/nginx/html/Imagenes/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
