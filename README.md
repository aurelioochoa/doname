# dóname

MVP de una plataforma comunitaria de Ecuador para donar objetos, compartir servicios y conocimientos, pedir ayuda y conectar voluntariados. Maqueta funcional sin registro, login ni cuentas.

## Ejecutar

Requiere Node.js 22 o superior.

```bash
npm run dev
```

Abrir http://localhost:4173. El servidor sirve los archivos de `dist/` sin compilación. Los assets, fuentes e iconos ya están incluidos; no necesita instalar dependencias para ejecutar. `npm install` permite recuperar los paquetes originales de fuentes e iconos.

```bash
npm test
```

## Funcionalidades

- Explorar anuncios de objetos, servicios, necesidades y voluntariados.
- Búsqueda sin distinción de mayúsculas ni tildes, filtros por ciudad, categoría y modalidad, orden y carga de más resultados.
- Detalle de cada anuncio, favoritos e intereses de demostración.
- Publicación con foto, validación, edición, estado completado, archivo y restauración.
- Contacto por WhatsApp exclusivamente cuando quien publica lo autoriza. Sin permiso, el teléfono no se conserva. No se envían mensajes automáticamente.
- Actividad local persistente entre recargas.
- Registro de horas de servicio y constancia de ejemplo imprimible o guardable como PDF desde el navegador.
- Diseño adaptable a móvil, navegación por teclado, diálogos nativos, avisos accesibles y respeto por movimiento reducido.

## Alcance de esta maqueta

Los anuncios iniciales son ejemplos. Los cambios se guardan en `localStorage` en el navegador que los crea; no son visibles desde otro dispositivo, puerto, dominio o navegador. No hay backend, cuentas, chat, moderación ni verificación de personas u organizaciones. Las constancias son ejemplos con horas autodeclaradas.

## Estructura

- `dist/index.html`: página y contenido principal.
- `dist/styles.css`: diseño responsive, animaciones e impresión.
- `dist/app.js`: interfaz, formularios y recorridos.
- `dist/core.js`: datos de ejemplo, filtros, validación y persistencia.
- `dist/assets/`: imágenes WebP, fotografías, fuentes e iconos servidos localmente.
- `scripts/serve.mjs`: servidor local sin dependencias.
- `scripts/verify.mjs`: comprobaciones de filtros, publicación, consentimiento, persistencia y assets.
- `design/ASSETS.md`: prompts exactos y procedencia de recursos.
- `design/originals/`: imágenes originales generadas con imagegen.
- `GATES.md`: criterios y evidencia de aceptación.

## Dirección visual

Comunidad accesible y cercana: fondo claro, verde profundo, fotografía editorial cálida y tipografías Plus Jakarta Sans y DM Sans. Variación 4/10, movimiento 3/10, densidad 4/10. CSS nativo para esta maqueta estática; Phosphor como familia de iconos. Botones y campos de 8-10 px, tarjetas de 14-20 px y corazones circulares. Animaciones breves para entrada, estado y respuesta a interacción.
