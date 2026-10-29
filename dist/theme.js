// Apply the saved preference before first paint; no account is required.
(() => {
  const key = "doname-theme";
  const media = matchMedia("(prefers-color-scheme: dark)");
  let preference = "system";
  try {
    preference = localStorage.getItem(key) || "system";
  } catch {}
  if (!["system", "light", "dark"].includes(preference)) preference = "system";
  function apply() {
    const resolved =
      preference === "system" ? (media.matches ? "dark" : "light") : preference;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", resolved === "dark" ? "#111b16" : "#fcfdfb");
    const select = document.querySelector("#theme-preference");
    if (select) select.value = preference;
  }
  apply();
  media.addEventListener("change", () => {
    if (preference === "system") apply();
  });
  document.addEventListener("DOMContentLoaded", () => {
    apply();
    document
      .querySelector("#theme-preference")
      ?.addEventListener("change", (event) => {
        preference = event.target.value;
        try {
          localStorage.setItem(key, preference);
        } catch {}
        apply();
      });
  });
  addEventListener("storage", (event) => {
    if (event.key !== key) return;
    preference = ["light", "dark", "system"].includes(event.newValue)
      ? event.newValue
      : "system";
    apply();
  });
})();
