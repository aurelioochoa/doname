import {
  cities,
  types,
  seed,
  filterItems,
  normalizePhone,
  whatsappUrl,
  escapeHtml as e,
  loadState,
  saveState,
  readBrowseParams,
  writeBrowseParams,
} from "./core.js?v=3";
const $ = (s) => document.querySelector(s);
const icon = (name) => `<i class="ph ph-${e(name)}" aria-hidden="true"></i>`;
const state = loadState(localStorage);
const isExplore = Boolean($("#listings"));
const filters = readBrowseParams(location.search);
let viewMode = "grid";
try {
  viewMode = localStorage.getItem("doname-view") === "list" ? "list" : "grid";
} catch {}
let visible = 8,
  activityTab = "saved",
  toastTimer;
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
  if (!$("#saved-count")) return;
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
    : null;
}
function photoMarkup(item, context = "card") {
  const src = safeImage(item);
  if (src)
    return `<img class="${context === "detail" ? "detail-photo" : ""}" src="${e(src)}" alt="${e(item.imageAlt || item.title)}" width="${context === "detail" ? 580 : 400}" height="${context === "detail" ? 360 : 300}" loading="lazy">`;
  const kind = types[item.type] || types.object;
  return `<div class="item-illustration ${e(item.type)} ${context === "detail" ? "detail-photo" : ""}" role="img" aria-label="Ilustración de ${e(kind.label.toLowerCase())}">${icon(item.illustration || kind.icon)}<span>${e(kind.label)}</span></div>`;
}
function activityPhoto(item) {
  const src = safeImage(item);
  return src
    ? `<img src="${e(src)}" alt="${e(item.title)}">`
    : `<span class="activity-illustration ${e(item.type)}" aria-hidden="true">${icon(item.illustration || types[item.type]?.icon || "hand-heart")}</span>`;
}
function badge(item) {
  return `<span class="type-label ${e(item.type)}">${icon(types[item.type]?.icon || "hand-heart")}${e(types[item.type]?.label || "Anuncio")}</span>`;
}
function render() {
  updateCount();
  if (!isExplore) return;
  const items = filterItems(allItems(), { ...filters, saved: state.saved });
  const shown = items.slice(0, visible);
  $("#listings").innerHTML = shown.length
    ? shown
        .map(
          (x, i) =>
            `<article class="listing-card" style="--delay:${Math.min(i, 7) * 25}ms"><button class="save-button ${state.saved.includes(x.id) ? "saved" : ""}" data-save="${e(x.id)}" aria-label="${state.saved.includes(x.id) ? "Quitar de favoritos" : "Guardar"}: ${e(x.title)}" aria-pressed="${state.saved.includes(x.id)}">${icon("heart")}</button><button class="card-open" data-detail="${e(x.id)}" aria-label="Ver detalle: ${e(x.title)}"><div class="card-photo">${photoMarkup(x)}</div><div class="card-body"><div class="card-type-row">${badge(x)}<span class="card-example">${x.demo ? "Ejemplo" : "Tu publicación"}</span></div><h3>${e(x.title)}</h3><p class="card-excerpt">${e(x.description)}</p><div class="card-location">${icon("map-pin")}${e(x.city)}${x.mode === "En línea" ? '<span class="mode">· En línea</span>' : ""}</div><div class="card-footer"><span class="avatar">${e(x.initials)}</span><span>${e(x.person)}</span>${icon("arrow-up-right")}</div></div></button></article>`,
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
  $("#listings").classList.toggle("list-view", viewMode === "list");
  document
    .querySelectorAll("[data-view]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", b.dataset.view === viewMode),
    );
  document
    .querySelector('[data-action="saved-only"]')
    ?.setAttribute("aria-pressed", filters.savedOnly);
  renderFilterChips();
  syncBrowseUrl();
  updateCount();
}
function explore(type, category = "all") {
  if (!isExplore) {
    const query = writeBrowseParams({ type, category });
    location.href = "explorar.html" + (query ? "?" + query : "");
    return;
  }
  Object.assign(filters, {
    type,
    category,
    query: "",
    mode: "all",
    savedOnly: false,
  });
  $("#search").value = "";
  visible = 8;
  render();
  $("#explorar").scrollIntoView({
    behavior: reducedMotion.matches ? "instant" : "smooth",
    block: "start",
  });
}
function syncBrowseUrl() {
  if (!isExplore) return;
  const params = new URLSearchParams(writeBrowseParams(filters));
  const post = new URLSearchParams(location.search).get("anuncio");
  if (post) params.set("anuncio", post);
  const next = location.pathname + (params.size ? "?" + params : "");
  if (location.pathname + location.search !== next)
    history.replaceState(null, "", next);
}
function renderFilterChips() {
  const values = {
    city: filters.city,
    category: filters.category,
    mode: filters.mode,
    query: filters.query,
  };
  $("#active-filters").innerHTML =
    Object.entries(values)
      .filter(([, value]) => value && value !== "all")
      .map(
        ([key, value]) =>
          `<button class="active-chip" data-remove-filter="${key}">${e(key === "query" ? "«" + value + "»" : value)} ${icon("x")}</button>`,
      )
      .join("") +
    (filters.savedOnly
      ? `<button class="active-chip" data-remove-filter="savedOnly">Mis guardados ${icon("x")}</button>`
      : "");
}
function show(title, html) {
  $("#modal-content").innerHTML =
    `<div class="modal-header"><h2 id="modal-title">${e(title)}</h2><button class="close-button" data-action="close" aria-label="Cerrar">${icon("x")}</button></div><div class="modal-body">${html}</div>`;
  if (!$("#modal").open) $("#modal").showModal();
  $("#modal").scrollTop = 0;
  $("#modal .close-button")?.focus({ preventScroll: true });
  document.body.style.overflow = "hidden";
}
function close() {
  if (isExplore) {
    const url = new URL(location.href);
    if (url.searchParams.has("anuncio")) {
      url.searchParams.delete("anuncio");
      history.replaceState(null, "", url.pathname + url.search);
    }
  }
  $("#modal").close();
  document.body.style.overflow = "";
}
$("#modal").addEventListener("close", () => {
  if (isExplore) {
    const url = new URL(location.href);
    if (url.searchParams.has("anuncio")) {
      url.searchParams.delete("anuncio");
      history.replaceState(null, "", url.pathname + url.search);
    }
  }
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
  if (isExplore) {
    const url = new URL(location.href);
    url.searchParams.set("anuncio", id);
    history.replaceState(null, "", url.pathname + url.search);
  }
  const contact = whatsappUrl(x);
  const interested = state.interests.includes(id);
  show(
    types[x.type].label,
    `${photoMarkup(x, "detail")}${badge(x)}<h3 class="detail-title">${e(x.title)}</h3><div class="detail-meta"><span>${icon("map-pin")}${e(x.city)}</span><span>${icon(x.mode === "En línea" ? "video-camera" : "users")}${e(x.mode)}</span><span>${icon("gift")}${e(x.condition || "Sin costo")}</span></div><p class="detail-description">${e(x.description)}</p><div class="detail-person"><span class="avatar">${e(x.initials)}</span><div><strong>${e(x.person)}</strong><small>${x.demo ? "Persona u organización de ejemplo" : "Publicado desde este navegador"}</small></div></div>${x.demo ? '<div class="detail-info">Este es un anuncio de ejemplo. Puedes guardar tu interés para probar el recorrido. No se enviará ningún mensaje ni solicitud.</div>' : !contact ? '<div class="detail-info">Esta persona no habilitó el contacto por WhatsApp. Puedes guardar tu interés en este navegador.</div>' : `<div class="detail-info">${icon("whatsapp-logo")} ${e(x.person)} autorizó mostrar su número: <strong>+${e(normalizePhone(x.phone))}</strong>. El botón abre WhatsApp; tú decides si envías el mensaje.</div>`}<div class="detail-actions">${contact && !x.fulfilled && !x.archived ? `<a class="button primary" href="${e(contact)}" target="_blank" rel="noopener noreferrer">${icon("whatsapp-logo")} Contactar por WhatsApp</a>` : x.fulfilled || x.archived ? '<span class="button outline">Este anuncio ya no está activo</span>' : `<button class="button primary" data-interest="${e(id)}">${icon(interested ? "check" : "hand-heart")}${interested ? "Interés guardado" : e(types[x.type].action)}</button>`}<button class="button outline" data-save="${e(id)}">${icon("heart")}<span>${state.saved.includes(id) ? "Guardado" : "Guardar"}</span></button></div><div class="detail-secondary">${x.demo ? `<button class="text-button" data-share="${e(id)}">${icon("link")}Copiar enlace del anuncio</button>` : '<span class="field-help">Tu anuncio es local y aún no tiene un enlace público.</span>'}<span>${icon("gift")}Todo se comparte gratis</span></div>${state.posts.some((p) => p.id === id) ? `<p class="local-note"><button class="text-button" data-edit="${e(id)}">Editar mi publicación ${icon("pencil-simple")}</button></p>` : ""}`,
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
  const params = new URLSearchParams();
  if (id) params.set("editar", id);
  else if (filters.type !== "all") params.set("tipo", filters.type);
  location.href = "publicar.html" + (params.size ? "?" + params : "");
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
    `<div class="activity-summary"><div><strong>${state.posts.filter((x) => !x.archived).length}</strong><span>publicaciones</span></div><div><strong>${state.saved.length}</strong><span>guardados</span></div><div><strong>${state.hours.filter((x) => !x.archived).reduce((sum, x) => sum + Number(x.hours), 0)}</strong><span>horas compartidas</span></div></div><p class="modal-intro">Tus pequeños gestos, en un solo lugar. No necesitas una cuenta: todo queda en este navegador.</p><div class="activity-tabs">${Object.entries(
      tabNames,
    )
      .map(
        ([key, name]) =>
          `<button class="${key === tab ? "selected" : ""}" data-activity-tab="${key}" aria-pressed="${key === tab}">${name}</button>`,
      )
      .join(
        "",
      )}<button data-action="certificate">Mis horas</button></div>${items.length ? items.map((x) => `<div class="activity-item">${activityPhoto(x)}<div><button class="item-title" data-detail="${e(x.id)}">${e(x.title)}</button><p>${e(types[x.type].label)} · ${e(x.city)} ${x.demo ? "· Ejemplo" : ""} ${x.archived ? '<span class="pill">Archivado</span>' : x.fulfilled ? '<span class="pill">Completado</span>' : ""}</p><div class="item-tools">${tab === "posts" ? `<button data-edit="${e(x.id)}">Editar</button><button data-fulfill="${e(x.id)}">${x.fulfilled ? "Reactivar" : "Marcar completado"}</button><button data-archive="${e(x.id)}">${x.archived ? "Restaurar" : "Archivar"}</button>` : tab === "saved" ? `<button data-save="${e(x.id)}">Quitar de guardados</button>` : `<button data-uninterest="${e(x.id)}">Quitar interés</button>`}</div></div></div>`).join("") : `<div class="empty-state">${icon(tab === "saved" ? "heart" : tab === "posts" ? "package" : "hand-heart")}<h3>${tab === "posts" ? "Tu primer gesto puede empezar hoy." : "Aquí hay espacio para algo bueno."}</h3><p>${tab === "saved" ? "Toca el corazón de un anuncio para encontrarlo aquí." : tab === "posts" ? "Publica un objeto, un servicio, una necesidad o un voluntariado." : "Guarda tu interés en un anuncio de ejemplo para probar el recorrido."}</p><button class="button outline" data-action="${tab === "posts" ? "publish" : "close"}">${tab === "posts" ? "Quiero ayudar" : "Seguir explorando"}</button></div>`}`,
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
function closeMenu() {
  $(".nav").classList.remove("mobile-open");
  const menu = $('[data-action="menu"]');
  menu?.setAttribute("aria-expanded", "false");
  menu?.setAttribute("aria-label", "Abrir menú");
}
const actions = {
  close,
  menu: () => {
    const open = !$(".nav").classList.contains("mobile-open");
    $(".nav").classList.toggle("mobile-open", open);
    const b = $('[data-action="menu"]');
    b.setAttribute("aria-expanded", open);
    b.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (open) $("#primary-nav a")?.focus();
  },
  "back-top": () =>
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "instant" : "smooth",
    }),
  "publish-need": () => {
    filters.type = "need";
    publish();
  },
  "saved-only": () => {
    filters.savedOnly = !filters.savedOnly;
    visible = 8;
    render();
  },
  "share-search": () => copyText(location.href, "Enlace de búsqueda copiado."),
  "discard-draft": () => {
    try {
      localStorage.removeItem("doname-draft");
    } catch {}
    publish();
  },
  publish: () => publish(),
  activity: () => activity(),
  how: () => {
    location.href = "guia.html";
  },
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
    filters.savedOnly = false;
    if (isExplore) {
      $("#search").value = "";
      $("#city").value = "all";
      $("#sort").value = "recent";
    }
    visible = 8;
    render();
    if ($("#modal").open) close();
  },
  community: () =>
    show(
      "Cuidemos la comunidad",
      `<div class="simple-copy"><h3>Comparte sin cobrar</h3><p>dóname está pensado para donaciones y ayuda gratuita. Describe con honestidad lo que ofreces y respeta el tiempo de las demás personas.</p><h3>Coordina con cuidado</h3><p>Para entregar objetos, acuerden un lugar público. No publiques tu dirección exacta ni datos privados. Una persona adulta responsable debe coordinar cualquier actividad con menores.</p><h3>Ayuda con respeto</h3><p>Pedir ayuda y ofrecerla merecen la misma dignidad. Aclara la disponibilidad y las condiciones antes de coordinar.</p><h3>Estamos probando la idea</h3><p>Los anuncios iniciales son ejemplos. Esta maqueta aún no cuenta con moderación, verificación de organizaciones ni denuncias entre usuarios.</p></div>`,
    ),
  privacy: () =>
    show(
      "Tus datos, con claridad",
      `<div class="simple-copy"><p>Esta maqueta no tiene login ni cuentas. Tus anuncios, favoritos y horas se guardan en el almacenamiento local de este navegador y no se comparten con otros visitantes.</p><p>Tu número de WhatsApp solo se guarda y muestra en el anuncio cuando marcas la casilla de autorización. Puedes editar tu publicación y retirarla cuando quieras.</p><p>El botón de contacto abre WhatsApp con un borrador de mensaje. Tú decides si lo envías. No se envían mensajes de forma automática.</p><p>Si borras los datos del sitio o cambias de navegador, tu actividad local no estará disponible. También recordamos tu apariencia y la vista de resultados. El borrador de publicación conserva solo texto: no guarda teléfono ni foto. Este prototipo no utiliza analítica ni cookies publicitarias.</p></div>`,
    ),
};
document.addEventListener("click", (ev) => {
  const b = ev.target.closest("button,a");
  if (!b) return;
  const d = b.dataset;
  if (d.action && actions[d.action]) {
    if (d.action !== "menu") {
      closeMenu();
    }
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
  else if (d.share) {
    const url = new URL("explorar.html", location.href);
    url.searchParams.set("anuncio", d.share);
    copyText(url.href, "Enlace del anuncio copiado.");
  } else if (d.view) {
    viewMode = d.view;
    try {
      localStorage.setItem("doname-view", viewMode);
    } catch {}
    render();
  } else if (d.removeFilter) {
    filters[d.removeFilter] =
      d.removeFilter === "query"
        ? ""
        : d.removeFilter === "savedOnly"
          ? false
          : "all";
    if (d.removeFilter === "query") $("#search").value = "";
    if (d.removeFilter === "city") $("#city").value = "all";
    visible = 8;
    render();
  } else if (d.explore) {
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
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    show(
      "Copia este enlace",
      `<p class="modal-intro">Tu navegador no permitió copiar automáticamente. Puedes seleccionar este enlace.</p><div class="field"><label for="copy-link">Enlace</label><input id="copy-link" value="${e(text)}" readonly></div>`,
    );
    $("#copy-link").select();
  }
}
if (isExplore) {
  $("#city").insertAdjacentHTML("beforeend", options(cities));
  $("#city").value = filters.city;
  $("#search").value = filters.query;
  $("#sort").value = filters.sort;
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
}
render();
const initialPost = new URLSearchParams(location.search).get("anuncio");
if (initialPost) {
  if (find(initialPost)) detail(initialPost);
  else toast("Este anuncio no está disponible en este navegador.");
}
addEventListener("popstate", () => {
  if (!isExplore) return;
  Object.assign(filters, readBrowseParams(location.search));
  $("#city").value = filters.city;
  $("#search").value = filters.query;
  $("#sort").value = filters.sort;
  render();
  const id = new URLSearchParams(location.search).get("anuncio");
  if (id && find(id)) detail(id);
  else if ($("#modal").open) close();
});
addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $(".mobile-open")) {
    closeMenu();
    $('[data-action="menu"]').focus();
  }
});
// Reveal content as it enters the viewport. Informational content stays still afterwards.
const reveals = document.querySelectorAll(".scroll-reveal");
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
    },
    { threshold: 0.08 },
  );
  reveals.forEach((element) => {
    element.classList.add("will-reveal");
    observer.observe(element);
  });
  const topObserver = new IntersectionObserver((entries) => {
    $('[data-action="back-top"]').hidden = entries[0].isIntersecting;
  });
  const sentinel = document.querySelector(
    ".hero, .section-heading, .guide-hero",
  );
  if (sentinel) topObserver.observe(sentinel);
}

if (document.querySelector("#publication-form")) {
  try {
    const { initPublication } = await import('./publish.js?v=4');
    initPublication({state,persist,find,toast});
  } catch {
    $('#publish-error').textContent='No pudimos preparar el formulario. Recarga la página para volver a intentarlo.';
    $('#draft-status').textContent='Tu borrador sigue guardado en este navegador.';
  }
}
