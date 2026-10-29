# Gates: dóname v2

Scope: Ampliar el MVP sin cuentas, separado en landing, catálogo, guía y publicación por pasos; añadir más oportunidades de ejemplo y publicar el resultado en GitHub público y GitHub Pages.

- [x] G1: La regresión de datos, enlaces entre páginas, filtros y validación pasa las comprobaciones
  CHECK: node scripts/verify.mjs
  EXPECT: DONAME_VERIFIED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/aurelio/Repos/doname; path=0feba3a4c8cf/33 entries; EXPECT=matched; output-sha256=f58025641d42b07eb530d87f0c8a52ba64ef7031da6ec919f7ab4b7de38ec6d2; output-bytes=115

- [x] G2: Landing y exploración son páginas distintas con filtros restaurables por URL, favoritos y enlaces de detalle
  EVIDENCE: Brave: landing sin catálogo; navegación a explorar.html y guia.html; Servicios + Cuenca + matematicas conservó una coincidencia y URL al recargar; favoritos, vista de lista y enlaces de detalle verificados. QA.md.

- [x] G3: El tema claro, oscuro y del sistema funciona en todas las páginas y conserva la elección
  EVIDENCE: Brave: Oscuro en landing, catálogo y diálogos; Claro en guía; elección persistente al navegar/recargar. Sistema resolvió dark y matchMedia devolvió systemDark=true.

- [x] G4: Animaciones, teclado, menú móvil y nuevos recorridos funcionan sin desbordar la pantalla
  EVIDENCE: Brave: se conserva la revisión de las tres páginas iniciales y se comprobaron ocho anchos de la publicación en sus tres pasos (320/390/768/1280), sin desbordamiento. Validación enfoca errores; navegación Anterior/Continuar, vista previa y tema oscuro comprobados. Consola sin errores.

- [x] G5: El repositorio público de aurelioochoa contiene el código y el flujo de publicación
  EVIDENCE: Repositorio PUBLIC https://github.com/aurelioochoa/doname; commit e9d84ccade6d2431f683a50d531e7cd850b58808 subido, con 40 ejemplos, publicar.html, publish.js/publish.css, comprobaciones y workflow de Pages.

- [x] G6: GitHub Pages publica la versión final y responde correctamente bajo la ruta del repositorio
  EVIDENCE: Actions 40957905697 completó con success para e9d84cc. En GitHub Pages, el catálogo mostró 40 oportunidades sin errores; publicar.html cargó el formulario de tres pasos y Continuar habilitado tras preparar los módulos. HTTPS /doname/publicar.html respondió 200 y publicó app.js?v=4.

- [x] G7: El catálogo incluye al menos 36 ejemplos variados y 8 por cada tipo, con datos válidos
  CHECK: node scripts/check-opportunities.mjs
  EXPECT: OPPORTUNITIES_VERIFIED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/aurelio/Repos/doname; path=0feba3a4c8cf/33 entries; EXPECT=matched; output-sha256=6afc0efc278e2c2d230f490f06713c6207c3febb6087a35be31dabbb0f9777de; output-bytes=89

- [x] G8: La publicación por pasos valida, recupera borradores, previsualiza fotos y permite crear y editar anuncios
  EVIDENCE: Brave: creación en 3 pasos con foto JPG y vista previa; título/descripción y ciudad/nombre inválidos enfocados; borrador recuperado tras recargar; teléfono sin permiso oculto; edición con foto retirada, título cambiado y permiso de WhatsApp concedido comprobada. Publicación de prueba archivada. QA.md.
