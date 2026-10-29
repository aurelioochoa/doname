# Gates: dóname

Scope: Primera versión navegable para donar objetos y servicios, pedir ayuda y explorar voluntariados en Ecuador. Los ejemplos y datos guardados en este navegador se identifican como tales.

- [x] G1: Los archivos de la aplicación son válidos y los filtros devuelven los anuncios correspondientes
  CHECK: node scripts/verify.mjs
  EXPECT: DONAME_VERIFIED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/aurelio/Repos/doname; path=0cab3360a3c8/31 entries; EXPECT=matched; output-sha256=f58025641d42b07eb530d87f0c8a52ba64ef7031da6ec919f7ab4b7de38ec6d2; output-bytes=115

- [x] G2: Publicar, guardar favoritos y gestionar solicitudes conserva los datos al recargar
  EVIDENCE: Brave localhost:4173; publicación de servicio, foto, edición y favoritos persistieron al recargar; consentimiento de WhatsApp otorgado y revocado; completar, archivar y restaurar comprobados. Recorridos documentados en QA.md.

- [x] G3: La interfaz se puede recorrer con teclado y se adapta a móvil y escritorio
  EVIDENCE: Revisiones visuales de escritorio y teléfono; anchos 320 y 768 sin desbordamiento (scrollWidth igual a clientWidth: 305 y 753 con scrollbar); Tab enfoca opciones del formulario, Escape cierra el diálogo y devuelve el foco a Publicar.

- [ ] G4: La versión publicada responde con una URL confirmada por Sites
  EVIDENCE: pending
