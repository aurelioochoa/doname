import {
  cities,
  types,
  validateListing,
  normalizePhone,
  escapeHtml as e,
} from "./core.js?v=3";

export function initPublication({ state, persist, find, toast }) {
  const $ = (s) => document.querySelector(s);
  const icon = (name) => `<i class="ph ph-${e(name)}" aria-hidden="true"></i>`;
  const form = $("#publication-form");
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
  const editId = new URLSearchParams(location.search).get("editar");
  const existing = editId ? find(editId) : null;
  const editing =
    existing && !existing.demo && state.posts.some((x) => x.id === editId);
  let draft = null;
  if (!editing) {
    try {
      draft = JSON.parse(localStorage.getItem("doname-draft") || "null");
    } catch {}
  }
  const selectedType = new URLSearchParams(location.search).get("tipo");
  let step = 1,
    image = editing ? existing.image || "" : "",
    imageRemoved = false,
    busy = false,
    photoSequence = 0;
  const defaults = {
    type: Object.hasOwn(types, selectedType) ? selectedType : "object",
    title: "",
    description: "",
    category: "Comunidad",
    condition: "",
    city: "",
    mode: "Presencial",
    person: "",
    phone: "",
    consent: false,
  };
  const initial = {
    ...defaults,
    ...(draft || {}),
    ...(editing ? existing : {}),
  };
  const options = (values) =>
    values.map((x) => `<option value="${e(x)}">${e(x)}</option>`).join("");
  $("#pub-city").insertAdjacentHTML("beforeend", options(cities));
  $("#pub-category").innerHTML = options(categories);
  function fill(values) {
    for (const key of [
      "title",
      "description",
      "category",
      "condition",
      "city",
      "mode",
      "person",
      "phone",
    ])
      form.elements[key].value = values[key] || "";
    form.elements.type.value = Object.hasOwn(types, values.type)
      ? values.type
      : "object";
    form.elements.consent.checked = Boolean(values.consent);
  }
  fill(initial);
  $("#draft-banner").hidden = !draft || Boolean(editing);
  if (editing) {
    $(".publication-heading h1").textContent =
      "Dale una nueva mirada a tu anuncio.";
    $(".publication-heading>p").textContent =
      "Actualiza los detalles y revisa cómo lo verá la comunidad.";
  }
  if (editId && !editing)
    toast(
      "Esta publicación no está disponible para editar. Puedes crear una nueva.",
    );
  function data() {
    return {
      ...Object.fromEntries(new FormData(form)),
      consent: form.elements.consent.checked,
    };
  }
  function setStep(next, focus = true) {
    step = Math.max(1, Math.min(3, next));
    document
      .querySelectorAll("[data-step]")
      .forEach((x) => (x.hidden = Number(x.dataset.step) !== step));
    document.querySelectorAll("[data-step-indicator]").forEach((x) => {
      const n = Number(x.dataset.stepIndicator);
      x.classList.toggle("done", n < step);
      if (n === step) x.setAttribute("aria-current", "step");
      else x.removeAttribute("aria-current");
    });
    $("#publish-back").hidden = step === 1;
    $("#step-status").textContent = `Paso ${step} de 3`;
    $("#publish-next").innerHTML =
      (step === 3
        ? editing
          ? "Guardar cambios"
          : "Publicar mi gesto"
        : "Continuar") + icon(step === 3 ? "arrow-up-right" : "arrow-right");
    if (focus) {
      const target =
        step === 1
          ? form.querySelector("[name=type]:checked")
          : document.querySelector(
              `[data-step="${step}"] input:not([type=file]),[data-step="${step}"] select`,
            );
      target?.focus({ preventScroll: true });
      $(".publication-workspace").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    }
  }
  function updatePreview() {
    const values = data();
    const type = types[values.type] || types.object;
    const placeholders = {
      object: "Por ejemplo: dono una silla de ruedas",
      service: "Por ejemplo: comparto tres clases de matemáticas",
      need: "Por ejemplo: busco libros para una biblioteca",
      volunteer: "Por ejemplo: voluntarios para pasear perros rescatados",
    };
    $("#pub-title").placeholder = placeholders[values.type];
    $("#details-intro").textContent =
      values.type === "need"
        ? "Cuenta qué necesitas y qué detalles pueden ayudar a alguien a darte una mano."
        : values.type === "volunteer"
          ? "Explica la causa, las actividades, el tiempo y cómo acompañarán a quienes se sumen."
          : "Una buena descripción ayuda a encontrar a la persona indicada.";
    $("#condition-label").textContent =
      values.type === "object"
        ? "Estado del objeto"
        : "Disponibilidad o duración";
    $("#pub-condition").placeholder =
      values.type === "object"
        ? "Por ejemplo: en buen estado"
        : "Por ejemplo: sábados, 2 horas, 3 clases";
    $("#title-count").textContent = `${values.title.length}/90`;
    $("#description-count").textContent = `${values.description.length}/1500`;
    $("#preview-type").textContent = type.label;
    $("#preview-type").className = "type-label " + values.type;
    $("#preview-title").textContent =
      values.title.trim() || "Tu próximo gesto empieza aquí";
    $("#preview-description").textContent =
      values.description.trim() || "Así verán tu anuncio cuando lo publiques.";
    $("#preview-city").textContent = values.city || "Tu ciudad";
    $("#preview-mode").textContent = values.mode || "Presencial";
    $("#preview-person").textContent = values.person.trim() || "Tu nombre";
    $("#preview-initials").textContent = values.person.trim()
      ? values.person
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((x) => x[0])
          .join("")
          .toUpperCase()
      : "TÚ";
    const validImage =
      /^(assets\/[a-z0-9.-]+|data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+)$/.test(
        image,
      );
    $("#preview-photo").innerHTML = validImage
      ? `<img src="${e(image)}" alt="Foto que elegiste para tu anuncio">`
      : `<div class="item-illustration ${e(values.type)}" role="img" aria-label="Ilustración de ${e(type.label.toLowerCase())}">${icon(editing && !imageRemoved && existing.illustration ? existing.illustration : type.icon)}</div>`;
    $("#upload-thumbnail").hidden = !validImage;
    $("#remove-publish-photo").hidden = !validImage;
    if (validImage) $("#upload-thumbnail").src = image;
    else $("#upload-thumbnail").removeAttribute("src");
  }
  function saveDraft() {
    if (editing) return;
    const values = data();
    const keys = [
      "type",
      "title",
      "description",
      "city",
      "mode",
      "category",
      "condition",
      "person",
    ];
    try {
      localStorage.setItem(
        "doname-draft",
        JSON.stringify(
          Object.fromEntries(keys.map((key) => [key, values[key] || ""])),
        ),
      );
      $("#draft-status").textContent =
        "Borrador guardado. Tu teléfono y tu foto no se guardan en él.";
    } catch {
      $("#draft-status").textContent =
        "Tu navegador no pudo guardar el borrador. Mantén esta página abierta.";
    }
  }
  function clearErrors() {
    form
      .querySelectorAll(".field.invalid")
      .forEach((x) => x.classList.remove("invalid"));
    form
      .querySelectorAll("[aria-invalid=true]")
      .forEach((x) => x.removeAttribute("aria-invalid"));
    form.querySelectorAll(".field .error").forEach((x) => (x.textContent = ""));
    $("#publish-error").textContent = "";
  }
  function validate(keys) {
    clearErrors();
    const errors = validateListing(data());
    const relevant = Object.entries(errors).filter(([key]) =>
      keys.includes(key),
    );
    if (!relevant.length) return true;
    for (const [key, message] of relevant) {
      const group = form.querySelector(`[data-field="${key}"]`);
      if (group) {
        group.classList.add("invalid");
        group.querySelector(".error").textContent = message;
        group
          .querySelector("input,textarea,select")
          .setAttribute("aria-invalid", "true");
      }
    }
    form.querySelector("[aria-invalid=true]")?.focus();
    return false;
  }
  form.addEventListener("input", () => {
    updatePreview();
    saveDraft();
  });
  form.addEventListener("change", () => {
    updatePreview();
    saveDraft();
  });
  $("#publish-back").addEventListener("click", () => setStep(step - 1));
  $("#discard-draft").addEventListener("click", () => {
    photoSequence++;
    busy = false;
    $("#publish-next").disabled = false;
    try {
      localStorage.removeItem("doname-draft");
    } catch {}
    fill(defaults);
    image = "";
    imageRemoved = true;
    $("#pub-photo").value = "";
    $("#draft-banner").hidden = true;
    clearErrors();
    updatePreview();
    setStep(1);
    $("#draft-status").textContent =
      "El texto se guarda como borrador en este navegador.";
  });
  $("#remove-publish-photo").addEventListener("click", () => {
    photoSequence++;
    busy = false;
    $("#publish-next").disabled = false;
    image = "";
    imageRemoved = true;
    $("#pub-photo").value = "";
    $("#upload-title").textContent = "Dale una cara a tu anuncio";
    $("#upload-copy").textContent = "JPG, PNG o WebP de hasta 5 MB.";
    $("#photo-error").textContent = "";
    updatePreview();
  });
  $("#pub-photo").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const sequence = ++photoSequence;
    $("#photo-error").textContent = "";
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      busy = false;
      $("#publish-next").disabled = false;
      $("#photo-error").textContent =
        "Elige una foto JPG, PNG o WebP de hasta 5 MB.";
      event.target.value = "";
      return;
    }
    busy = true;
    $("#publish-next").disabled = true;
    $("#upload-title").textContent = "Preparando tu foto…";
    try {
      const raw = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const photo = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = raw;
      });
      if (sequence !== photoSequence) return;
      const factor = Math.min(1, 1200 / photo.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(photo.width * factor);
      canvas.height = Math.round(photo.height * factor);
      canvas
        .getContext("2d")
        .drawImage(photo, 0, 0, canvas.width, canvas.height);
      image = canvas.toDataURL("image/jpeg", 0.8);
      imageRemoved = false;
      $("#upload-title").textContent = "Tu foto está lista";
      $("#upload-copy").textContent = file.name;
      updatePreview();
    } catch {
      if (sequence === photoSequence)
        $("#photo-error").textContent =
          "No pudimos leer esa foto. Prueba otra imagen.";
    } finally {
      if (sequence === photoSequence) {
        busy = false;
        $("#publish-next").disabled = false;
      }
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (busy) return;
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      if (validate(["title", "description"])) setStep(3);
      return;
    }
    const errors = validateListing(data());
    if (errors.title || errors.description) {
      setStep(2);
      validate(["title", "description"]);
      return;
    }
    if (!validate(["city", "person", "phone"])) return;
    const values = data();
    const item = {
      id: editing ? existing.id : crypto.randomUUID(),
      type: values.type,
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      condition: values.condition.trim() || "Sin costo",
      city: values.city,
      mode: values.mode,
      person: values.person.trim(),
      initials: values.person
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((x) => x[0])
        .join("")
        .toUpperCase(),
      phone: values.consent ? normalizePhone(values.phone) : "",
      consent: values.consent,
      image: image || "",
      illustration: image ? "" : types[values.type].icon,
      imageAlt: image ? "Foto de " + values.title.trim() : "",
      date: editing ? existing.date : Date.now(),
      demo: false,
      fulfilled: editing ? existing.fulfilled : false,
      archived: editing ? existing.archived : false,
    };
    const before = [...state.posts];
    if (editing)
      state.posts = state.posts.map((x) => (x.id === item.id ? item : x));
    else state.posts.unshift(item);
    if (!persist()) {
      state.posts = before;
      $("#publish-error").textContent =
        "No hay espacio suficiente para guardar tu anuncio. Prueba una foto más pequeña.";
      return;
    }
    if (!editing) {
      try {
        localStorage.removeItem("doname-draft");
      } catch {}
    }
    $("#draft-banner").hidden = true;
    $(".publication-heading").hidden = true;
    $("#publication-layout").innerHTML =
      `<section class="publication-success"><div class="success-icon">${icon("hand-heart")}</div><span class="section-kicker">UN NUEVO GESTO PARA COMPARTIR</span><h1>${editing ? "Tu anuncio está actualizado." : "Gracias por dar el primer paso."}</h1><p>«${e(item.title)}» ya tiene un lugar en esta maqueta. Puedes verlo, editarlo o archivarlo desde Mi actividad.</p><div class="success-publication-meta"><span>${icon("map-pin")}${e(item.city)}</span><span>${icon(types[item.type].icon)}${e(types[item.type].label)}</span><span>${icon("gift")}Gratis</span></div><div class="success-publication-actions"><a class="button primary" href="explorar.html?anuncio=${encodeURIComponent(item.id)}">Ver mi publicación ${icon("arrow-up-right")}</a><a class="button outline" href="publicar.html">Compartir otro gesto ${icon("plus")}</a></div><p class="local-note">Se guarda solo en este navegador. No se ha enviado ningún mensaje.</p></section>`;
    $(".publication-success h1").setAttribute("tabindex", "-1");
    $(".publication-success h1").focus({ preventScroll: true });
    $(".publication-main").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  });
  updatePreview();
  setStep(1, false);
}
