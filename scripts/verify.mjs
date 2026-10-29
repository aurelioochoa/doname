import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  seed,
  filterItems,
  normalizePhone,
  whatsappUrl,
  validateListing,
  escapeHtml,
  loadState,
  saveState,
} from "../dist/core.js";
for (const file of ["dist/app.js", "dist/core.js", "scripts/serve.mjs"]) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
}
assert.equal(new Set(seed.map((x) => x.id)).size, seed.length);
for (const type of ["object", "service", "need", "volunteer"]) {
  const items = filterItems(seed, { type });
  assert.ok(items.length >= 2);
  assert.ok(items.every((x) => x.type === type));
}
assert.deepEqual(
  filterItems(seed, {
    type: "service",
    city: "Cuenca",
    query: "MATEMATICAS",
  }).map((x) => x.id),
  ["maths"],
);
assert.equal(filterItems(seed, { query: "no-existe-este-termino" }).length, 0);
assert.ok(
  filterItems(seed, { mode: "En línea" }).every((x) => x.mode === "En línea"),
);
assert.ok(
  filterItems(seed, { category: "Personas mayores" }).every(
    (x) => x.category === "Personas mayores",
  ),
);
assert.deepEqual(
  filterItems(seed, { savedOnly: true, saved: ["dogs"] }).map((x) => x.id),
  ["dogs"],
);
assert.equal(
  filterItems(seed, { sort: "oldest" })[0].date,
  Math.min(...seed.map((x) => x.date)),
);
assert.equal(normalizePhone("099 123 4567"), "593991234567");
assert.equal(normalizePhone("+593 99 123 4567"), "593991234567");
for (const invalid of [
  "123",
  "099123456789",
  "+5930991234567",
  "tel:0991234567",
  "",
])
  assert.equal(normalizePhone(invalid), null);
const item = {
  type: "object",
  title: "Donación de prueba",
  description: "Descripción suficientemente larga para una donación de prueba.",
  person: "Persona de prueba",
  city: "Quito",
  phone: "0991234567",
  consent: true,
};
assert.deepEqual(validateListing(item), {});
assert.ok(validateListing({ ...item, title: "corto" }).title);
assert.ok(validateListing({ ...item, description: "" }).description);
assert.ok(validateListing({ ...item, phone: "123" }).phone);
assert.ok(validateListing({ ...item, phone: "" }).phone);
assert.ok(whatsappUrl(item).startsWith("https://wa.me/593991234567?text="));
assert.equal(whatsappUrl({ ...item, consent: false }), null);
assert.equal(whatsappUrl({ ...item, demo: true }), null);
assert.equal(whatsappUrl({ ...item, phone: "123" }), null);
assert.equal(escapeHtml("<script>\"&'"), "&lt;script&gt;&quot;&amp;&#39;");
const data = new Map();
const storage = {
  getItem: (k) => data.get(k),
  setItem: (k, v) => data.set(k, v),
};
const fresh = loadState(storage);
assert.deepEqual(fresh, { posts: [], saved: [], interests: [], hours: [] });
fresh.posts.push(item);
fresh.saved.push("dogs");
fresh.interests.push("maths");
fresh.hours.push({ name: "Persona", hours: 2 });
assert.equal(saveState(storage, fresh), true);
assert.deepEqual(loadState(storage), fresh);
storage.setItem("doname-v1", "malformed");
assert.deepEqual(loadState(storage), {
  posts: [],
  saved: [],
  interests: [],
  hours: [],
});
assert.equal(
  saveState(
    {
      setItem() {
        throw new Error("quota");
      },
    },
    fresh,
  ),
  false,
);
const html = fs.readFileSync("dist/index.html", "utf8");
const css = fs.readFileSync("dist/styles.css", "utf8");
for (const x of seed) {
  assert.ok(fs.existsSync(path.join("dist", x.image)), x.image);
  assert.equal(x.demo, true);
  assert.equal(whatsappUrl(x), null);
}
for (const match of html.matchAll(/(?:src|href)="((?:assets\/)[^"]+)"/g))
  assert.ok(fs.existsSync(path.join("dist", match[1])), match[1]);
for (const match of css.matchAll(/url\(['"]?(assets\/[^'"\)]+)['"]?\)/g))
  assert.ok(fs.existsSync(path.join("dist", match[1])), match[1]);
assert.ok(html.includes('lang="es-EC"'));
assert.ok(
  html.includes("prefers-reduced-motion") ||
    css.includes("prefers-reduced-motion"),
);
assert.ok(html.includes('aria-live="polite"'));
const icons = fs.readFileSync("dist/assets/icons/style.css", "utf8");
for (const i of [...html.matchAll(/ph ph-([a-z-]+)/g)].map((x) => x[1]))
  assert.ok(icons.includes(".ph-" + i + ":"), i);
assert.ok(html.includes("maqueta funcional"));
const imageBytes = fs.statSync("dist/assets/community.webp").size;
assert.ok(imageBytes < 500000, "Hero image exceeds 500 KB");
console.log(
  "DONAME_VERIFIED: syntax, filters, validation, WhatsApp consent, local persistence, assets and accessibility hooks.",
);
