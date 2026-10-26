(() => {
  const savedTheme = localStorage.getItem("tellurion-theme");
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : systemPrefersLight
      ? "light"
      : "dark";

  document.documentElement.dataset.theme = theme;
})();
