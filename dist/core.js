export const cities = [
  "Quito",
  "Guayaquil",
  "Cuenca",
  "Ambato",
  "Loja",
  "Manta",
  "Riobamba",
  "Ibarra",
  "Santo Domingo",
  "Portoviejo",
  "Machala",
];
export const types = {
  object: {
    label: "Objeto",
    plural: "Objetos",
    icon: "package",
    action: "Me interesa",
    offer: "Donar un objeto",
  },
  service: {
    label: "Servicio",
    plural: "Servicios",
    icon: "chalkboard-teacher",
    action: "Quiero aprender",
    offer: "Compartir un servicio",
  },
  need: {
    label: "Necesidad",
    plural: "Necesidades",
    icon: "hand-heart",
    action: "Quiero ayudar",
    offer: "Pedir ayuda",
  },
  volunteer: {
    label: "Voluntariado",
    plural: "Voluntariados",
    icon: "users-three",
    action: "Quiero participar",
    offer: "Crear un voluntariado",
  },
};
export const seed = [
  {
    id: "wheelchair",
    type: "object",
    title: "Una silla de ruedas para seguir adelante",
    description:
      "Silla de ruedas manual en buen estado. Es plegable, tiene frenos y reposapiés. Quisiera que llegue a alguien que la necesite. Podemos coordinar la entrega en el norte de Quito.",
    category: "Salud y bienestar",
    city: "Quito",
    person: "María Elena",
    initials: "ME",
    image: "assets/wheelchair.webp",
    imageAlt: "Silla de ruedas manual en un patio luminoso",
    condition: "Buen estado",
    mode: "Presencial",
    date: 12,
    demo: true,
  },
  {
    id: "maths",
    type: "service",
    title: "Las matemáticas también pueden ser fáciles",
    description:
      "Soy profesora y quiero compartir tres clases gratuitas de matemáticas para estudiantes de colegio. Repasaremos álgebra, ecuaciones o el tema que más te cueste. Cada clase dura una hora y puede ser por videollamada.",
    category: "Educación",
    city: "Cuenca",
    person: "Carolina R.",
    initials: "CR",
    image: "assets/learning.jpg",
    imageAlt: "Cuaderno abierto con ejercicios y una persona estudiando",
    condition: "3 clases gratuitas",
    mode: "En línea",
    date: 11,
    demo: true,
  },
  {
    id: "books",
    type: "need",
    title: "Buscamos libros para una pequeña biblioteca",
    description:
      "Estamos preparando un rincón de lectura para niñas y niños de nuestro barrio. Buscamos cuentos, libros ilustrados y textos de lectura en buen estado para edades de 6 a 12 años.",
    category: "Educación",
    city: "Guayaquil",
    person: "David M.",
    initials: "DM",
    image: "assets/books.jpg",
    imageAlt: "Libros de diferentes colores en una biblioteca",
    condition: "Para niñas y niños",
    mode: "Presencial",
    date: 10,
    demo: true,
  },
  {
    id: "dogs",
    type: "volunteer",
    title: "Un paseo, muchas colitas felices",
    description:
      "Buscamos personas que quieran acompañar y pasear perros rescatados los sábados. No necesitas experiencia, solo ganas de ayudar. La jornada de ejemplo dura dos horas y contamos con acompañamiento durante la actividad.",
    category: "Animales",
    city: "Quito",
    person: "Patitas en comunidad",
    initials: "PC",
    image: "assets/dog.jpg",
    imageAlt: "Perro de pelo dorado descansando al aire libre",
    condition: "Sábados · 2 horas",
    mode: "Presencial",
    date: 9,
    demo: true,
  },
  {
    id: "clothes",
    type: "object",
    title: "Ropita lista para una segunda aventura",
    description:
      "Un lote de ropa infantil de 4 a 6 años, limpia y en muy buen estado. Hay camisetas, pantalones y una chaqueta. La entrego junta para una familia que la necesite.",
    category: "Ropa y accesorios",
    city: "Cuenca",
    person: "Andrea P.",
    initials: "AP",
    image: "assets/clothes.jpg",
    imageAlt: "Prendas de ropa colgadas ordenadamente",
    condition: "Muy buen estado",
    mode: "Presencial",
    date: 8,
    demo: true,
  },
  {
    id: "seniors",
    type: "volunteer",
    title: "Tu compañía puede alegrar una tarde",
    description:
      "Una invitación a compartir lectura, conversación y juegos de mesa con personas adultas mayores. La actividad se realiza en un espacio comunitario, con coordinación y acompañamiento. Jornada de ejemplo de dos horas.",
    category: "Personas mayores",
    city: "Guayaquil",
    person: "Tiempo compartido",
    initials: "TC",
    image: "assets/seniors.webp",
    imageAlt: "Una persona mayor y una voluntaria comparten una lectura",
    condition: "Miércoles · 2 horas",
    mode: "Presencial",
    date: 7,
    demo: true,
  },
  {
    id: "physics",
    type: "need",
    title: "Un empujoncito con física para mi hijo",
    description:
      "Busco a alguien que pueda explicar movimiento y fuerzas a mi hijo, que está en segundo de bachillerato. Nos serviría una o dos sesiones por videollamada. Yo estaré presente para coordinar las clases.",
    category: "Educación",
    city: "Ambato",
    person: "Lucía V.",
    initials: "LV",
    image: "assets/desk.jpg",
    imageAlt: "Materiales y cuadernos sobre una mesa de estudio",
    condition: "Apoyo escolar",
    mode: "En línea",
    date: 6,
    demo: true,
  },
  {
    id: "digital",
    type: "service",
    title: "Te enseño a usar tu celular, paso a paso",
    description:
      "Comparto una hora para aprender lo básico: enviar fotos, hacer videollamadas y organizar contactos. Pensado para personas adultas mayores. Podemos encontrarnos en un espacio público de la ciudad.",
    category: "Tecnología",
    city: "Loja",
    person: "Mateo C.",
    initials: "MC",
    image: "assets/phone.jpg",
    imageAlt: "Persona utilizando un teléfono móvil",
    condition: "1 hora gratuita",
    mode: "Presencial",
    date: 5,
    demo: true,
  },
  {
    id: "desk",
    type: "object",
    title: "Un escritorio para nuevas ideas",
    description:
      "Escritorio de madera compacto y firme. Tiene algunas marcas de uso y mucho espacio para estudiar. Se retira en el centro de Manta; coordinamos antes para que puedas verlo.",
    category: "Hogar",
    city: "Manta",
    person: "Sofía G.",
    initials: "SG",
    image: "assets/desk.jpg",
    imageAlt: "Escritorio de estudio con cuadernos",
    condition: "Buen estado",
    mode: "Presencial",
    date: 4,
    demo: true,
  },
  {
    id: "language",
    type: "service",
    title: "Compartamos el gusto por la lectura",
    description:
      "Ofrezco dos sesiones de refuerzo de lengua y comprensión lectora para estudiantes de primaria. Una persona adulta responsable debe acompañar al estudiante. Clases por videollamada.",
    category: "Educación",
    city: "Quito",
    person: "Valeria A.",
    initials: "VA",
    image: "assets/books.jpg",
    imageAlt: "Estantería llena de libros para leer",
    condition: "2 clases gratuitas",
    mode: "En línea",
    date: 3,
    demo: true,
  },
  {
    id: "garden",
    type: "volunteer",
    title: "Manos a la tierra por nuestro barrio",
    description:
      "Una mañana para cuidar el huerto comunitario: sembrar, regar y aprender juntos. No hace falta experiencia. Actividad de ejemplo para personas mayores de edad, con herramientas compartidas y coordinación en el lugar.",
    category: "Medioambiente",
    city: "Cuenca",
    person: "Barrio verde",
    initials: "BV",
    image: "assets/garden.jpg",
    imageAlt: "Plantas verdes en un huerto",
    condition: "Domingos · 3 horas",
    mode: "Presencial",
    date: 2,
    demo: true,
  },
  {
    id: "supplies",
    type: "need",
    title: "Útiles que abren oportunidades",
    description:
      "Buscamos cuadernos sin usar, lápices y colores para estudiantes de nuestro barrio. Recibimos materiales nuevos o en buen estado. Coordinamos un punto de entrega público en Ibarra.",
    category: "Educación",
    city: "Ibarra",
    person: "Daniela S.",
    initials: "DS",
    image: "assets/learning.jpg",
    imageAlt: "Útiles y cuadernos para estudiar",
    condition: "Útiles escolares",
    mode: "Presencial",
    date: 1,
    demo: true,
  },
  {
    id: "children",
    type: "volunteer",
    title: "Una tarde para aprender jugando",
    description:
      "Buscamos personas voluntarias para una jornada de lectura y juegos educativos con niñas y niños. La actividad de ejemplo se realiza en un espacio comunitario y con acompañamiento de personas adultas responsables. Jornada de dos horas para voluntarios mayores de edad.",
    category: "Niñas y niños",
    city: "Quito",
    person: "Lecturas compartidas",
    initials: "LC",
    image: "assets/books.jpg",
    imageAlt: "Libros para una jornada de lectura en comunidad",
    condition: "Sábados · 2 horas",
    mode: "Presencial",
    date: 0,
    demo: true,
  },
];
export function normalize(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
export function filterItems(
  items,
  {
    type = "all",
    city = "all",
    query = "",
    category = "all",
    mode = "all",
    sort = "recent",
    savedOnly = false,
    saved = [],
  } = {},
) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return items
    .filter(
      (x) =>
        (type === "all" || x.type === type) &&
        (city === "all" || x.city === city) &&
        (category === "all" || x.category === category) &&
        (mode === "all" || x.mode === mode) &&
        (!savedOnly || saved.includes(x.id)) &&
        terms.every((t) =>
          normalize(
            [x.title, x.description, x.city, x.category, x.person].join(" "),
          ).includes(t),
        ),
    )
    .sort((a, b) =>
      sort === "oldest"
        ? a.date - b.date
        : sort === "title"
          ? a.title.localeCompare(b.title, "es")
          : b.date - a.date,
    );
}
export function normalizePhone(value) {
  const clean = String(value ?? "").replace(/[\s()+.-]/g, "");
  if (/^09\d{8}$/.test(clean)) return "593" + clean.slice(1);
  if (/^5939\d{8}$/.test(clean)) return clean;
  return null;
}
export function validateListing(data) {
  const errors = {};
  if (!types[data.type]) errors.type = "Elige qué quieres publicar.";
  if (
    !data.title ||
    data.title.trim().length < 8 ||
    data.title.trim().length > 90
  )
    errors.title = "Escribe un título de entre 8 y 90 caracteres.";
  if (
    !data.description ||
    data.description.trim().length < 25 ||
    data.description.trim().length > 1500
  )
    errors.description = "Cuéntanos un poco más: entre 25 y 1.500 caracteres.";
  if (!cities.includes(data.city)) errors.city = "Selecciona una ciudad.";
  if (
    !data.person ||
    data.person.trim().length < 2 ||
    data.person.trim().length > 60
  )
    errors.person = "Escribe tu nombre (entre 2 y 60 caracteres).";
  if (data.phone && !normalizePhone(data.phone))
    errors.phone = "Usa un celular ecuatoriano: 09 seguido de 8 números.";
  if (data.consent && !data.phone)
    errors.phone = "Agrega tu número para habilitar WhatsApp.";
  return errors;
}
export const escapeHtml = (s = "") =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function whatsappUrl(item) {
  if (item.demo || !item.consent || !normalizePhone(item.phone)) return null;
  return `https://wa.me/${normalizePhone(item.phone)}?text=${encodeURIComponent("Hola, vi tu anuncio «" + item.title + "» en dóname y me gustaría coordinar contigo.")}`;
}
export function loadState(storage) {
  try {
    const data = JSON.parse(storage.getItem("doname-v1") || "null");
    return {
      posts: Array.isArray(data?.posts) ? data.posts : [],
      saved: Array.isArray(data?.saved) ? data.saved : [],
      interests: Array.isArray(data?.interests) ? data.interests : [],
      hours: Array.isArray(data?.hours) ? data.hours : [],
    };
  } catch {
    return { posts: [], saved: [], interests: [], hours: [] };
  }
}
export function saveState(storage, state) {
  try {
    storage.setItem("doname-v1", JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
