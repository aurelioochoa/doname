# Gates: dóname v2

Scope: Ampliar el MVP sin cuentas con landing y exploración separadas, modo claro/oscuro/sistema, animaciones accesibles y funciones de navegación; publicar el código en GitHub público y el sitio en GitHub Pages.

- [x] G1: La regresión de datos, enlaces entre páginas, filtros y validación pasa las comprobaciones
  CHECK: node scripts/verify.mjs
  EXPECT: DONAME_VERIFIED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/aurelio/Repos/doname; path=0cab3360a3c8/31 entries; EXPECT=matched; output-sha256=f58025641d42b07eb530d87f0c8a52ba64ef7031da6ec919f7ab4b7de38ec6d2; output-bytes=115

- [x] G2: Landing y exploración son páginas distintas con filtros restaurables por URL, favoritos y enlaces de detalle
  EVIDENCE: Brave: landing sin catálogo; navegación a explorar.html y guia.html; Servicios + Cuenca + matematicas conservó una coincidencia y URL al recargar; favoritos, vista de lista y enlaces de detalle verificados. QA.md.

- [x] G3: El tema claro, oscuro y del sistema funciona en todas las páginas y conserva la elección
  EVIDENCE: Brave: Oscuro en landing, catálogo y diálogos; Claro en guía; elección persistente al navegar/recargar. Sistema resolvió dark y matchMedia devolvió systemDark=true.

- [x] G4: Animaciones, teclado, menú móvil y nuevos recorridos funcionan sin desbordar la pantalla
  EVIDENCE: Brave: nueve comprobaciones de ancho en tres páginas a 320/768/1280, todas sin desbordamiento; menú móvil/actividad, FAQ, borrador, publicación desde landing y Escape comprobados. Consola sin errores. Capturas en design/v2-*.jpg.

- [x] G5: El repositorio público de aurelioochoa contiene el código y el flujo de publicación
  EVIDENCE: GitHub API confirmó aurelioochoa/doname con visibility=public, main y homepage configurada. Commit 19534db9b0b0a1ab75173317566cf941e3a3502f subido con el workflow .github/workflows/pages.yml; git origin apunta al repositorio público.

- [x] G6: GitHub Pages publica la versión final y responde correctamente bajo la ruta del repositorio
  EVIDENCE: GitHub Actions run 40954025033, intento 2: verify=success y deploy=success. Pages confirmó https://aurelioochoa.github.io/doname/. Landing, explorar.html y guia.html devolvieron HTTP 200. Brave público: tema oscuro y búsqueda Servicios/Cuenca/matematicas => una coincidencia bajo /doname/, sin errores de consola.
