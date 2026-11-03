/* Charts, references and small page behaviours. Needs Chart.js 4, data.js and sources.js. */
(function () {
  "use strict";
  var D = window.DATA, S = window.SOURCES;

  /* ---------------- references ---------------- */
  var num = {};
  (function buildRefs() {
    var box = document.getElementById("ref-list");
    var group = null, ol = null, n = 0;
    S.forEach(function (s) {
      n += 1; num[s[0]] = n;
      if (s[1] !== group) {
        group = s[1];
        var h = document.createElement("h4"); h.textContent = group; box.appendChild(h);
        ol = document.createElement("ol"); ol.start = n; box.appendChild(ol);
      }
      var li = document.createElement("li"); li.id = "s" + n;
      li.appendChild(document.createTextNode(s[2] + " "));
      if (s[3]) { var a = document.createElement("a"); a.href = s[3]; a.textContent = s[3].replace(/^https?:\/\/(www\.)?/, ""); a.rel = "noopener"; a.target = "_blank"; li.appendChild(a); }
      ol.appendChild(li);
    });
    document.querySelectorAll("sup.ref").forEach(function (el) {
      var keys = el.getAttribute("data-r").split(/\s+/), parts = [];
      keys.forEach(function (k) {
        if (!num[k]) { console.warn("Missing source:", k); return; }
        if (parts.indexOf(num[k]) < 0) parts.push(num[k]);
      });
      parts.sort(function (a, b) { return a - b; });
      el.innerHTML = parts.map(function (p) { return '<a href="#s' + p + '">' + p + "</a>"; }).join(",");
    });
  })();

  /* ---------------- optional photos: hide the figure if the file is missing ---------------- */
  document.querySelectorAll("figure[data-optional] img").forEach(function (img) {
    function drop() { img.closest("figure").remove(); }
    if (img.complete && img.naturalWidth === 0) drop(); else img.addEventListener("error", drop);
  });

  /* ---------------- nav: mark the section in view ---------------- */
  var links = {};
  document.querySelectorAll(".nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && links[e.target.id]) {
          Object.values(links).forEach(function (l) { l.classList.remove("on"); });
          links[e.target.id].classList.add("on");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section[id]").forEach(function (s) { io.observe(s); });
  }

  if (!window.Chart) return;

  /* ---------------- chart defaults ---------------- */
  var C = {
    green: "#1e3d33", green2: "#40695a", green3: "#577f70", sage: "#8dac9f", pale: "#adc4ba",
    claret: "#7a2e3a", rose: "#c99aa3", grey: "#a3a3a3", light: "#d9d9d4", ink: "#1a1a1a", muted: "#5f5f5f"
  };
  Chart.defaults.font.family = '"EB Garamond", Garamond, Georgia, serif';
  var narrow = window.innerWidth < 640;
  Chart.defaults.font.size = narrow ? 12 : 14;
  // long category labels wrap onto several lines on phones
  function wrap(l) {
    if (!narrow || typeof l !== "string" || l.length <= 16) return l;
    var out = [], line = "";
    l.split(" ").forEach(function (w) {
      if ((line + " " + w).trim().length > 16 && line) { out.push(line); line = w; } else { line = (line + " " + w).trim(); }
    });
    if (line) out.push(line);
    return out;
  }
  Chart.defaults.color = C.muted;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.animation = { duration: 700 };
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.legend.labels.boxWidth = 12;
  Chart.defaults.plugins.legend.labels.boxHeight = 12;
  Chart.defaults.plugins.legend.labels.color = C.ink;
  Chart.defaults.plugins.tooltip.backgroundColor = "#fff";
  Chart.defaults.plugins.tooltip.titleColor = C.ink;
  Chart.defaults.plugins.tooltip.bodyColor = C.ink;
  Chart.defaults.plugins.tooltip.borderColor = C.light;
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 0;
  Chart.defaults.plugins.tooltip.titleFont = { weight: "600" };
  Chart.defaults.elements.bar.borderRadius = 0;
  Chart.defaults.scale.grid.color = "#ecebe6";
  Chart.defaults.scale.border.color = C.light;

  /* value labels drawn on the bars/points: options.plugins.vlabels = { fmt: fn, pos: "end" | "inside" } */
  Chart.register({
    id: "vlabels",
    afterDatasetsDraw: function (chart, args, opt) {
      if (!opt || !opt.fmt) return;
      var ctx = chart.ctx, horiz = chart.options.indexAxis === "y";
      ctx.save();
      ctx.font = (opt.weight || "600") + " 13px " + Chart.defaults.font.family;
      chart.data.datasets.forEach(function (ds, di) {
        if (opt.only && opt.only.indexOf(di) < 0) return;
        var meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        meta.data.forEach(function (el, i) {
          var v = ds.data[i]; if (v === null || v === undefined) return;
          var val = typeof v === "object" ? v.y : v;
          var txt = opt.fmt(val, i, di);
          if (!txt) return;
          ctx.fillStyle = opt.color || C.ink;
          if (horiz) {
            var neg = val < 0;
            ctx.textAlign = neg ? "right" : "left"; ctx.textBaseline = "middle";
            ctx.fillText(txt, el.x + (neg ? -5 : 5), el.y);
          } else if (opt.right && opt.right(i)) {
            ctx.textAlign = "left"; ctx.textBaseline = "middle";
            ctx.fillText(txt, el.x + 9, el.y);
          } else if (chart.config.type === "line") {
            ctx.textAlign = "center"; ctx.textBaseline = "bottom";
            ctx.fillText(txt, el.x, el.y - 7);
          } else {
            var down = val < 0;
            ctx.textAlign = "center"; ctx.textBaseline = down ? "top" : "bottom";
            ctx.fillText(txt, el.x, el.y + (down ? 4 : -4));
          }
        });
      });
      ctx.restore();
    }
  });

  function make(id, cfg) {
    var el = document.getElementById(id);
    if (!el) return;
    // draw when the chart scrolls into view, so the animation is seen
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { o.disconnect(); new Chart(el, cfg); }
      }, { rootMargin: "0px 0px -10% 0px" });
      o.observe(el);
    } else { new Chart(el, cfg); }
  }
  var pct = function (v) { return (v > 0 ? "+" : "") + v.toFixed(Math.abs(v) % 1 ? 1 : 0) + "%"; };
  var pctFix = function (v) { return (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(1) + "%"; };
  var minus = function (s) { return String(s).replace("-", "−"); };
  var years = D.years.map(function (y) { return y > 2025 ? y + "F" : String(y); });
  var cats = ["Whisky", "Brandy", "Vodka", "Tequila", "Rum", "Gin", "Soju"];
  var catLabel = { Brandy: "Brandy & cognac" };
  var catCol = { Whisky: C.green, Brandy: C.green2, Vodka: C.sage, Tequila: C.claret, Rum: C.rose, Gin: C.pale, Soju: C.light };
  var i25 = D.years.indexOf(2025);
  function cagr(a, b, n) { return 100 * (Math.pow(b / a, 1 / n) - 1); }
  function hbar(labels, data, colors, extra) {
    var cfg = {
      type: "bar",
      data: { labels: labels.map(wrap), datasets: [{ data: data, backgroundColor: colors, barPercentage: 0.78, categoryPercentage: 0.9 }] },
      options: {
        indexAxis: "y",
        layout: { padding: { right: 48 } },
        scales: { x: { grid: { display: false }, ticks: { display: false }, border: { display: false } },
                  y: { grid: { display: false }, ticks: { autoSkip: false, color: C.ink, font: { size: narrow ? 12 : 15 } } } },
        plugins: { tooltip: { enabled: false } }
      }
    };
    // leave room for the labels of negative bars
    var mn = Math.min.apply(null, data), mx = Math.max.apply(null, data);
    if (mn < 0) { cfg.options.scales.x.min = mn - (mx - mn) * 0.22; cfg.options.scales.x.max = Math.max(0, mx) + (mx - mn) * 0.15; }
    if (extra) extra(cfg);
    return cfg;
  }

  /* ---------------- 01 overview ---------------- */
  (function () {
    var v = cats.map(function (c) { return D.value[c][i25]; });
    var tot = v.reduce(function (a, b) { return a + b; }, 0);
    make("c-cat", hbar(cats.map(function (c) { return catLabel[c] || c; }), v, cats.map(function (c) { return catCol[c] === C.light ? "#bfc0b9" : catCol[c]; }),
      function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return "$" + x.toFixed(0) + "bn · " + Math.round(100 * x / tot) + "%"; } }; cfg.options.layout.padding.right = 90; }));
  })();

  make("c-scope", hbar(["Seven categories (our scope)", "Liqueurs, RTDs and other, incl. baijiu"],
    [D.valueTotal[i25], D.liqueursOtherValue[i25]], [C.green, C.grey],
    function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return "$" + x.toFixed(0) + "bn"; } }; }));

  make("c-gallup", {
    type: "line",
    data: { datasets: [{ data: D.gallup.map(function (p) { return { x: p[0], y: p[1] }; }), borderColor: C.green, backgroundColor: C.green,
      pointRadius: 4, pointBackgroundColor: function (c) { return c.dataIndex === D.gallup.length - 1 ? C.claret : C.green; }, borderWidth: 2, tension: 0 }] },
    options: {
      scales: { x: { type: "linear", min: 1935, max: 2040, ticks: { stepSize: 10, callback: function (v) { return v > 2025 ? "" : v; } }, grid: { display: false } },
                y: { min: 40, max: 80, ticks: { callback: function (v) { return v + "%"; } } } },
      plugins: { vlabels: { fmt: function (v, i) { return [0, 1, 2, 5].indexOf(i) >= 0 ? v + "%" + (i === 5 ? " in 2025" : "") : ""; }, right: function (i) { return i === 5; }, color: "#1a1a1a" },
                 tooltip: { callbacks: { title: function (i) { return String(i[0].raw.x); }, label: function (i) { return i.raw.y + "% drink"; } } } }
    }
  });

  /* ---------------- 02 size ---------------- */
  (function () {
    function idx(a) { return a.map(function (v) { return +(100 * v / a[0]).toFixed(1); }); }
    var dash = { borderDash: function (c) { return c.p0DataIndex >= i25 ? [5, 4] : undefined; } };
    function line(label, arr, col, w) {
      return { label: label, data: idx(arr), borderColor: col, backgroundColor: col, borderWidth: w || 2.5, pointRadius: 0, pointHoverRadius: 4, tension: 0.25, segment: dash };
    }
    make("c-index", {
      type: "line",
      data: { labels: years, datasets: [
        line("Price per litre", D.pricePerLitre, C.green2, 2),
        line("Value", D.valueTotal, C.green, 3),
        line("Volume", D.volumeTotal, C.rose, 2),
        line("Litres per person", D.litresPerPerson, C.claret, 3)
      ] },
      options: {
        interaction: { mode: "index", intersect: false },
        scales: { y: { min: 75, max: 155, ticks: { stepSize: 10 } }, x: { grid: { display: false } } },
        plugins: { legend: { display: true, position: "top", align: "start" },
                   tooltip: { callbacks: { label: function (i) { return i.dataset.label + ": " + i.formattedValue; } } } }
      }
    });
  })();

  make("c-stack", {
    type: "bar",
    data: { labels: years, datasets: cats.map(function (c) {
      return { label: catLabel[c] || c, data: D.value[c], backgroundColor: catCol[c], barPercentage: 0.82, categoryPercentage: 0.9 };
    }) },
    options: {
      interaction: { mode: "index", intersect: false },
      scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, ticks: { callback: function (v) { return "$" + v; } } } },
      plugins: { legend: { display: true, position: "top", align: "start" },
                 tooltip: { itemSort: function (a, b) { return b.datasetIndex - a.datasetIndex; },
                            callbacks: { label: function (i) { return i.dataset.label + ": $" + i.raw.toFixed(1) + "bn"; },
                                         footer: function (it) { var t = it.reduce(function (s, i) { return s + i.raw; }, 0); return "Total: $" + t.toFixed(0) + "bn"; } } } }
    }
  });

  (function () {
    var i19 = 0, i30 = D.years.indexOf(2030);
    var a = cats.map(function (c) { return +cagr(D.value[c][i19], D.value[c][i25], 6).toFixed(1); });
    var b = cats.map(function (c) { return +cagr(D.value[c][i25], D.value[c][i30], 5).toFixed(1); });
    make("c-cagr", {
      type: "bar",
      data: { labels: cats.map(function (c) { return catLabel[c] || c; }), datasets: [
        { label: "2019–2025", data: a, backgroundColor: C.pale, barPercentage: 0.9, categoryPercentage: 0.75 },
        { label: "2025–2030F", data: b, backgroundColor: C.green, barPercentage: 0.9, categoryPercentage: 0.75 }] },
      options: {
        indexAxis: "y", layout: { padding: { right: 44 } },
        scales: { x: { grid: { display: false }, ticks: { display: false }, border: { display: false } }, y: { grid: { display: false }, ticks: { autoSkip: false, color: C.ink, font: { size: narrow ? 12 : 15 } } } },
        plugins: { legend: { display: true, position: "top", align: "start" }, vlabels: { fmt: function (v) { return pct(v); }, weight: "500" }, tooltip: { enabled: false } }
      }
    });

    var ppl = cats.map(function (c) { return +(D.value[c][i25] / D.volume[c][i25]).toFixed(1); });
    make("c-ppl", hbar(cats.map(function (c) { return catLabel[c] || c; }), ppl,
      cats.map(function (c) { return c === "Tequila" ? C.claret : C.green3; }),
      function (cfg) {
        cfg.options.plugins.vlabels = { fmt: function (x) { return "$" + x.toFixed(1); } };
      }));
  })();

  make("c-cpi", {
    type: "bar",
    data: { labels: D.priceVsCpi.years, datasets: [
      { label: "Price per litre", data: D.priceVsCpi.price, backgroundColor: C.green, barPercentage: 0.85, categoryPercentage: 0.7 },
      { label: "Inflation", data: D.priceVsCpi.cpi, backgroundColor: C.rose, barPercentage: 0.85, categoryPercentage: 0.7 }] },
    options: {
      scales: { x: { grid: { display: false } }, y: { min: -2, max: 10, ticks: { callback: function (v) { return v + "%"; } } } },
      plugins: { legend: { display: true, position: "top", align: "start" }, vlabels: { fmt: function (v) { return minus(pct(v)); } }, tooltip: { enabled: false } }
    }
  });

  /* ---------------- 03 geography ---------------- */
  (function () {
    var c = D.countries;
    make("c-countries", hbar(c.map(function (r) { return r[0]; }), c.map(function (r) { return r[1]; }),
      c.map(function (r, i) { return r[0] === "China" ? "#d7d7d2" : (i < 4 ? C.green : C.sage); }),
      function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x, i) { return "$" + x.toFixed(1) + "bn" + (i === 0 ? "  (mostly baijiu)" : ""); } }; cfg.options.layout.padding.right = 120; }));
    var g = c.slice().sort(function (a, b) { return b[3] - a[3]; });
    make("c-growth", hbar(g.map(function (r) { return r[0]; }), g.map(function (r) { return r[3]; }),
      g.map(function (r) { return r[3] < 0 ? C.claret : (r[0] === "China" ? "#d7d7d2" : C.green3); }),
      function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return minus(pctFix(x)); } }; cfg.options.layout.padding.left = 40; }));
  })();

  /* ---------------- 04 competition ---------------- */
  (function () {
    var rows = D.shares.filter(function (r) { return r[0] !== "Rémy Cointreau" && r[0] !== "Others"; });
    var remy = D.shares.filter(function (r) { return r[0] === "Rémy Cointreau"; })[0][1];
    var others = D.shares.filter(function (r) { return r[0] === "Others"; })[0][1] + remy;
    rows.push(["Others", +others.toFixed(1)]);
    var cols = ["#1e3d33", "#2e5446", "#40695a", "#577f70", "#709586", "#8dac9f", "#adc4ba", "#7a2e3a", "#a3a3a3"];
    make("c-share", {
      type: "doughnut",
      data: { labels: rows.map(function (r) { return r[0]; }), datasets: [{ data: rows.map(function (r) { return r[1]; }), backgroundColor: cols, borderColor: "#fff", borderWidth: 2 }] },
      options: {
        cutout: "56%",
        plugins: {
          legend: { display: true, position: "right", labels: { generateLabels: function (ch) {
            return ch.data.labels.map(function (l, i) { return { text: l + "  " + ch.data.datasets[0].data[i].toFixed(1) + "%", fillStyle: cols[i], strokeStyle: cols[i], lineWidth: 0, index: i, fontColor: C.ink }; });
          } } },
          tooltip: { callbacks: { label: function (i) { return i.label + ": " + i.raw.toFixed(1) + "%"; } } }
        }
      },
      plugins: [{ id: "centre", afterDraw: function (ch) {
        var a = ch.chartArea, m = ch.getDatasetMeta(0).data[0]; if (!m) return;
        var ctx = ch.ctx; ctx.save(); ctx.textAlign = "center"; ctx.fillStyle = C.green;
        ctx.font = "600 26px " + Chart.defaults.font.family; ctx.fillText("34.5%", m.x, m.y + 2);
        ctx.font = "14px " + Chart.defaults.font.family; ctx.fillStyle = C.muted; ctx.fillText("top 7 groups", m.x, m.y + 22);
        ctx.restore();
      } }]
    });
  })();

  make("c-groups", {
    type: "scatter",
    data: { datasets: [{ data: D.groups.map(function (g) { return { x: g[1], y: g[2], n: g[0] }; }),
      pointRadius: 7, pointHoverRadius: 9,
      backgroundColor: D.groups.map(function (g) { return g[1] > 1 ? C.claret : C.green; }) }] },
    options: {
      layout: { padding: { top: 10, right: 20 } },
      scales: {
        x: { min: -5, max: 4, title: { display: true, text: "Organic sales growth, %", color: C.muted }, ticks: { callback: function (v) { return minus(v) + "%"; } } },
        y: { min: 14, max: 32, title: { display: true, text: "Operating margin, %", color: C.muted }, ticks: { callback: function (v) { return v + "%"; } } }
      },
      plugins: { tooltip: { callbacks: { label: function (i) { return i.raw.n + ": growth " + minus(pctFix(i.raw.x)) + ", margin " + i.raw.y + "%"; } } } }
    },
    plugins: [{ id: "names", afterDatasetsDraw: function (ch) {
      var ctx = ch.ctx; ctx.save(); ctx.font = "14px " + Chart.defaults.font.family; ctx.fillStyle = C.ink;
      ch.getDatasetMeta(0).data.forEach(function (p, i) {
        var g = D.groups[i], left = g[0] === "Campari Group";
        ctx.textAlign = left ? "right" : "left"; ctx.textBaseline = "middle";
        ctx.fillText(g[0], p.x + (left ? -11 : 11), p.y + (g[0] === "Brown-Forman" ? 9 : g[0] === "Pernod Ricard" ? -6 : 0));
      });
      var x0 = ch.scales.x.getPixelForValue(0); ctx.strokeStyle = C.grey; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(x0, ch.chartArea.top); ctx.lineTo(x0, ch.chartArea.bottom); ctx.stroke(); ctx.restore();
    } }]
  });

  (function () {
    var b = D.brands;
    var west = ["Vodka", "Rum"];
    make("c-brands", hbar(b.map(function (r) { return r[0] + "  (" + r[1] + ")"; }), b.map(function (r) { return r[2]; }),
      b.map(function (r) { return r[0] === "Smirnoff" ? C.claret : C.green3; }),
      function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return x.toFixed(1); } }; cfg.options.scales.y.ticks.font = { size: narrow ? 12 : 14 }; }));
  })();

  make("c-pl", hbar(D.privateLabelEU.map(function (r) { return r[0]; }), D.privateLabelEU.map(function (r) { return r[1]; }),
    D.privateLabelEU.map(function (r) { return r[0] === "Private label" ? C.claret : (r[1] > 0 ? C.green : C.grey); }),
    function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return minus(pctFix(x)); } }; cfg.options.layout.padding.left = 40; }));

  /* ---------------- 06 technology ---------------- */
  make("c-agave", {
    type: "bar",
    data: { labels: D.agave.map(function (r) { return r[0]; }), datasets: [{ data: D.agave.map(function (r) { return r[1]; }), backgroundColor: [C.grey, C.green, C.green], barPercentage: 0.6 }] },
    options: { scales: { x: { grid: { display: false }, ticks: { color: C.ink } }, y: { display: false, max: 40 } },
               plugins: { vlabels: { fmt: function (v, i) { return "MXN " + D.agave[i][2]; } }, tooltip: { enabled: false } } }
  });
  make("c-barley", {
    type: "bar",
    data: { labels: D.barley.map(function (r) { return r[0]; }), datasets: [{ data: D.barley.map(function (r) { return r[1]; }), backgroundColor: [C.grey, C.green], barPercentage: 0.5 }] },
    options: { scales: { x: { grid: { display: false }, ticks: { color: C.ink } }, y: { display: false, min: 0, max: 240 } },
               plugins: { vlabels: { fmt: function (v) { return "£" + v; } }, tooltip: { enabled: false } } }
  });

  make("c-channel", {
    type: "line",
    data: { labels: D.online.years.map(function (y) { return y > 2025 ? y + "F" : String(y); }), datasets: [
      { label: "Bars, restaurants and hotels", data: [null].concat(D.outOfHomeShare), borderColor: C.claret, backgroundColor: C.claret, borderWidth: 3, pointRadius: 0, pointHoverRadius: 4, tension: 0.25,
        segment: { borderDash: function (c) { return c.p0DataIndex >= 7 ? [5, 4] : undefined; } } },
      { label: "Online", data: D.online.share, borderColor: C.green, backgroundColor: C.green, borderWidth: 3, pointRadius: 0, pointHoverRadius: 4, tension: 0.25,
        segment: { borderDash: function (c) { return c.p0DataIndex >= 7 ? [5, 4] : undefined; } } }] },
    options: {
      interaction: { mode: "index", intersect: false }, spanGaps: false,
      scales: { y: { min: 0, max: 32, ticks: { callback: function (v) { return v + "%"; } } }, x: { grid: { display: false } } },
      plugins: { legend: { display: true, position: "top", align: "start" },
                 tooltip: { callbacks: { label: function (i) { return i.dataset.label + ": " + i.raw + "%"; } } } }
    }
  });

  /* ---------------- 07 challenges ---------------- */
  make("c-genz", {
    type: "bar",
    data: { labels: D.genz.labels.map(wrap), datasets: [
      { label: "February 2025", data: D.genz.y2025, backgroundColor: C.pale, barPercentage: 0.9, categoryPercentage: 0.75 },
      { label: "February 2026", data: D.genz.y2026, backgroundColor: C.claret, barPercentage: 0.9, categoryPercentage: 0.75 }] },
    options: {
      indexAxis: "y", layout: { padding: { right: 40 } },
      scales: { x: { display: false, max: 75 }, y: { grid: { display: false }, ticks: { autoSkip: false, color: C.ink, font: { size: narrow ? 12 : 15 } } } },
      plugins: { legend: { display: true, position: "top", align: "start" }, vlabels: { fmt: function (v) { return v + "%"; }, weight: "500" }, tooltip: { enabled: false } }
    }
  });

  make("c-glp1", hbar(D.glp1.map(function (r) { return r[0]; }), D.glp1.map(function (r) { return r[1]; }),
    D.glp1.map(function (r) { return r[0].indexOf("US") === 0 ? C.green3 : C.claret; }),
    function (cfg) {
      cfg.options.plugins.vlabels = { fmt: function (x) { return minus(x % 1 ? x.toFixed(1) : x) + "%"; } };
      cfg.options.layout.padding = { left: 10, right: 10 };
      cfg.options.scales.y.ticks.font = { size: narrow ? 12 : 14 };
    }));

  make("c-thc", hbar(D.thc.map(function (r) { return r[0]; }), D.thc.map(function (r) { return r[1]; }),
    [C.claret, C.grey, C.grey], function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return "$" + x + "m"; } }; }));

  /* ---------------- 08 opportunities ---------------- */
  make("c-premium", hbar(D.premium.map(function (r) { return r[0]; }), D.premium.map(function (r) { return r[1]; }),
    D.premium.map(function (r) { return r[1] >= 0 ? C.green : C.claret; }),
    function (cfg) {
      cfg.options.plugins.vlabels = { fmt: function (x) { return minus(pct(x)); } };
      cfg.options.layout.padding = { left: 40, right: 44 };
      cfg.options.scales.y.ticks.font = { size: narrow ? 12 : 14 };
    }));

  make("c-tr", {
    type: "bar",
    data: { labels: D.travelRetail.map(function (r) { return r[0]; }), datasets: [{ data: D.travelRetail.map(function (r) { return r[1]; }), backgroundColor: C.green, barPercentage: 0.6 }] },
    options: { scales: { x: { grid: { display: false }, ticks: { color: C.ink } }, y: { display: false, min: 0, max: 13 } },
               plugins: { vlabels: { fmt: function (v) { return "+" + v + "%"; } }, tooltip: { enabled: false } } }
  });

  /* ---------------- 09 outlook ---------------- */
  make("c-10y", hbar(D.outlook10y.map(function (r) { return r[0]; }), D.outlook10y.map(function (r) { return r[1]; }),
    D.outlook10y.map(function (r) { return r[1] > 0 ? C.green : (r[0] === "Spirits" ? C.claret : C.grey); }),
    function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return minus(pct(x)); } }; cfg.options.layout.padding.left = 44; }));

  /* ---------------- baijiu ---------------- */
  make("c-baijiu-size", hbar(D.baijiuSize.map(function (r) { return r[0]; }), D.baijiuSize.map(function (r) { return r[1]; }),
    [C.claret, C.green3, C.grey], function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return "$" + x + "bn"; } }; }));
  make("c-baijiu-makers", hbar(D.baijiuMakers.map(function (r) { return r[0]; }), D.baijiuMakers.map(function (r) { return r[1]; }),
    D.baijiuMakers.map(function (r, i) { return i === 0 ? C.claret : C.green3; }), function (cfg) { cfg.options.plugins.vlabels = { fmt: function (x) { return x.toFixed(1); } }; }));
  make("c-baijiu-output", {
    type: "bar",
    data: { labels: D.baijiuOutput.map(function (r) { return r[0]; }), datasets: [{ data: D.baijiuOutput.map(function (r) { return r[1]; }), backgroundColor: [C.grey, C.claret], barPercentage: 0.5 }] },
    options: { scales: { x: { grid: { display: false }, ticks: { color: C.ink } }, y: { display: false, min: 0, max: 16 } },
               plugins: { vlabels: { fmt: function (v) { return v + "m kL"; } }, tooltip: { enabled: false } } }
  });
})();
