"use strict";
// Lecteur local de la Formation IA : navigation par niveau / module, leçons Markdown, quiz et examens corrigés.
// Progression enregistrée dans le navigateur (localStorage), rien n'est envoyé ailleurs.

const STORE = "formation-ia-progress-v1";
const state = { items: [], byKey: new Map(), catalogue: null, progress: JSON.parse(localStorage.getItem(STORE) || "{}") };
const saveProgress = () => localStorage.setItem(STORE, JSON.stringify(state.progress));
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ---------------- Markdown (sous-ensemble GFM suffisant pour les leçons) ---------------- */
function inline(src) {
  const codes = [];
  let s = src.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = esc(s);
  s = s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>")
    .replace(/(^|[^\w])_([^_\s][^_]*?)_(?!\w)/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}

function markdown(src) {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const isTableSep = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
  const cells = (l) => l.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
  const listRe = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^\s*(```|~~~)\s*([\w+-]*)/);
    if (fence) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push("<hr>"); i++; continue; }
    if (line.includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(cells(lines[i++]));
      out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    if (/^\s*>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ""));
      out.push(`<blockquote>${markdown(buf.join("\n"))}</blockquote>`);
      continue;
    }
    if (listRe.test(line)) {
      // Liste (imbrication par indentation).
      const buf = [];
      while (i < lines.length && (listRe.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && buf.length))) buf.push(lines[i++]);
      out.push(renderList(buf));
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\s*```|\s*~~~|\s*>)/.test(lines[i]) && !listRe.test(lines[i]) && !(lines[i].includes("|") && isTableSep(lines[i + 1] || ""))) buf.push(lines[i++]);
    out.push(`<p>${buf.map(inline).join("<br>")}</p>`);
  }
  return out.join("\n");

  function renderList(block) {
    const items = [];
    const base = block[0].match(/^(\s*)/)[1].length;
    for (const l of block) {
      const m = l.match(listRe);
      if (m && m[1].length <= base + 1) items.push({ ordered: /\d/.test(m[2]), text: m[3], sub: [] });
      else if (items.length) items[items.length - 1].sub.push(l);
    }
    const tag = items[0]?.ordered ? "ol" : "ul";
    return `<${tag}>${items.map((it) => {
      const task = it.text.match(/^\[( |x|X)\]\s+(.*)$/);
      const text = task ? `${task[1].trim() ? "☑" : "☐"} ${inline(task[2])}` : inline(it.text);
      return `<li>${text}${it.sub.length ? markdown(it.sub.map((s) => s.replace(new RegExp(`^\\s{0,${base + 4}}`), "")).join("\n")) : ""}</li>`;
    }).join("")}</${tag}>`;
  }
}

/* ---------------- Données ---------------- */
const keyOf = (m) => (m.kind === "contenu" ? m.lessonId : m.module ? `quiz-${m.module}` : `exam-${m.level}`);
const isDone = (k) => Boolean(state.progress[k]?.done);

async function load() {
  const [mods, cat] = await Promise.all([fetch("/data/modules.json").then((r) => r.json()), fetch("/data/catalogue.json").then((r) => r.json())]);
  state.catalogue = cat;
  const order = cat.levels.flatMap((l) => [...l.modules.map((m) => m.code), `exam-${l.id}`]);
  const rank = (m) => order.indexOf(m.module ?? `exam-${m.level}`) * 1000 + (m.position ?? 0);
  state.items = mods.modules.slice().sort((a, b) => rank(a) - rank(b)).map((m) => ({ ...m, key: keyOf(m) }));
  state.items.forEach((m, idx) => { m.idx = idx; state.byKey.set(m.key, m); });
}

/* ---------------- Navigation ---------------- */
function renderNav(activeKey) {
  const levels = state.catalogue.levels;
  const active = state.byKey.get(activeKey);
  $("#nav").innerHTML = levels.map((l) => {
    const items = state.items.filter((m) => m.level === l.id);
    const done = items.filter((m) => isDone(m.key)).length;
    return `<details class="lvl" ${active?.level === l.id ? "open" : ""}><summary>${esc(l.title)}<div class="bar"><i style="width:${(100 * done) / items.length}%"></i></div></summary>
      ${l.modules.map((mod) => {
        const its = items.filter((m) => m.module === mod.code);
        return `<details class="mod" ${active?.module === mod.code ? "open" : ""}><summary>${esc(mod.code)} · ${esc(mod.title)}</summary>
          ${its.map((m) => `<a class="item ${m.key === activeKey ? "active" : ""} ${isDone(m.key) ? "done" : ""}" href="#/${m.key}">${esc(m.kind === "quiz" ? "📝 Quiz du module" : m.title.replace(/^L\d+\s·\s/, `${m.lessonId} · `))}</a>`).join("")}
        </details>`;
      }).join("")}
      ${items.filter((m) => !m.module).map((m) => `<a class="item exam ${m.key === activeKey ? "active" : ""} ${isDone(m.key) ? "done" : ""}" href="#/${m.key}">🎓 Examen de certification</a>`).join("")}
    </details>`;
  }).join("");
  const total = state.items.length;
  const done = state.items.filter((m) => isDone(m.key)).length;
  $("#progress-global").innerHTML = `Progression : ${done} / ${total}<div class="bar"><i style="width:${(100 * done) / total}%"></i></div>`;
  document.querySelector("#nav a.active")?.scrollIntoView({ block: "nearest" });
}

/* ---------------- Pages ---------------- */
function home() {
  const c = state.catalogue;
  renderNav(null);
  const lessons = state.items.filter((m) => m.kind === "contenu");
  const hours = Math.round(lessons.reduce((n, m) => n + (m.durationMinutes || 0), 0) / 60);
  const next = state.items.find((m) => !isDone(m.key));
  $("#main").innerHTML = `
    <p class="crumb">${esc(c.code)} · ${esc(c.category)}</p>
    <h1>${esc(c.title)}</h1>
    <p><span class="tag">${c.levels.length} niveaux</span><span class="tag">${c.levels.reduce((n, l) => n + l.modules.length, 0)} modules</span><span class="tag">${lessons.length} leçons</span><span class="tag">≈ ${hours} h de lecture</span></p>
    ${next ? `<p><a class="btn" href="#/${next.key}">${state.items.some((m) => isDone(m.key)) ? "Reprendre" : "Commencer"} : ${esc(next.title)}</a></p>` : "<p>🎉 Parcours terminé.</p>"}
    <div class="grid">${c.levels.map((l) => {
      const items = state.items.filter((m) => m.level === l.id);
      const done = items.filter((m) => isDone(m.key)).length;
      return `<a class="card" href="#/niveau/${l.id}"><p class="crumb">${esc(l.code)} · ${l.hours} h</p><h3 style="margin:4px 0 8px">${esc(l.title)}</h3><p class="muted" style="font-size:14px">${esc(l.audience)}</p><div class="bar"><i style="width:${(100 * done) / items.length}%"></i></div><small class="muted">${done} / ${items.length} terminés</small></a>`;
    }).join("")}</div>`;
}

function levelPage(id) {
  const l = state.catalogue.levels.find((x) => x.id === id);
  if (!l) return home();
  renderNav(state.items.find((m) => m.level === id)?.key);
  const exam = state.items.find((m) => m.level === id && !m.module);
  $("#main").innerHTML = `
    <p class="crumb"><a href="#/">Accueil</a> / ${esc(l.code)}</p>
    <h1>${esc(l.title)}</h1>
    <p><span class="tag">${l.hours} h</span><span class="tag">${l.modules.length} modules</span></p>
    <div class="card md"><p><strong>Public :</strong> ${inline(l.audience)}</p><p><strong>Prérequis :</strong> ${inline(l.prerequisites)}</p><p><strong>Certificat :</strong> ${inline(l.certificate)}</p></div>
    ${l.modules.map((mod) => {
      const first = state.items.find((m) => m.module === mod.code);
      return `<div class="card"><p class="crumb">${esc(mod.code)} · ${mod.hours} h</p><h3 style="margin:4px 0"><a href="#/${first?.key}">${esc(mod.title)}</a></h3><p class="muted" style="font-size:14.5px">${esc(mod.description)}</p></div>`;
    }).join("")}
    ${exam ? `<p><a class="btn" href="#/${exam.key}">🎓 Passer l'examen de certification (${exam.content.questions.length} questions)</a></p>` : ""}`;
}

function pager(m) {
  const prev = state.items[m.idx - 1];
  const next = state.items[m.idx + 1];
  return `<div class="pager">${prev ? `<a class="btn ghost" href="#/${prev.key}">← ${esc(prev.kind === "contenu" ? prev.lessonId : prev.module ? `Quiz ${prev.module}` : "Examen")}</a>` : "<span></span>"}
    ${next ? `<a class="btn" href="#/${next.key}" id="next-btn">${esc(next.kind === "contenu" ? next.lessonId : next.module ? `Quiz ${next.module}` : "Examen")} →</a>` : "<span></span>"}</div>`;
}

function lessonPage(m) {
  renderNav(m.key);
  const lvl = state.catalogue.levels.find((l) => l.id === m.level);
  $("#main").innerHTML = `
    <p class="crumb"><a href="#/">Accueil</a> / <a href="#/niveau/${m.level}">${esc(lvl?.code)}</a> / ${esc(m.module)} · ${esc(m.lessonId)}</p>
    <p><span class="tag">⏱ ${m.durationMinutes} min</span></p>
    <article class="card md">${markdown(m.content.body || "")}</article>
    <p><label><input type="checkbox" id="done" ${isDone(m.key) ? "checked" : ""}> Leçon terminée</label></p>
    ${pager(m)}`;
  $("#done").onchange = (e) => { state.progress[m.key] = { done: e.target.checked, at: Date.now() }; saveProgress(); renderNav(m.key); };
  $("#next-btn")?.addEventListener("click", () => { if (!isDone(m.key)) { state.progress[m.key] = { done: true, at: Date.now() }; saveProgress(); } });
  window.scrollTo(0, 0);
}

function quizPage(m) {
  renderNav(m.key);
  const qs = m.content.questions;
  const pass = m.content.passScore ?? 70;
  const exam = !m.module;
  const prev = state.progress[m.key];
  $("#main").innerHTML = `
    <p class="crumb"><a href="#/">Accueil</a> / <a href="#/niveau/${m.level}">${esc(m.level)}</a> / ${exam ? "Examen" : `${esc(m.module)} · Quiz`}</p>
    <h1>${esc(m.title)}</h1>
    <p class="muted">${esc(m.description || "")}</p>
    <p><span class="tag">${qs.length} questions</span><span class="tag">Réussite : ${pass} %</span>${m.content.timeLimitMinutes ? `<span class="tag">⏱ ${m.content.timeLimitMinutes} min</span>` : ""}${prev?.score != null ? `<span class="tag">Dernier score : ${prev.score} %</span>` : ""}</p>
    ${m.content.timeLimitMinutes ? `<div class="timer" id="timer"></div>` : ""}
    <form class="card" id="quiz">${qs.map((q, i) => `
      <div class="q" data-i="${i}"><div class="stem">${i + 1}. ${inline(q.q)}</div>
        ${q.options.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"> <span>${inline(o)}</span></label>`).join("")}
        <div class="expl" hidden></div></div>`).join("")}
      <p><button class="btn" type="submit" id="submit">Valider mes réponses</button> <span class="muted" id="count">0 / ${qs.length} répondues</span></p>
      <div id="result"></div>
    </form>
    ${pager(m)}`;
  const form = $("#quiz");
  form.onchange = () => { $("#count").textContent = `${new Set([...new FormData(form).keys()]).size} / ${qs.length} répondues`; };
  let timer;
  if (m.content.timeLimitMinutes) {
    const end = Date.now() + m.content.timeLimitMinutes * 60000;
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      const el = $("#timer");
      if (!el) return clearInterval(timer);
      el.textContent = `⏱ Temps restant : ${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, "0")}`;
      if (!left) { clearInterval(timer); form.requestSubmit(); }
    };
    tick();
    timer = setInterval(tick, 1000);
  }
  form.onsubmit = (e) => {
    e.preventDefault();
    clearInterval(timer);
    const data = new FormData(form);
    let good = 0;
    qs.forEach((q, i) => {
      const box = form.querySelector(`.q[data-i="${i}"]`);
      const given = data.get(`q${i}`);
      box.querySelectorAll("label").forEach((lab, j) => {
        lab.querySelector("input").disabled = true;
        if (j === q.answer) lab.classList.add("right");
        else if (String(j) === given) lab.classList.add("wrong");
      });
      if (String(q.answer) === given) good++;
      const expl = box.querySelector(".expl");
      expl.hidden = false;
      expl.innerHTML = `${String(q.answer) === given ? "✅" : "❌"} ${inline(q.explanation || "")}${q.source?.url ? ` <br><small>Source : <a href="${esc(q.source.url)}" target="_blank" rel="noopener">${esc(q.source.title || q.source.url)}</a></small>` : ""}`;
    });
    const score = Math.round((100 * good) / qs.length);
    const ok = score >= pass;
    state.progress[m.key] = { done: ok || isDone(m.key), score, at: Date.now() };
    saveProgress();
    renderNav(m.key);
    $("#submit").outerHTML = `<button class="btn ghost" type="button" id="retry">Recommencer</button>`;
    $("#retry").onclick = () => quizPage(m);
    $("#result").innerHTML = `<p class="result ${ok ? "ok" : "ko"}">${good} / ${qs.length} — ${score} % · ${ok ? "Réussi ✅" : `Non validé (seuil ${pass} %)`}</p>`;
    $("#result").scrollIntoView({ behavior: "smooth", block: "center" });
  };
  window.scrollTo(0, 0);
}

function route() {
  const path = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
  if (!path) return home();
  if (path.startsWith("niveau/")) return levelPage(path.slice(7));
  const m = state.byKey.get(path);
  if (!m) return home();
  return m.kind === "contenu" ? lessonPage(m) : quizPage(m);
}

load().then(() => { window.addEventListener("hashchange", route); route(); }).catch((e) => { $("#main").innerHTML = `<p>Erreur de chargement : ${esc(e.message)}</p>`; });
