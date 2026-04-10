import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

const ROOT_DIR = process.cwd();
const WIDTH = 1600;
const HEIGHT = 900;
const catalogPath = join(ROOT_DIR, 'src', 'post-image-catalog.json');

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));

function rgba(hex, alpha) {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function line(points, color, width = 8, extra = '') {
  return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra} />`;
}

function panel(x, y, width, height, stroke, fill = 'rgba(255,255,255,0.08)') {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="28" fill="${fill}" stroke="${rgba(stroke, 0.45)}" stroke-width="2" />
  `;
}

function chartPanel(x, y, width, height, accent, soft) {
  return `
    ${panel(x, y, width, height, accent)}
    <g stroke="${rgba('#FFFFFF', 0.14)}" stroke-width="1">
      <line x1="${x + 24}" y1="${y + height / 4}" x2="${x + width - 24}" y2="${y + height / 4}" />
      <line x1="${x + 24}" y1="${y + height / 2}" x2="${x + width - 24}" y2="${y + height / 2}" />
      <line x1="${x + 24}" y1="${y + (height * 3) / 4}" x2="${x + width - 24}" y2="${y + (height * 3) / 4}" />
    </g>
    ${line(
      `${x + 42},${y + height - 82} ${x + 132},${y + height - 148} ${x + 250},${y + height - 120} ${x + 362},${y + height - 218} ${x + 470},${y + height - 178} ${x + width - 48},${y + 72}`,
      accent,
      7
    )}
    <g fill="${soft}">
      <circle cx="${x + 132}" cy="${y + height - 148}" r="7" />
      <circle cx="${x + 250}" cy="${y + height - 120}" r="7" />
      <circle cx="${x + 362}" cy="${y + height - 218}" r="7" />
      <circle cx="${x + 470}" cy="${y + height - 178}" r="7" />
      <circle cx="${x + width - 48}" cy="${y + 72}" r="7" />
    </g>
  `;
}

function candles(x, y, accent, soft) {
  const items = [
    { x: 0, top: -92, height: 120, wickTop: -134, wickBottom: 54, fill: accent },
    { x: 58, top: -36, height: 90, wickTop: -96, wickBottom: 92, fill: soft },
    { x: 122, top: -146, height: 144, wickTop: -202, wickBottom: 72, fill: accent },
    { x: 188, top: -74, height: 110, wickTop: -132, wickBottom: 96, fill: soft },
    { x: 254, top: -190, height: 178, wickTop: -242, wickBottom: 44, fill: accent }
  ];

  return `
    <g>
      ${items.map(item => `
        <line x1="${x + item.x + 18}" y1="${y + item.wickTop}" x2="${x + item.x + 18}" y2="${y + item.wickBottom}" stroke="${rgba('#FFFFFF', 0.74)}" stroke-width="4" stroke-linecap="round" />
        <rect x="${x + item.x}" y="${y + item.top}" width="36" height="${item.height}" rx="8" fill="${item.fill}" />
      `).join('')}
    </g>
  `;
}

function arrow(points, color) {
  const coords = points.trim().split(/\s+/);
  const [lastX, lastY] = coords.at(-1).split(',').map(Number);
  return `
    ${line(points, color, 8)}
    <polygon points="${lastX},${lastY} ${lastX - 28},${lastY - 18} ${lastX - 18},${lastY - 46}" fill="${color}" />
  `;
}

function shield(cx, cy, accent, soft, scale = 1) {
  const d = `
    M ${cx - 92 * scale} ${cy - 46 * scale}
    C ${cx - 92 * scale} ${cy - 132 * scale}, ${cx - 38 * scale} ${cy - 176 * scale}, ${cx} ${cy - 176 * scale}
    C ${cx + 38 * scale} ${cy - 176 * scale}, ${cx + 92 * scale} ${cy - 132 * scale}, ${cx + 92 * scale} ${cy - 46 * scale}
    L ${cx + 72 * scale} ${cy + 86 * scale}
    L ${cx} ${cy + 176 * scale}
    L ${cx - 72 * scale} ${cy + 86 * scale}
    Z
  `;
  return `
    <path d="${d}" fill="${rgba(accent, 0.88)}" stroke="${rgba('#FFFFFF', 0.7)}" stroke-width="${8 * scale}" />
    ${line(`${cx - 42 * scale},${cy + 12 * scale} ${cx - 8 * scale},${cy + 48 * scale} ${cx + 54 * scale},${cy - 28 * scale}`, soft, 16 * scale)}
  `;
}

function robot(cx, cy, accent, soft, scale = 1) {
  return `
    <g transform="translate(${cx}, ${cy}) scale(${scale})">
      <rect x="-108" y="-88" width="216" height="176" rx="30" fill="${rgba(accent, 0.88)}" stroke="${rgba('#FFFFFF', 0.74)}" stroke-width="6" />
      <circle cx="-36" cy="0" r="18" fill="${soft}" />
      <circle cx="36" cy="0" r="18" fill="${soft}" />
      <rect x="-42" y="44" width="84" height="12" rx="6" fill="${soft}" />
      <line x1="0" y1="-116" x2="0" y2="-152" stroke="${rgba('#FFFFFF', 0.78)}" stroke-width="6" stroke-linecap="round" />
      <circle cx="0" cy="-170" r="18" fill="${soft}" />
      <line x1="-132" y1="-22" x2="-186" y2="-54" stroke="${rgba(accent, 0.72)}" stroke-width="5" stroke-linecap="round" />
      <line x1="-132" y1="30" x2="-190" y2="64" stroke="${rgba(accent, 0.72)}" stroke-width="5" stroke-linecap="round" />
      <line x1="132" y1="-22" x2="186" y2="-54" stroke="${rgba(accent, 0.72)}" stroke-width="5" stroke-linecap="round" />
      <line x1="132" y1="30" x2="190" y2="64" stroke="${rgba(accent, 0.72)}" stroke-width="5" stroke-linecap="round" />
      <circle cx="-186" cy="-54" r="9" fill="${soft}" />
      <circle cx="-190" cy="64" r="9" fill="${soft}" />
      <circle cx="186" cy="-54" r="9" fill="${soft}" />
      <circle cx="190" cy="64" r="9" fill="${soft}" />
    </g>
  `;
}

function globe(cx, cy, radius, accent, soft) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${rgba(accent, 0.18)}" stroke="${rgba('#FFFFFF', 0.68)}" stroke-width="6" />
    <ellipse cx="${cx}" cy="${cy}" rx="${radius * 0.62}" ry="${radius}" fill="none" stroke="${soft}" stroke-width="4" opacity="0.9" />
    <ellipse cx="${cx}" cy="${cy}" rx="${radius * 0.26}" ry="${radius}" fill="none" stroke="${soft}" stroke-width="4" opacity="0.9" />
    <path d="M ${cx - radius} ${cy} Q ${cx} ${cy - radius * 0.54} ${cx + radius} ${cy}" fill="none" stroke="${soft}" stroke-width="4" opacity="0.9" />
    <path d="M ${cx - radius} ${cy + radius * 0.28} Q ${cx} ${cy + radius * 0.62} ${cx + radius} ${cy + radius * 0.28}" fill="none" stroke="${soft}" stroke-width="4" opacity="0.9" />
  `;
}

function documentCard(x, y, width, height, accent, soft) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="24" fill="${rgba('#F4F7FB', 0.92)}" stroke="${rgba(accent, 0.72)}" stroke-width="4" />
    <line x1="${x + 42}" y1="${y + 58}" x2="${x + width - 48}" y2="${y + 58}" stroke="${rgba(accent, 0.42)}" stroke-width="6" stroke-linecap="round" />
    <line x1="${x + 42}" y1="${y + 98}" x2="${x + width - 48}" y2="${y + 98}" stroke="${rgba(accent, 0.42)}" stroke-width="6" stroke-linecap="round" />
    <line x1="${x + 42}" y1="${y + 138}" x2="${x + width - 48}" y2="${y + 138}" stroke="${rgba(accent, 0.42)}" stroke-width="6" stroke-linecap="round" />
    <line x1="${x + 42}" y1="${y + 178}" x2="${x + width - 48}" y2="${y + 178}" stroke="${rgba(accent, 0.42)}" stroke-width="6" stroke-linecap="round" />
    <circle cx="${x + width - 72}" cy="${y + height - 74}" r="36" fill="${soft}" />
    <circle cx="${x + width - 72}" cy="${y + height - 74}" r="16" fill="${rgba('#FFFFFF', 0.68)}" />
  `;
}

function clipboard(x, y, accent, soft) {
  return `
    <rect x="${x}" y="${y}" width="260" height="320" rx="28" fill="${rgba('#F4F7FB', 0.9)}" stroke="${rgba('#FFFFFF', 0.72)}" stroke-width="4" />
    <rect x="${x + 72}" y="${y - 24}" width="116" height="58" rx="22" fill="${accent}" />
    ${[0, 1, 2, 3].map(index => `
      <line x1="${x + 36}" y1="${y + 86 + index * 54}" x2="${x + 56}" y2="${y + 102 + index * 54}" stroke="${accent}" stroke-width="5" stroke-linecap="round" />
      <line x1="${x + 56}" y1="${y + 102 + index * 54}" x2="${x + 78}" y2="${y + 68 + index * 54}" stroke="${accent}" stroke-width="5" stroke-linecap="round" />
      <line x1="${x + 90}" y1="${y + 84 + index * 54}" x2="${x + 214}" y2="${y + 84 + index * 54}" stroke="${rgba(accent, 0.58)}" stroke-width="5" stroke-linecap="round" />
    `).join('')}
  `;
}

function users(cx, cy, accent, soft) {
  return `
    <circle cx="${cx}" cy="${cy - 42}" r="46" fill="${accent}" />
    <circle cx="${cx - 102}" cy="${cy - 20}" r="36" fill="${soft}" />
    <circle cx="${cx + 102}" cy="${cy - 20}" r="36" fill="${soft}" />
    <rect x="${cx - 86}" y="${cy + 18}" width="172" height="94" rx="36" fill="${accent}" />
    <rect x="${cx - 168}" y="${cy + 34}" width="106" height="70" rx="30" fill="${soft}" />
    <rect x="${cx + 62}" y="${cy + 34}" width="106" height="70" rx="30" fill="${soft}" />
  `;
}

function target(cx, cy, accent, soft) {
  return `
    <circle cx="${cx}" cy="${cy}" r="92" fill="none" stroke="${soft}" stroke-width="16" />
    <circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="${accent}" stroke-width="12" />
    <circle cx="${cx}" cy="${cy}" r="24" fill="${accent}" />
    ${line(`${cx + 110},${cy - 120} ${cx + 30},${cy - 40}`, '#FFFFFF', 8)}
    <line x1="${cx + 30}" y1="${cy - 40}" x2="${cx + 56}" y2="${cy - 42}" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
    <line x1="${cx + 30}" y1="${cy - 40}" x2="${cx + 32}" y2="${cy - 14}" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
  `;
}

function wallet(x, y, accent, soft) {
  return `
    <rect x="${x}" y="${y}" width="300" height="220" rx="42" fill="${rgba(accent, 0.86)}" stroke="${rgba('#FFFFFF', 0.62)}" stroke-width="4" />
    <rect x="${x + 26}" y="${y + 48}" width="248" height="110" rx="28" fill="${soft}" />
    <circle cx="${x + 228}" cy="${y + 98}" r="14" fill="${rgba('#FFFFFF', 0.74)}" />
  `;
}

function gauge(cx, cy, radius, accent, soft) {
  return `
    <path d="M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}" fill="none" stroke="${rgba('#FFFFFF', 0.12)}" stroke-width="18" />
    <path d="M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius * 0.18} ${cy - radius * 0.92}" fill="none" stroke="${accent}" stroke-width="18" stroke-linecap="round" />
    <path d="M ${cx - (radius - 22)} ${cy} A ${radius - 22} ${radius - 22} 0 0 1 ${cx + (radius - 22) * 0.38} ${cy - (radius - 22) * 0.7}" fill="none" stroke="${soft}" stroke-width="10" stroke-linecap="round" />
  `;
}

function label(text, x, y, size, color) {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="700">${text}</text>`;
}

const motifs = {
  strategies: entry => `
    ${chartPanel(820, 164, 650, 360, entry.accent, entry.accentSoft)}
    ${candles(240, 604, entry.accent, entry.accentSoft)}
    ${arrow('210,688 356,616 492,652 614,518 770,430', entry.accentSoft)}
    ${panel(878, 574, 238, 164, entry.accentSoft)}
    ${panel(1144, 574, 284, 164, entry.accent)}
    ${label('01', 948, 642, 38, entry.accentSoft)}
    ${label('02', 1224, 642, 38, entry.accent)}
  `,
  broker: entry => `
    ${shield(1090, 356, entry.accent, entry.accentSoft, 1.1)}
    ${chartPanel(168, 506, 584, 246, entry.accent, entry.accentSoft)}
    ${panel(820, 562, 270, 170, entry.accentSoft)}
    <rect x="888" y="610" width="36" height="78" rx="12" fill="${entry.accentSoft}" />
    <rect x="952" y="576" width="36" height="112" rx="12" fill="${entry.accentSoft}" />
    <rect x="1016" y="540" width="36" height="148" rx="12" fill="${entry.accentSoft}" />
  `,
  analysis: entry => `
    ${chartPanel(772, 162, 702, 398, entry.accent, entry.accentSoft)}
    <circle cx="386" cy="394" r="92" fill="none" stroke="${entry.accentSoft}" stroke-width="14" />
    <line x1="452" y1="458" x2="544" y2="548" stroke="${entry.accentSoft}" stroke-width="14" stroke-linecap="round" />
    ${arrow('842,482 980,394 1096,430 1256,280 1406,238', entry.accentSoft)}
  `,
  risk: entry => `
    ${shield(380, 332, entry.accent, entry.accentSoft, 1.05)}
    ${chartPanel(836, 186, 598, 314, entry.accent, entry.accentSoft)}
    <path d="M 1048 552 A 110 110 0 0 1 1158 662 L 1048 662 Z" fill="${entry.accentSoft}" />
    <path d="M 1048 552 A 110 110 0 0 1 1146 592 L 1048 662 Z" fill="${entry.accent}" opacity="0.68" />
    <line x1="1228" y1="662" x2="1432" y2="662" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" />
    <line x1="1330" y1="580" x2="1330" y2="744" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" />
  `,
  crypto: entry => `
    ${chartPanel(840, 188, 598, 298, entry.accent, entry.accentSoft)}
    <circle cx="388" cy="366" r="152" fill="${rgba(entry.accent, 0.18)}" stroke="${entry.accent}" stroke-width="12" />
    ${line('292,262 394,366 504,262', '#FFFFFF', 6)}
    ${line('394,366 312,466 484,466', '#FFFFFF', 6)}
    <circle cx="292" cy="262" r="11" fill="#FFFFFF" opacity="0.78" />
    <circle cx="504" cy="262" r="11" fill="#FFFFFF" opacity="0.78" />
    <circle cx="394" cy="366" r="11" fill="#FFFFFF" opacity="0.78" />
    <circle cx="312" cy="466" r="11" fill="#FFFFFF" opacity="0.78" />
    <circle cx="484" cy="466" r="11" fill="#FFFFFF" opacity="0.78" />
  `,
  forex: entry => `
    ${globe(404, 346, 166, entry.accent, entry.accentSoft)}
    ${chartPanel(846, 190, 590, 322, entry.accent, entry.accentSoft)}
    ${arrow('222,572 374,518 522,546 686,454', entry.accentSoft)}
    ${arrow('686,670 560,622 402,644 246,598', entry.accent)}
  `,
  bot: entry => `
    ${robot(382, 338, entry.accent, entry.accentSoft, 1.02)}
    ${chartPanel(836, 182, 606, 306, entry.accent, entry.accentSoft)}
    ${panel(850, 544, 266, 176, entry.accentSoft)}
    ${panel(1140, 544, 292, 176, entry.accent)}
    ${label('AUTO', 914, 620, 28, entry.accentSoft)}
    ${label('SYNC', 1212, 620, 28, entry.accent)}
  `,
  psychology: entry => `
    ${chartPanel(842, 182, 592, 304, entry.accent, entry.accentSoft)}
    <circle cx="402" cy="360" r="164" fill="none" stroke="${entry.accent}" stroke-width="12" />
    <circle cx="402" cy="360" r="96" fill="none" stroke="${entry.accentSoft}" stroke-width="6" />
    ${line('210,640 344,640 392,572 432,694 474,612 620,612', '#FFFFFF', 10)}
  `,
  indicators: entry => `
    ${chartPanel(858, 170, 570, 240, entry.accent, entry.accentSoft)}
    ${panel(858, 448, 570, 120, entry.accentSoft)}
    ${panel(858, 594, 570, 120, entry.accent)}
    ${line('230,590 316,544 404,602 498,506 592,562 694,470', entry.accentSoft, 8)}
    <path d="M 208 348 A 170 170 0 0 1 548 348" fill="none" stroke="${entry.accent}" stroke-width="12" />
    <path d="M 436 348 A 170 170 0 0 1 776 348" fill="none" stroke="${entry.accent}" stroke-width="12" opacity="0.72" />
  `,
  candles: entry => `
    ${candles(320, 628, entry.accent, entry.accentSoft)}
    ${chartPanel(846, 188, 584, 292, entry.accent, entry.accentSoft)}
    <circle cx="294" cy="292" r="55" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.72" />
    <circle cx="578" cy="222" r="66" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.72" />
    <circle cx="698" cy="372" r="47" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.72" />
  `,
  brokerage: entry => `
    ${chartPanel(856, 198, 582, 290, entry.accent, entry.accentSoft)}
    <rect x="250" y="274" width="150" height="354" rx="26" fill="${entry.accent}" />
    <rect x="430" y="208" width="188" height="420" rx="28" fill="${entry.accent}" />
    <rect x="648" y="338" width="102" height="290" rx="24" fill="${entry.accentSoft}" />
    ${arrow('228,724 404,642 542,664 740,560', entry.accentSoft)}
  `,
  'bot-benefits': entry => `
    ${robot(356, 344, entry.accent, entry.accentSoft, 0.92)}
    ${chartPanel(840, 174, 600, 270, entry.accent, entry.accentSoft)}
    ${panel(828, 486, 204, 178, entry.accentSoft)}
    ${panel(1052, 486, 180, 178, entry.accent)}
    ${panel(1254, 486, 176, 178, entry.accentSoft)}
    ${label('24/7', 876, 590, 28, entry.accentSoft)}
    ${label('+ROI', 1082, 590, 28, entry.accent)}
    ${label('FAST', 1282, 590, 28, entry.accentSoft)}
  `,
  trends: entry => `
    ${chartPanel(804, 160, 644, 314, entry.accent, entry.accentSoft)}
    ${panel(200, 518, 182, 180, entry.accent)}
    ${panel(410, 470, 182, 228, entry.accent)}
    ${panel(620, 554, 182, 144, entry.accent)}
    ${label('01', 258, 622, 32, entry.accentSoft)}
    ${label('02', 468, 574, 32, entry.accentSoft)}
    ${label('03', 678, 658, 32, entry.accentSoft)}
  `,
  crm: entry => `
    ${users(382, 346, entry.accent, entry.accentSoft)}
    ${line('538,384 768,384 928,258', entry.accentSoft, 8)}
    ${line('768,384 928,510', entry.accentSoft, 8)}
    ${panel(920, 170, 462, 192, entry.accent)}
    ${panel(920, 410, 462, 192, entry.accentSoft)}
  `,
  platform: entry => `
    ${panel(212, 186, 394, 286, entry.accent)}
    ${panel(336, 282, 394, 286, entry.accentSoft)}
    ${chartPanel(826, 176, 612, 330, entry.accent, entry.accentSoft)}
    ${shield(1192, 596, entry.accent, entry.accentSoft, 0.58)}
  `,
  algo: entry => `
    ${robot(368, 372, entry.accent, entry.accentSoft, 0.84)}
    ${label('&lt;/&gt;', 188, 238, 66, entry.accentSoft)}
    ${chartPanel(852, 184, 584, 332, entry.accent, entry.accentSoft)}
    ${arrow('196,670 342,614 474,636 644,530 776,436', entry.accentSoft)}
  `,
  legal: entry => `
    ${documentCard(252, 214, 332, 420, entry.accent, entry.accentSoft)}
    ${shield(1124, 368, entry.accent, entry.accentSoft, 0.96)}
    ${panel(860, 578, 430, 140, entry.accentSoft)}
    ${label('REG', 972, 642, 30, entry.accentSoft)}
  `,
  'book-risk': entry => `
    ${chartPanel(810, 164, 640, 266, entry.accent, entry.accentSoft)}
    ${panel(218, 256, 250, 282, entry.accent)}
    ${panel(520, 256, 250, 282, entry.accentSoft)}
    ${label('A', 312, 408, 66, entry.accent)}
    ${label('B', 616, 408, 66, entry.accentSoft)}
    ${shield(1100, 612, entry.accentSoft, entry.accent, 0.54)}
  `,
  marketing: entry => `
    ${target(1184, 306, entry.accent, entry.accentSoft)}
    <polygon points="270,360 470,282 470,448 270,370" fill="${entry.accent}" />
    <rect x="218" y="354" width="78" height="142" rx="20" fill="${entry.accentSoft}" />
    ${users(600, 612, entry.accentSoft, entry.accent)}
  `,
  'crypto-brokerage': entry => `
    ${chartPanel(836, 180, 610, 288, entry.accent, entry.accentSoft)}
    ${shield(1168, 606, entry.accent, entry.accentSoft, 0.54)}
    <circle cx="328" cy="328" r="72" fill="none" stroke="${entry.accentSoft}" stroke-width="10" />
    <circle cx="480" cy="442" r="88" fill="none" stroke="${entry.accentSoft}" stroke-width="10" />
    <circle cx="276" cy="526" r="62" fill="none" stroke="${entry.accentSoft}" stroke-width="10" />
  `,
  fundamentals: entry => `
    ${documentCard(216, 214, 292, 386, entry.accent, entry.accentSoft)}
    ${chartPanel(822, 182, 624, 318, entry.accent, entry.accentSoft)}
    ${globe(540, 548, 92, entry.accentSoft, entry.accent)}
  `,
  comparison: entry => `
    ${panel(218, 248, 196, 340, entry.accent)}
    ${panel(476, 214, 196, 374, entry.accentSoft)}
    ${panel(734, 292, 196, 296, entry.accent)}
    ${label('FX', 280, 320, 32, entry.accentSoft)}
    ${label('EQ', 540, 286, 32, entry.accentSoft)}
    ${label('CR', 796, 364, 32, entry.accentSoft)}
    ${chartPanel(1012, 174, 410, 350, entry.accent, entry.accentSoft)}
    ${arrow('246,692 438,644 628,662 816,598', entry.accentSoft)}
  `,
  capital: entry => `
    ${wallet(214, 394, entry.accent, entry.accentSoft)}
    ${gauge(1184, 362, 170, entry.accent, entry.accentSoft)}
    ${chartPanel(812, 534, 586, 180, entry.accent, entry.accentSoft)}
    ${label('1-2%', 1092, 360, 44, entry.accentSoft)}
  `,
  checklist: entry => `
    ${clipboard(236, 228, entry.accent, entry.accentSoft)}
    ${shield(1086, 332, entry.accent, entry.accentSoft, 0.9)}
    ${chartPanel(842, 562, 552, 152, entry.accent, entry.accentSoft)}
  `,
  copy: entry => `
    ${users(336, 344, entry.accent, entry.accentSoft)}
    ${users(680, 344, entry.accentSoft, entry.accent)}
    ${arrow('470,238 530,208 590,238', entry.accent)}
    ${arrow('590,498 530,528 470,498', entry.accentSoft)}
    ${chartPanel(906, 182, 520, 340, entry.accent, entry.accentSoft)}
  `
};

function renderCover(entry) {
  const motif = motifs[entry.motif] || motifs.strategies;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${entry.backgroundStart}" />
      <stop offset="100%" stop-color="${entry.backgroundEnd}" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <circle cx="1290" cy="150" r="310" fill="${rgba(entry.accent, 0.18)}" />
  <circle cx="130" cy="770" r="220" fill="${rgba(entry.accentSoft, 0.12)}" />
  <path d="M -120 150 L 240 30 L 1180 900 L 820 900 Z" fill="rgba(255,255,255,0.04)" />
  <g stroke="${rgba(entry.accent, 0.1)}" stroke-width="1">
    ${Array.from({ length: 18 }, (_, index) => `<line x1="${index * 88}" y1="0" x2="${index * 88}" y2="${HEIGHT}" />`).join('')}
    ${Array.from({ length: 12 }, (_, index) => `<line x1="0" y1="${index * 88}" x2="${WIDTH}" y2="${index * 88}" />`).join('')}
  </g>
  <rect x="88" y="84" width="360" height="58" rx="28" fill="rgba(255,255,255,0.08)" />
  <rect x="88" y="162" width="284" height="26" rx="13" fill="rgba(255,255,255,0.08)" />
  <rect x="88" y="204" width="232" height="18" rx="9" fill="rgba(255,255,255,0.08)" />
  ${motif(entry)}
</svg>`;
}

for (const entry of catalog) {
  const assetRelativePath = entry.asset.replace(/^\/+/, '');
  const outputPath = join(ROOT_DIR, 'public', assetRelativePath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderCover(entry), 'utf8');
  console.log(`Generated ${outputPath}`);
}
