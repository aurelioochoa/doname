import {
  cities,
  types,
  seed,
  filterItems,
  validateListing,
  normalizePhone,
  whatsappUrl,
  escapeHtml as e,
  loadState,
  saveState,
} from "./core.js";
const $ = (s) => document.querySelector(s);
const icon = (name) => `<i class="ph ph-${name}" aria-hidden="true"></i>`;
const state = loadState(localStorage);
const filters = {
  type: "all",
  city: "all",
  query: "",
  category: "all",
  mode: "all",
  sort: "recent",
};
let visible = 8,
  activityTab = "saved",
  toastTimer,
  uploadData = "",
  editingId = null,
  photoRemoved = false,
  uploadSequence = 0;
const allItems = (includeInactive = false) =>
  [...state.posts, ...seed].filter(
    (x) => includeInactive || (!x.fulfilled && !x.archived),
  );
const find = (id) => allItems(true).find((x) => x.id === id);
function persist() {
  if (!saveState(localStorage, state)) {
    toast(
      "El navegador no pudo guardar los cambios. Prueba una foto más pequeña o libera espacio.",
    );
    return false;
  }
  updateCount();
  return true;
}
function updateCount() {
  $("#saved-count").textContent = state.saved.length;
  $("#saved-count").hidden = !state.saved.length;
}
function toast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 4000);
}
function safeImage(item) {
  return /^(assets\/[a-z0-9.-]+|data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+)$/.test(
    item.image || "",
  )
    ? item.image
    : "assets/community.webp";
}
function badge(item) {
  return `<span class="type-label ${e(item.type)}">${icon(types[item.type]?.icon || "hand-heart")}${e(types[item.type]?.label || "Anuncio")}</span>`;
}
function render() {
  const items = filterItems(allItems(), filters);
  const shown = items.slice(0, visible);
  $("#listings").innerHTML = shown.length
    ? shown
        .map(
          (x, i) =>
            `<article class="listing-card" style="--delay:${Math.min(i, 7) * 25}ms"><button class="save-button ${state.saved.includes(x.id) ? "saved" : ""}" data-save="${e(x.id)}" aria-label="${state.saved.includes(x.id) ? "Quitar de favoritos" : "Guardar"}: ${e(x.title)}" aria-pressed="${state.saved.includes(x.id)}">${icon("heart")}</button><button class="card-open" data-detail="${e(x.id)}" aria-label="Ver detalle: ${e(x.title)}"><div class="card-photo"><img src="${e(safeImage(x))}" alt="${e(x.imageAlt || x.title)}" width="400" height="300" loading="lazy"></div><div class="card-body"><div class="card-type-row">${badge(x)}<span class="card-example">${x.demo ? "Ejemplo" : "Tu publicación"}</span></div><h3>${e(x.title)}</h3><div class="card-location">${icon("map-pin")}${e(x.city)}${x.mode === "En línea" ? '<span class="mode">· En línea</span>' : ""}</div><div class="card-footer"><span class="avatar">${e(x.initials)}</span><span>${e(x.person)}</span>${icon("arrow-up-right")}</div></div></button></article>`,
        )
        .join("")
    : `<div class="empty-state">${icon("magnifying-glass")}<h3>Aún no encontramos una coincidencia.</h3><p>Prueba otra palabra, cambia de ciudad o cuéntale a la comunidad lo que necesitas.</p><button class="button outline" data-action="clear">Limpiar filtros</button></div>`;
  $("#results-count").innerHTML =
    `<strong>${items.length} ${items.length === 1 ? "oportunidad" : "oportunidades"}</strong>${filters.city === "all" ? " para conectar" : " en " + e(filters.city)}${filters.category !== "all" ? " · " + e(filters.category) : ""}`;
  $("#load-more").hidden = items.length <= visible;
  document.querySelectorAll("[data-type]").forEach((b) => {
    const selected = b.dataset.type === filters.type;
    b.classList.toggle("selected", selected);
    b.setAttribute("aria-pressed", selected);
  });
  const extras =
    Number(filters.category !== "all") + Number(filters.mode !== "all");
  $("#filter-count").textContent = extras || "";
  document
    .querySelectorAll("[data-nav]")
    .forEach((b) =>
      b.classList.toggle(
        "active",
        b.dataset.nav === (filters.type === "volunteer" ? "volunteer" : "all"),
      ),
    );
  updateCount();
}
function explore(type, category = "all") {
  filters.type = type;
  filters.category = category;
  filters.query = "";
  filters.mode = "all";
  $("#search").value = "";
  visible = 8;
  render();
  $("#explorar").scrollIntoView({ behavior: "smooth", block: "start" });
}
function show(title, html) {
  uploadSequence++;
  $("#modal-content").innerHTML =
    `<div class="modal-header"><h2 id="modal-title">${e(title)}</h2><button class="close-button" data-action="close" aria-label="Cerrar">${icon("x")}</button></div><div class="modal-body">${html}</div>`;
  if (!$("#modal").open) $("#modal").showModal();
  $("#modal").scrollTop = 0;
  document.body.style.overflow = "hidden";
}
function close() {
  uploadSequence++;
  $("#modal").close();
  document.body.style.overflow = "";
}
$("#modal").addEventListener("close", () => {
  document.body.style.overflow = "";
});
$("#modal").addEventListener("click", (ev) => {
  if (ev.target !== $("#modal")) return;
  const r = $("#modal").getBoundingClientRect();
  if (
    ev.clientX < r.left ||
    ev.clientX > r.right ||
    ev.clientY < r.top ||
    ev.clientY > r.bottom
  )
    close();
});
function detail(id) {
  const x = find(id);
  if (!x) return;
  const contact = whatsappUrl(x);
  const interested = state.interests.includes(id);
  show(
    types[x.type].label,
    `<img class="detail-photo" src="${e(safeImage(x))}" alt="${e(x.imageAlt || x.title)}" width="580" height="360">${badge(x)}<h3 class="detail-title">${e(x.title)}</h3><div class="detail-meta"><span>${icon("map-pin")}${e(x.city)}</span><span>${icon(x.mode === "En línea" ? "video-camera" : "users")}${e(x.mode)}</span><span>${icon("gift")}${e(x.condition || "Sin costo")}</span></div><p class="detail-description">${e(x.description)}</p><div class="detail-person"><span class="avatar">${e(x.initials)}</span><div><strong>${e(x.person)}</strong><small>${x.demo ? "Persona u organización de ejemplo" : "Publicado desde este navegador"}</small></div></div>${x.demo ? '<div class="detail-info">Este es un anuncio de ejemplo. Puedes guardar tu interés para probar el recorrido. No se enviará ningún mensaje ni solicitud.</div>' : !contact ? '<div class="detail-info">Esta persona no habilitó el contacto por WhatsApp. Puedes guardar tu interés en este navegador.</div>' : `<div class="detail-info">${icon("whatsapp-logo")} ${e(x.person)} autorizó mostrar su número: <strong>+${e(normalizePhone(x.phone))}</strong>. El botón abre WhatsApp; tú decides si envías el mensaje.</div>`}<div class="detail-actions">${contact && !x.fulfilled && !x.archived ? `<a class="button primary" href="${e(contact)}" target="_blank" rel="noopener noreferrer">${icon("whatsapp-logo")} Contactar por WhatsApp</a>` : x.fulfilled || x.archived ? '<span class="button outline">Este anuncio ya no está activo</span>' : `<button class="button primary" data-interest="${e(id)}">${icon(interested ? "check" : "hand-heart")}${interested ? "Interés guardado" : e(types[x.type].action)}</button>`}<button class="button outline" data-save="${e(id)}">${icon("heart")}<span>${state.saved.includes(id) ? "Guardado" : "Guardar"}</span></button></div>${state.posts.some((p) => p.id === id) ? `<p class="local-note"><button class="text-button" data-edit="${e(id)}">Editar mi publicación ${icon("pencil-simple")}</button></p>` : ""}`,
  );
}
const categories = [
  "Salud y bienestar",
  "Educación",
  "Hogar",
  "Ropa y accesorios",
  "Tecnología",
  "Animales",
  "Personas mayores",
  "Niñas y niños",
  "Medioambiente",
  "Comunidad",
];
function options(values, value, first) {
  return (
    (first ? `<option value="">${first}</option>` : "") +
    values
      .map(
        (v) =>
          `<option value="${e(v)}" ${v === value ? "selected" : ""}>${e(v)}</option>`,
      )
      .join("")
  );
}
function field(name, label, html, help = "") {
  return `<div class="field" data-field="${name}"><label for="pub-${name}">${label}</label>${html}${help ? `<small>${help}</small>` : ""}<span class="error" id="error-${name}"></span></div>`;
}
function publish(id) {
  photoRemoved = false;
  const item = id ? find(id) : null;
  editingId = item?.demo ? null : item?.id || null;
  uploadData = item?.image?.startsWith("data:") ? item.image : "";
  const val = (n) => e(item?.[n] || "");
  const currentType =
    item?.type || (filters.type === "all" ? "object" : filters.type);
  show(
    editingId ? "Edita tu publicación" : "Algo bueno empieza contigo",
    `<p class="modal-intro">Comparte lo que tienes, lo que sabes o lo que necesitas. Aquí todo es gratuito.</p><form id="publish-form" novalidate><div class="modal-tabs" role="group" aria-label="¿Qué quieres publicar?">${Object.entries(
      types,
    )
      .map(
        ([key, t]) =>
          `<label><input type="radio" name="type" value="${key}" ${key === currentType ? "checked" : ""}>${icon(t.icon)}<span>${e(t.offer)}</span></label>`,
      )
      .join(
        "",
      )}</div>${field("title", "Título del anuncio *", `<input id="pub-title" name="title" maxlength="90" required placeholder="Por ejemplo: dono una silla de ruedas" value="${val("title")}" aria-describedby="error-title">`)}${field("description", "Cuéntanos un poco más *", `<textarea id="pub-description" name="description" maxlength="1500" required placeholder="¿Qué ofreces o necesitas? Incluye el estado, los horarios o cómo se puede coordinar." aria-describedby="error-description">${val("description")}</textarea>`)}<div class="field"><label for="pub-photo">Foto (opcional)</label><label class="photo-upload" for="pub-photo">${uploadData ? `<img src="${e(uploadData)}" alt="Vista previa de tu foto">` : icon("camera")}<span>Una foto ayuda a conectar<small>JPG, PNG o WebP. Máximo 5 MB.</small></span></label><input class="photo-input" id="pub-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp"><span id="photo-error" class="error" role="alert"></span><button id="remove-photo" type="button" class="text-button" data-action="remove-photo" ${uploadData ? "" : "hidden"}>Quitar foto</button></div><div class="form-row">${field("city", "Ciudad *", `<select id="pub-city" name="city" required aria-describedby="error-city">${options(cities, item?.city, "Selecciona tu ciudad")}</select>`)}${field("mode", "Modalidad", `<select id="pub-mode" name="mode">${options(["Presencial", "En línea"], item?.mode || "Presencial")}</select>`)}</div><div class="form-row">${field("category", "Categoría", `<select id="pub-category" name="category">${options(categories, item?.category || "Comunidad")}</select>`)}${field("condition", "Estado o disponibilidad", `<input id="pub-condition" name="condition" maxlength="60" placeholder="Buen estado, 3 clases..." value="${val("condition")}">`)}</div>${field("person", "Tu nombre o el de tu iniciativa *", `<input id="pub-person" name="person" maxlength="60" required autocomplete="given-name" value="${val("person")}" placeholder="¿Cómo te llamas?" aria-describedby="error-person">`)}${field("phone", "WhatsApp (opcional)", `<input id="pub-phone" name="phone" type="tel" inputmode="tel" placeholder="09XXXXXXXX" autocomplete="tel" value="${val("phone")}" aria-describedby="phone-help error-phone">`, '<span id="phone-help">Solo guardaremos y mostraremos tu número si activas la autorización de abajo.</span>')}<label class="check-field"><input type="checkbox" name="consent" ${item?.consent ? "checked" : ""}><span>Autorizo que mi número aparezca en el detalle de este anuncio para que puedan contactarme por WhatsApp.</span></label><div id="publish-error" class="form-message" role="alert"></div><button class="button primary full" type="submit">${editingId ? "Guardar cambios" : "Publicar en la maqueta"} ${icon("arrow-up-right")}</button><p class="local-note">Sin cuentas. Este anuncio se guarda solo en este navegador.<br>Evita incluir direcciones exactas o datos privados en la descripción.</p></form>`,
  );
  $("#pub-photo").addEventListener("change", readPhoto);
  $("#publish-form").addEventListener("submit", submitPublish);
}
async function readPhoto(ev) {
  const sequence = ++uploadSequence;
  const file = ev.target.files?.[0];
  if (!file) return;
  $("#photo-error").textContent = "";
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 5 * 1024 * 1024
  ) {
    $("#photo-error").textContent =
      "Elige una imagen JPG, PNG o WebP de hasta 5 MB.";
    ev.target.value = "";
    return;
  }
  const submit = $("#publish-form button[type=submit]");
  submit.disabled = true;
  $("#photo-error").textContent = "Preparando foto…";
  try {
    const data = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = data;
    });
    if (sequence !== uploadSequence || !$("#publish-form")) return;
    const scale = Math.min(1, 1200 / image.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    uploadData = canvas.toDataURL("image/jpeg", 0.8);
    photoRemoved = false;
    $(".photo-upload").innerHTML =
      `<img src="${uploadData}" alt="Vista previa de tu foto"><span>Foto lista<small>${e(file.name)}</small></span>`;
    $("#remove-photo").hidden = false;
    $("#photo-error").textContent = "";
  } catch {
    if (sequence === uploadSequence && $("#photo-error"))
      $("#photo-error").textContent =
        "No pudimos leer la foto. Prueba otra imagen.";
  } finally {
    if (submit.isConnected) submit.disabled = false;
  }
}
function submitPublish(ev) {
  ev.preventDefault();
  const form = ev.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  data.consent = form.elements.consent.checked;
  data.phone = data.phone.trim();
  const errors = validateListing(data);
  form.querySelectorAll(".field").forEach((f) => {
    f.classList.remove("invalid");
    const control = f.querySelector("input,textarea,select");
    control?.removeAttribute("aria-invalid");
    f.querySelector(".error").textContent = "";
  });
  if (Object.keys(errors).length) {
    for (const [name, msg] of Object.entries(errors)) {
      const f = form.querySelector(`[data-field="${name}"]`);
      if (f) {
        f.classList.add("invalid");
        f.querySelector(".error").textContent = msg;
        f.querySelector("input,textarea,select")?.setAttribute(
          "aria-invalid",
          "true",
        );
      }
    }
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  const previous = editingId ? find(editingId) : null;
  const item = {
    id: editingId || crypto.randomUUID(),
    type: data.type,
    title: data.title.trim(),
    description: data.description.trim(),
    city: data.city,
    mode: data.mode,
    category: data.category,
    person: data.person.trim(),
    initials: data.person
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase(),
    condition: data.condition.trim() || "Sin costo",
    consent: data.consent,
    phone: data.consent ? normalizePhone(data.phone) : "",
    image:
      uploadData ||
      (!photoRemoved && previous?.image) ||
      "assets/community.webp",
    imageAlt: uploadData ? "Foto de " + data.title.trim() : data.title.trim(),
    date: previous?.date || Date.now(),
    demo: false,
    fulfilled: previous?.fulfilled || false,
    archived: previous?.archived || false,
  };
  const oldPosts = [...state.posts];
  if (editingId)
    state.posts = state.posts.map((x) => (x.id === editingId ? item : x));
  else state.posts.unshift(item);
  if (!persist()) {
    state.posts = oldPosts;
    $("#publish-error").textContent =
      "No hay espacio suficiente para guardar la publicación. Prueba una imagen más pequeña.";
    return;
  }
  render();
  show(
    editingId ? "Cambios guardados" : "Tu gesto ya tiene un lugar",
    `<div class="success-state"><div class="success-icon">${icon("hand-heart")}</div><h3>${editingId ? "Todo listo." : "Gracias por compartir."}</h3><p>«${e(item.title)}» está ${editingId ? "actualizado" : "publicado"} en esta maqueta. Se conservará en este navegador y podrás gestionarlo en Mi actividad.</p><button class="button primary" data-detail="${e(item.id)}">Ver mi publicación ${icon("arrow-up-right")}</button></div>`,
  );
}
function toggleSave(id) {
  const original = [...state.saved];
  const i = state.saved.indexOf(id);
  if (i === -1) state.saved.push(id);
  else state.saved.splice(i, 1);
  if (!persist()) {
    state.saved = original;
    return;
  }
  render();
  toast(i === -1 ? "Guardado en Mi actividad." : "Se quitó de tus favoritos.");
  if ($("#modal").open) {
    const view = $("#modal-content").dataset.view;
    if (view === "activity") activity(activityTab);
    else {
      const btn = $(`#modal [data-save="${CSS.escape(id)}"]`);
      if (btn)
        btn.innerHTML =
          icon("heart") +
          `<span>${state.saved.includes(id) ? "Guardado" : "Guardar"}</span>`;
    }
  }
}
function activity(tab = "saved") {
  activityTab = tab;
  let items =
    tab === "posts"
      ? state.posts
      : tab === "interests"
        ? allItems(true).filter((x) => state.interests.includes(x.id))
        : allItems(true).filter((x) => state.saved.includes(x.id));
  const tabNames = {
    saved: `Guardados (${state.saved.length})`,
    posts: `Mis publicaciones (${state.posts.length})`,
    interests: `Me interesa (${state.interests.length})`,
  };
  show(
    "Mi actividad",
    `<p class="modal-intro">Tus pequeños gestos, en un solo lugar. No necesitas una cuenta: todo queda en este navegador.</p><div class="activity-tabs">${Object.entries(
      tabNames,
    )
      .map(
        ([key, name]) =>
          `<button class="${key === tab ? "selected" : ""}" data-activity-tab="${key}" aria-pressed="${key === tab}">${name}</button>`,
      )
      .join(
        "",
      )}<button data-action="certificate">Mis horas</button></div>${items.length ? items.map((x) => `<div class="activity-item"><img src="${e(safeImage(x))}" alt="${e(x.title)}"><div><button class="item-title" data-detail="${e(x.id)}">${e(x.title)}</button><p>${e(types[x.type].label)} · ${e(x.city)} ${x.demo ? "· Ejemplo" : ""} ${x.archived ? '<span class="pill">Archivado</span>' : x.fulfilled ? '<span class="pill">Completado</span>' : ""}</p><div class="item-tools">${tab === "posts" ? `<button data-edit="${e(x.id)}">Editar</button><button data-fulfill="${e(x.id)}">${x.fulfilled ? "Reactivar" : "Marcar completado"}</button><button data-archive="${e(x.id)}">${x.archived ? "Restaurar" : "Archivar"}</button>` : tab === "saved" ? `<button data-save="${e(x.id)}">Quitar de guardados</button>` : `<button data-uninterest="${e(x.id)}">Quitar interés</button>`}</div></div></div>`).join("") : `<div class="empty-state">${icon(tab === "saved" ? "heart" : tab === "posts" ? "package" : "hand-heart")}<h3>${tab === "posts" ? "Tu primer gesto puede empezar hoy." : "Aquí hay espacio para algo bueno."}</h3><p>${tab === "saved" ? "Toca el corazón de un anuncio para encontrarlo aquí." : tab === "posts" ? "Publica un objeto, un servicio, una necesidad o un voluntariado." : "Guarda tu interés en un anuncio de ejemplo para probar el recorrido."}</p><button class="button outline" data-action="${tab === "posts" ? "publish" : "close"}">${tab === "posts" ? "Quiero ayudar" : "Seguir explorando"}</button></div>`}`,
  );
  $("#modal-content").dataset.view = "activity";
}
function extraFilters() {
  show(
    "Encuentra tu conexión",
    `<p class="modal-intro">Ajusta la búsqueda para encontrar lo que necesitas.</p><form id="filters-form">${field("category", "Categoría", `<select id="pub-category" name="category"><option value="all">Todas las categorías</option>${options(categories, filters.category)}</select>`)}${field("mode", "Modalidad", `<select id="pub-mode" name="mode"><option value="all">Presencial y en línea</option>${options(["Presencial", "En línea"], filters.mode)}</select>`)}<div class="detail-actions"><button class="button primary" type="submit">Aplicar filtros ${icon("check")}</button><button class="button outline" type="button" data-action="clear">Limpiar todo</button></div></form>`,
  );
  $("#filters-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    filters.category = form.get("category");
    filters.mode = form.get("mode");
    visible = 8;
    render();
    close();
  });
}
function certificate() {
  const total = state.hours
    .filter((x) => !x.archived)
    .reduce((a, x) => a + Number(x.hours), 0);
  show(
    "El tiempo que compartes",
    `<p class="modal-intro">Prueba el registro de horas y genera una constancia de ejemplo. Las horas son declaradas por ti y no están verificadas por una organización.</p><div class="hours-summary"><strong>${total}</strong><span>${total === 1 ? "hora registrada" : "horas registradas"}<br>de servicio o voluntariado</span></div><form id="hours-form" novalidate><div class="field"><label for="hours-name">Tu nombre *</label><input id="hours-name" name="name" required minlength="2" maxlength="60" placeholder="Nombre que aparecerá en la constancia" value="${e(state.hours.at(-1)?.name || "")}"></div><div class="field"><label for="hours-activity">Servicio o actividad *</label><input id="hours-activity" name="activity" required minlength="5" maxlength="100" placeholder="Por ejemplo: clase gratuita de matemáticas"></div><div class="form-row"><div class="field"><label for="hours-amount">Horas compartidas *</label><input id="hours-amount" name="hours" type="number" min="0.5" max="24" step="0.5" value="1" required></div><div class="field"><label for="hours-date">Fecha de la actividad *</label><input id="hours-date" name="date" type="date" value="${new Date().toLocaleDateString("en-CA")}" max="${new Date().toLocaleDateString("en-CA")}" required></div></div><div class="form-message" id="hours-error" role="alert"></div><button class="button primary full" type="submit">Registrar horas ${icon("plus")}</button></form>${
      state.hours.some((x) => !x.archived)
        ? `<div style="margin:20px 0">${state.hours
            .filter((x) => !x.archived)
            .map(
              (x) =>
                `<div class="hours-item"><span>${e(x.activity)} · ${e(x.hours)} h</span><button data-hours-remove="${e(x.id)}">Quitar</button></div>`,
            )
            .join(
              "",
            )}</div><button class="button outline full" data-action="preview-cert">Ver constancia ${icon("certificate")}</button>`
        : ""
    }<p class="local-note">Modelo de demostración. No es un certificado acreditado.</p>`,
  );
  $("#hours-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const f = Object.fromEntries(new FormData(form));
    if (
      !form.checkValidity() ||
      f.name.trim().length < 2 ||
      f.activity.trim().length < 5 ||
      !Number.isFinite(Number(f.hours))
    ) {
      $("#hours-error").textContent =
        "Completa tu nombre, una actividad de al menos 5 caracteres, las horas (0,5 a 24) y una fecha válida.";
      form.reportValidity();
      return;
    }
    const entry = {
      ...f,
      name: f.name.trim(),
      activity: f.activity.trim(),
      hours: Number(f.hours),
      id: crypto.randomUUID(),
    };
    state.hours.push(entry);
    if (!persist()) {
      state.hours.pop();
      return;
    }
    certificate();
    toast("Horas registradas en este navegador.");
  });
}
function previewCertificate() {
  const entries = state.hours.filter((x) => !x.archived);
  if (!entries.length) return certificate();
  const name = entries.at(-1).name;
  const nameEntries = entries.filter(
    (x) => x.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
  const hours = nameEntries.reduce((a, x) => a + x.hours, 0);
  show(
    "Tu constancia de ejemplo",
    `<div class="certificate-preview"><span class="brand">dóname.</span><h3>Constancia de participación</h3><p>Un reconocimiento al tiempo compartido por</p><div class="cert-name">${e(name)}</div><p>Por declarar <strong>${hours} ${hours === 1 ? "hora" : "horas"}</strong> de servicio y voluntariado.<br>Cada pequeño gesto construye una comunidad más cercana.</p><p>${e(nameEntries.map((x) => x.activity).join(" · "))}</p><p>Emitido el ${new Date().toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" })}</p><div class="cert-disclaimer">EJEMPLO DE MAQUETA · HORAS AUTODECLARADAS<br>Sin validación de una organización. No acredita formación ni experiencia.</div></div><button class="button primary full" data-action="print">${icon("printer")} Imprimir o guardar como PDF</button><p class="local-note">En el diálogo de impresión puedes elegir «Guardar como PDF».</p>`,
  );
}
function how() {
  show(
    "Dar y recibir es así de sencillo",
    `<p class="modal-intro">Una comunidad que conecta lo que alguien puede compartir con lo que otra persona necesita.</p><div class="steps"><div class="step"><span>${icon("magnifying-glass")}</span><div><h3>Encuentra una conexión</h3><p>Explora objetos, servicios y voluntariados. Busca por palabra, ciudad, categoría o modalidad.</p></div></div><div class="step"><span>${icon("hand-heart")}</span><div><h3>Comparte o pide una mano</h3><p>Publica con una foto y una descripción. Puede ser una silla de ruedas, clases gratuitas o una necesidad de tu comunidad.</p></div></div><div class="step"><span>${icon("whatsapp-logo")}</span><div><h3>Coordina con la persona</h3><p>Cuando quien publica lo autoriza, puedes abrir su WhatsApp para conversar. En los ejemplos, solo se guarda tu interés.</p></div></div><div class="step"><span>${icon("certificate")}</span><div><h3>Reconoce el tiempo compartido</h3><p>Prueba el registro de horas y una constancia de ejemplo. En esta maqueta, las horas son autodeclaradas.</p></div></div></div><div class="detail-info" style="margin-top:23px">Esta primera versión no tiene cuentas. Las publicaciones, favoritos y horas quedan únicamente en este navegador.</div>`,
  );
}
const actions = {
  close,
  publish: () => publish(),
  activity: () => activity(),
  how,
  filters: extraFilters,
  certificate,
  "preview-cert": previewCertificate,
  print: () => window.print(),
  clear: () => {
    Object.assign(filters, {
      type: "all",
      city: "all",
      query: "",
      category: "all",
      mode: "all",
      sort: "recent",
    });
    $("#search").value = "";
    $("#city").value = "all";
    $("#sort").value = "recent";
    visible = 8;
    render();
    if ($("#modal").open) close();
  },
  "remove-photo": () => {
    uploadData = "";
    photoRemoved = true;
    $("#pub-photo").value = "";
    $(".photo-upload").innerHTML =
      icon("camera") +
      "<span>Una foto ayuda a conectar<small>JPG, PNG o WebP. Máximo 5 MB.</small></span>";
    $("#remove-photo").hidden = true;
  },
  community: () =>
    show(
      "Cuidemos la comunidad",
      `<div class="simple-copy"><h3>Comparte sin cobrar</h3><p>dóname está pensado para donaciones y ayuda gratuita. Describe con honestidad lo que ofreces y respeta el tiempo de las demás personas.</p><h3>Coordina con cuidado</h3><p>Para entregar objetos, acuerden un lugar público. No publiques tu dirección exacta ni datos privados. Una persona adulta responsable debe coordinar cualquier actividad con menores.</p><h3>Ayuda con respeto</h3><p>Pedir ayuda y ofrecerla merecen la misma dignidad. Aclara la disponibilidad y las condiciones antes de coordinar.</p><h3>Estamos probando la idea</h3><p>Los anuncios iniciales son ejemplos. Esta maqueta aún no cuenta con moderación, verificación de organizaciones ni denuncias entre usuarios.</p></div>`,
    ),
  privacy: () =>
    show(
      "Tus datos, con claridad",
      `<div class="simple-copy"><p>Esta maqueta no tiene login ni cuentas. Tus anuncios, favoritos y horas se guardan en el almacenamiento local de este navegador y no se comparten con otros visitantes.</p><p>Tu número de WhatsApp solo se guarda y muestra en el anuncio cuando marcas la casilla de autorización. Puedes editar tu publicación y retirarla cuando quieras.</p><p>El botón de contacto abre WhatsApp con un borrador de mensaje. Tú decides si lo envías. No se envían mensajes de forma automática.</p><p>Si borras los datos del sitio o cambias de navegador, tu actividad local no estará disponible. Este prototipo no utiliza analítica ni cookies publicitarias.</p></div>`,
    ),
};
document.addEventListener("click", (ev) => {
  const b = ev.target.closest("button,a");
  if (!b) return;
  const d = b.dataset;
  if (d.action && actions[d.action]) {
    ev.preventDefault();
    if (d.action !== "activity") delete $("#modal-content").dataset.view;
    actions[d.action]();
  } else if (d.type) {
    filters.type = d.type;
    visible = 8;
    render();
  } else if (d.detail) {
    delete $("#modal-content").dataset.view;
    detail(d.detail);
  } else if (d.save) toggleSave(d.save);
  else if (d.explore) {
    ev.preventDefault();
    explore(d.explore);
  } else if (d.cause) {
    explore("volunteer", d.cause);
  } else if (d.nav) {
    ev.preventDefault();
    explore(d.nav);
  } else if (d.edit) {
    delete $("#modal-content").dataset.view;
    publish(d.edit);
  } else if (d.activityTab) activity(d.activityTab);
  else if (d.interest) {
    if (!state.interests.includes(d.interest)) {
      state.interests.push(d.interest);
      if (!persist()) {
        state.interests.pop();
        return;
      }
    }
    show(
      "Tu interés quedó guardado",
      `<div class="success-state"><div class="success-icon">${icon("hand-heart")}</div><h3>Una conexión empieza con un gesto.</h3><p>Guardamos «${e(find(d.interest)?.title)}» en Mi actividad. Este es un recorrido de demostración: no se ha enviado ninguna solicitud.</p><button class="button primary" data-activity-tab="interests">Ver mi actividad ${icon("arrow-right")}</button></div>`,
    );
  } else if (d.uninterest) {
    const old = [...state.interests];
    state.interests = state.interests.filter((id) => id !== d.uninterest);
    if (persist()) activity("interests");
    else state.interests = old;
  } else if (d.fulfill || d.archive) {
    const id = d.fulfill || d.archive;
    const x = state.posts.find((x) => x.id === id);
    if (!x) return;
    const key = d.fulfill ? "fulfilled" : "archived";
    x[key] = !x[key];
    if (persist()) {
      render();
      activity("posts");
      toast(
        x[key]
          ? key === "fulfilled"
            ? "Publicación marcada como completada."
            : "Publicación archivada. Puedes restaurarla aquí."
          : "Publicación reactivada.",
      );
    } else x[key] = !x[key];
  } else if (d.hoursRemove) {
    const x = state.hours.find((x) => x.id === d.hoursRemove);
    if (x) {
      x.archived = true;
      if (persist()) {
        certificate();
        toast("Registro retirado de la constancia.");
      } else x.archived = false;
    }
  }
});
$("#city").insertAdjacentHTML("beforeend", options(cities));
$("#city").addEventListener("change", (ev) => {
  filters.city = ev.target.value;
  visible = 8;
  render();
});
$("#sort").addEventListener("change", (ev) => {
  filters.sort = ev.target.value;
  visible = 8;
  render();
});
$("#search-form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  filters.query = $("#search").value;
  visible = 8;
  render();
});
let searchTimer;
$("#search").addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filters.query = $("#search").value;
    visible = 8;
    render();
  }, 250);
});
$("#load-more").addEventListener("click", () => {
  visible += 8;
  render();
});
render();
