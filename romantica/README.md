# Para Juli, con amor

Abrí `dist/index.html` para usar la web. No necesita instalaciones ni internet para las fotos y la música.

- `dist/script.js`: CONFIG contiene preguntas, opciones, respuestas correctas (0 = primera opción), mensajes del botón No y rutas de música.
- `dist/index.html`: textos románticos, fotos, sus descripciones y títulos de las polaroids.
- `dist/style.css`: colores en :root y diseño adaptable a celular.
- `dist/assets/`: las tres fotos, ilustración hero.png y dos instrumentales WAV originales sintetizadas para esta web. Se pueden reemplazar por MP3, cambiando CONFIG.music.

La música empieza tras un toque, como requieren los navegadores móviles. El botón superior permite pausarla y la preferencia se respeta al cambiar de etapa. No se envían ni guardan respuestas. Recargar vuelve al inicio.

Para el QR, usá la URL pública que Railway genera; una ruta local del equipo no funciona en su teléfono.

## Railway desde GitHub

En Railway elegí New Project → Deploy from GitHub repo → GianniBaldii/secret_project_-3. Dejá la carpeta raíz predeterminada. El archivo railway.json configura `npm start` y el chequeo de salud. En Settings → Networking → Generate Domain creá el enlace público. Los cambios enviados a la rama conectada se despliegan desde GitHub.

Para vista local, ejecutá `npm start` desde la raíz del repositorio y abrí http://localhost:3000. El servidor Node no necesita paquetes externos.

Ilustración realizada con imagegen integrado. Prompt: original romantic hand-painted anime illustration of an adult couple embracing, young man inspired by Ippo Makunouchi with tousled brown hair and black clothes; fit young woman with black hair, freckles, glasses, burgundy top and chocolate clothes; smiling, pink backdrop, square composition, no text or UI.
