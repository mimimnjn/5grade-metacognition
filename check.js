// Run the page script against a tiny fake DOM to surface runtime errors and read the result text.
// usage: node runpage.js <index.html> <avg>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const avg = process.argv[3] || '1.200';
const data = html.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1];
const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1];
const els = {};
function el(id) {
  if (!els[id]) {
    const e = { id, innerHTML: '', textContent: id === 'data' ? data : '', value: id === 'avg' ? avg : '0', hidden: false,
      style: { setProperty() {} }, dataset: {}, offsetWidth: 600, scrollWidth: 600, clientWidth: 600,
      classList: { toggle() {}, add() {}, remove() {} }, setAttribute() {}, addEventListener() {}, appendChild() {}, scrollTo() {},
      querySelector() { return el(id + '>q' + Math.random()); }, querySelectorAll() { return []; } };
    els[id] = e;
  }
  return els[id];
}
global.document = { getElementById: el, querySelectorAll: () => [], createElement: () => el('x' + Math.random()) };
global.matchMedia = () => ({ matches: true });
global.performance = { now: () => 0 };
global.requestAnimationFrame = () => {};
global.setTimeout = (f) => f();
global.window = global;
eval(code);
const strip = (s) => String(s).replace(/<br>/g, ' / ').replace(/<[^>]+>/g, '');
console.log('pct', els['a-pct'].textContent, '|', strip(els['a-line'].innerHTML));
console.log('pin', els['lad-track'] ? els['lad-track'].style.transform : '-', els['lad-tag'] ? els['lad-tag'].textContent : '');
console.log('lines', strip(els['lines'].innerHTML).slice(0, 160));
