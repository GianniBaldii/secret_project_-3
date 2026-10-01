# Para Juli, con amor

Abrí `dist/index.html` para usar la web. No necesita instalaciones ni internet para las fotos y la música.

- `dist/script.js`: CONFIG contiene preguntas, opciones, respuestas correctas (0 = primera opción), mensajes del botón No y rutas de música.
- `dist/index.html`: textos románticos, fotos, sus descripciones y títulos de las polaroids.
- `dist/style.css`: colores en :root y diseño adaptable a celular.
- `dist/assets/`: las tres fotos, ilustración hero.png y dos instrumentales WAV originales sintetizadas para esta web. Se pueden reemplazar por MP3, cambiando CONFIG.music.

La música empieza tras un toque, como requieren los navegadores móviles. El botón superior permite pausarla y la preferencia se respeta al cambiar de etapa. No se envían ni guardan respuestas. Recargar vuelve al inicio.

## Música de fondo

La instrumental épica existente (`CONFIG.music.epic`) comienza con el botón inicial y se desvanece al terminar la trivia. No es la grabación de Game of Thrones. **Te Voy a Amar — Axel** (`CONFIG.music.romantic`, MP3 proporcionado) empieza al tocar **SÍ**, y se repite al terminar. Entre la trivia y la aceptación hay silencio salvo que se reactive manualmente la música. El botón superior permite pausar y reanudar; una pausa voluntaria se respeta al llegar al final. El servidor admite MP3, M4A, OGG y solicitudes de audio por rangos para iPhone.

## Recorrido personalizado

Inicio → cuatro preguntas (fecha, cumpleaños, películas y chinchón) → transición íntima → fotos y recuerdos → preámbulo → propuesta con seis mensajes de NO → aceptación con Axel y confeti. La fecha correcta sigue siendo 4 de julio de 2026. El progreso se calcula desde `CONFIG.questions`, y cada pregunta puede definir sus mensajes y efectos.

## Versión para celular

Diseño desde 320 px, botones de al menos 48 px, márgenes para las zonas seguras del teléfono, fotos grandes en columna y tamaños de letra flexibles. Las fotos originales se conservan; la web carga sus versiones reducidas. `Optimize-Images.ps1` genera los derivados JPEG y respeta la orientación EXIF.

La ilustración `dist/assets/hero-v3.png` se creó con imagegen integrado usando la ilustración anterior y las fotos reales `flores.jpg` y `abrazo.jpg` como referencias. En pantalla se cargan `hero-v3-mobile.jpg` o `hero-v3-desktop.jpg` según el tamaño.

Para el QR, usá la URL pública que Railway genera; una ruta local del equipo no funciona en su teléfono.

## Railway desde GitHub

En Railway elegí New Project → Deploy from GitHub repo → GianniBaldii/secret_project_-3. Dejá la carpeta raíz predeterminada. El archivo railway.json configura `npm start` y el chequeo de salud. En Settings → Networking → Generate Domain creá el enlace público. Los cambios enviados a la rama conectada se despliegan desde GitHub.

Para vista local, ejecutá `npm start` desde la raíz del repositorio y abrí http://localhost:3000. El servidor Node no necesita paquetes externos.

Ilustración realizada con imagegen integrado. Prompt: original romantic hand-painted anime illustration of an adult couple embracing, young man inspired by Ippo Makunouchi with tousled brown hair and black clothes; fit young woman with black hair, freckles, glasses, burgundy top and chocolate clothes; smiling, pink backdrop, square composition, no text or UI.
