export const MIN_KONTRAST = 4.5;

function svjetlina(hex) {
  const h = hex.replace("#", "").slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function omjerKontrasta(boja1, boja2) {
  const [svjetlija, tamnija] = [svjetlina(boja1), svjetlina(boja2)].sort((a, b) => b - a);
  return (svjetlija + 0.05) / (tamnija + 0.05);
}
