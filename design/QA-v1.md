# Verificación del MVP

Verificación realizada el 29 de octubre de 2026 en Brave, sobre el servidor local de la carpeta del proyecto.

## Comprobaciones automatizadas

`npm test`: sintaxis JavaScript, datos de ejemplo, búsquedas sin tildes, combinación de texto/tipo/ciudad, categorías, modalidad, orden, favoritos, teléfono ecuatoriano, consentimiento de WhatsApp, validación de campos, escape HTML, persistencia local, recuperación ante almacenamiento inválido o lleno, archivos de imagen y fuentes, iconos, metadatos y accesibilidad básica.

## Recorridos en el navegador

- Buscar «matematicas» + Servicios + Cuenca devuelve la clase de Carolina.
- Guardar esa clase y registrar interés conserva ambos al recargar.
- Enviar el formulario vacío muestra errores junto a los campos y enfoca el primer error.
- Publicar un servicio con nombre de prueba lo incorpora al detalle y a Mi actividad.
- Un teléfono sin autorización no se guarda ni habilita contacto.
- Editar, cargar una foto local y autorizar WhatsApp habilita el enlace con número ecuatoriano normalizado y borrador de mensaje. No se abrió WhatsApp ni se enviaron mensajes.
- Revocar el permiso retira el número y el enlace; quitar la foto devuelve la imagen general.
- La publicación y su foto persisten al recargar.
- Completar, reactivar, archivar y restaurar una publicación actualiza sus estados.
- El filtro Animales devuelve el voluntariado de paseos.
- Registrar 3 horas de clases actualiza el total y genera una constancia de ejemplo a nombre de la persona de prueba, con aviso de horas autodeclaradas.
- Tab entra en los controles del formulario; Escape cierra el diálogo y devuelve el foco a Publicar.
- Revisión visual de escritorio y teléfono; comprobación de ancho de documento en móvil pequeño, teléfono y tablet.

## Límites deliberados

No hay cuentas ni backend. Los datos de prueba se guardan en el origen del navegador y no se sincronizan entre local y la versión alojada. La constancia no tiene acreditación. La verificación de impresión cubre la vista y los estilos de impresión; no se envió nada a una impresora.
