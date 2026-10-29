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

Repositorio público `aurelioochoa/doname`. GitHub Actions 40954025033, intento 2: comprobación y despliegue correctos. Landing, catálogo y guía devolvieron HTTP 200. En Brave sobre GitHub Pages se verificó tema oscuro persistente y la búsqueda Servicios + Cuenca + matematicas, con una coincidencia y sin errores de consola.

Evidencia en `GATES.md`. El sitio publicado conserva las limitaciones del almacenamiento local descritas en el README.

## Ampliación de oportunidades y publicación

- Se midieron 40 ejemplos únicos, con 10 por cada tipo. El navegador devuelve 10 al filtrar objetos, servicios, necesidades y voluntariados; cargar más muestra 16 tarjetas.
- Los ejemplos sin foto usan una ilustración con la familia de iconos del proyecto; no se sustituyen por fotos de objetos diferentes.
- Publicar abre una página independiente con tres pasos, vista previa y borrador.
- Paso de detalles vacío muestra errores junto a título y descripción y enfoca el primero. El paso de conexión valida ciudad y nombre antes de guardar.
- Una foto JPG local se procesó y apareció en la vista previa. Se creó el anuncio y su detalle mostró la foto, ciudad, modalidad y descripción.
- Se publicó con un teléfono de prueba sin marcar autorización: el detalle no mostró el número ni un enlace de contacto.
- Editar abre la misma pantalla con el anuncio. Se retiró la foto, se cambió el título y se autorizó un teléfono de prueba: el detalle mostró ilustración, título actualizado y enlace de WhatsApp. No se abrió WhatsApp ni se envió un mensaje.
- La publicación de prueba se archivó y el catálogo volvió a 40 ejemplos visibles.
- El borrador recuperó tipo, título y descripción al recargar. Empezar de nuevo restableció el formulario.
- Se revisaron los pasos de la publicación en móvil y tablet: ocho mediciones en viewports 320, 390, 768 y 1280, todas sin desbordamiento horizontal.
- La revisión del nuevo recorrido no mostró errores de JavaScript.
- La carga inicial mantiene desactivados los campos y el envío hasta completar la preparación del formulario. Se comprobó que después se habilita Continuar y avanza a «Paso 2 de 3», sin errores de consola.

- Publicación final ampliada: Actions 40957905697 completó con success para e9d84cc. En el sitio público el catálogo mostró 40 oportunidades y la página de publicación preparó el formulario y habilitó Continuar, sin errores. La ruta publicar.html devolvió HTTP 200 y el recurso de entrada actualizado app.js?v=4.
