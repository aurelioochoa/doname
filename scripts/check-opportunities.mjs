import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { seed, types, cities, normalize, whatsappUrl } from "../dist/core.js";
const counts = Object.fromEntries(
  Object.keys(types).map((key) => [
    key,
    seed.filter((x) => x.type === key).length,
  ]),
);
assert.ok(
  seed.length >= 36,
  "El catálogo debe ofrecer al menos 36 oportunidades de ejemplo.",
);
for (const [type, count] of Object.entries(counts))
  assert.ok(count >= 8, `Faltan ejemplos para ${type}: ${count}`);
assert.equal(
  new Set(seed.map((x) => x.id)).size,
  seed.length,
  "Identificadores repetidos",
);
assert.equal(
  new Set(seed.map((x) => normalize(x.title))).size,
  seed.length,
  "Títulos repetidos",
);
assert.ok(
  new Set(seed.map((x) => x.city)).size >= 8,
  "Faltan ciudades diversas",
);
assert.ok(
  new Set(seed.map((x) => x.category)).size >= 8,
  "Faltan categorías diversas",
);
const icons = fs.readFileSync("dist/assets/icons/style.css", "utf8");
for (const x of seed) {
  assert.ok(types[x.type], x.id);
  assert.ok(cities.includes(x.city), x.id);
  assert.equal(x.demo, true, x.id);
  assert.equal(whatsappUrl(x), null, x.id);
  assert.ok(x.title.length >= 8 && x.title.length <= 90, x.id + " título");
  assert.ok(x.description.length >= 25, x.id + " descripción");
  assert.ok(
    x.person && x.initials && x.category && x.condition,
    x.id + " detalles",
  );
  if (x.image)
    assert.ok(
      fs.statSync(path.join("dist", x.image)).isFile(),
      x.id + " imagen",
    );
  else
    assert.ok(
      icons.includes(".ph-" + x.illustration + ":"),
      x.id + " icono " + x.illustration,
    );
}
console.log(
  "OPPORTUNITIES_VERIFIED: " +
    seed.length +
    " ejemplos; " +
    JSON.stringify(counts),
);
