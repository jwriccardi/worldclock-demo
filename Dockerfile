FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html styles.css store.js clock.js app.js /usr/share/nginx/html/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
