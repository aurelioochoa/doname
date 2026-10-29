# Verificación de dóname v2

Revisión del 29 de octubre de 2026. Se conservan los recorridos de la primera versión en `design/QA-v1.md`.

## Automatizado

`npm test`: sintaxis de los módulos, filtros de texto/tipo/ciudad/categoría/modalidad, orden, guardados, validación, consentimiento de WhatsApp, escape HTML, almacenamiento, archivos estáticos e iconos. La v2 incorpora comprobación de rutas relativas para GitHub Pages, páginas independientes, un título principal por página y serialización/restauración de filtros en URL.

## Navegador Brave

- La landing no contiene el catálogo. El enlace Explorar abre `explorar.html`; la guía abre `guia.html`.
- Seleccionar Oscuro afecta portada, catálogo, formularios y detalles. Se mantiene al navegar y recargar.
- Seleccionar Claro cambia la guía y sus preguntas frecuentes. Se comprobó también el modo Sistema: la apariencia resuelta coincidió con la preferencia real del sistema.
- Servicios + Cuenca + «matematicas» devuelve una coincidencia y genera `?tipo=service&ciudad=Cuenca&q=matematicas`. La misma búsqueda vuelve tras recargar.
- Cambiar a lista conserva los resultados y la elección entre páginas. El filtro Mis guardados devuelve el favorito que ya estaba guardado.
- Copiar búsqueda coloca el enlace actual en el portapapeles. Copiar anuncio genera `explorar.html?anuncio=maths`; recargar abre su detalle. Escape cierra y elimina el parámetro de detalle.
- El borrador de publicación se recupera tras cerrar y recargar. Publicar desde la landing incorpora el anuncio al catálogo y a Mi actividad en la otra página, y limpia el borrador.
- Se archivó la publicación de prueba para retirarla del catálogo visible.
- El resumen de actividad usa las publicaciones, guardados y horas locales. No muestra cifras inventadas de comunidad.
- El menú móvil permite abrir Mi actividad y vuelve a mostrar su etiqueta Abrir menú al cerrarse.
- Las preguntas frecuentes se expanden y muestran su respuesta.
- Sin errores de JavaScript en la consola durante los recorridos.
- Revisión de ancho en las tres páginas para viewports de 320, 768 y 1280 px: `scrollWidth === clientWidth` en los nueve casos. Los anchos útiles medidos fueron 305, 753 y 1265 px, descontando la barra de desplazamiento.

## Animación y acceso

Entradas del hero, revelado de secciones al entrar en pantalla, transición de preguntas, menús y respuesta de favoritos. Los efectos usan transformación y opacidad. La preferencia de movimiento reducido desactiva transiciones y revelados mediante CSS y una consulta de medios en el módulo; no se modificó la configuración del sistema para simularla.

Las ventanas mantienen visible el encabezado al desplazarse y enfocan su botón de cierre. Los controles incluyen etiquetas, foco visible y anuncios de estado.

## Publicación

Repositorio público y despliegue final de Pages: evidencia en `GATES.md`. El sitio publicado conserva las limitaciones del almacenamiento local descritas en el README.
