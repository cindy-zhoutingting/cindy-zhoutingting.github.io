/* ==========================================================================
   交互与动效：滚动揭示 / 光标光晕 / 极光视差 / 滚动进度 / 返回顶部 / 复制邮箱
   全部逻辑对 prefers-reduced-motion 与无 JS 场景做了降级处理
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------ 滚动揭示 ------------------------------ */
  function initReveal() {
    var scopes = document.querySelectorAll("section, .content");
    var queue = [];

    function push(el, delay) {
      if (!el || el.nodeType !== 1) return;
      el.setAttribute("data-reveal", "");
      el.style.setProperty("--d", delay + "ms");
      queue.push(el);
    }

    Array.prototype.forEach.call(scopes, function (scope) {
      var index = 0;

      Array.prototype.forEach.call(scope.children, function (el) {
        if (/^(SCRIPT|STYLE|LINK|NOSCRIPT|BR|TEMPLATE)$/.test(el.tagName)) return;
        if (el.classList.contains("bg-decor")) return;
        if (el.id === "back-to-top-btn") return;

        // 论文列表逐条入场，外层容器不再整体淡入
        if (el.classList.contains("publications") && el.querySelector(".publication-item")) {
          Array.prototype.forEach.call(
            el.querySelectorAll(".publication-item"),
            function (card, i) {
              push(card, Math.min(i, 5) * 80);
            }
          );
          return;
        }

        push(el, Math.min(index, 7) * 55);
        index += 1;
      });
    });

    if (!queue.length) return;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      queue.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );

    queue.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------ 光标光晕 ------------------------------ */
  function initCursorGlow() {
    var glow = document.querySelector(".cursor-glow");
    if (!glow || reduceMotion || !canHover) return;

    var queued = false;
    var x = window.innerWidth / 2;
    var y = window.innerHeight * 0.15;

    function paint() {
      queued = false;
      root.style.setProperty("--mx", x + "px");
      root.style.setProperty("--my", y + "px");
    }

    window.addEventListener(
      "pointermove",
      function (e) {
        x = e.clientX;
        y = e.clientY;
        glow.classList.add("is-active");
        if (!queued) {
          queued = true;
          requestAnimationFrame(paint);
        }
      },
      { passive: true }
    );

    document.addEventListener("pointerleave", function () {
      glow.classList.remove("is-active");
    });
  }

  /* ------------------------------ 极光视差 ------------------------------ */
  function initAuroraParallax() {
    var wrap = document.querySelector(".bg-decor");
    if (!wrap || reduceMotion || !canHover) return;

    var blobs = Array.prototype.slice.call(wrap.querySelectorAll(".aurora"));
    if (!blobs.length) return;

    var depth = [26, -18, 14];
    var queued = false;
    var tx = 0;
    var ty = 0;

    function paint() {
      queued = false;
      blobs.forEach(function (blob, i) {
        var d = depth[i % depth.length];
        blob.style.translate = tx * d + "px " + ty * d + "px";
      });
    }

    window.addEventListener(
      "pointermove",
      function (e) {
        tx = e.clientX / window.innerWidth - 0.5;
        ty = e.clientY / window.innerHeight - 0.5;
        if (!queued) {
          queued = true;
          requestAnimationFrame(paint);
        }
      },
      { passive: true }
    );
  }

  /* --------------------- 滚动进度 + 返回顶部 --------------------- */
  function initScrollUI() {
    var progress = document.querySelector(".scroll-progress");
    var btn = document.getElementById("back-to-top-btn");
    var queued = false;

    function ratio() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / max));
    }

    function paint() {
      queued = false;
      var p = ratio();

      if (progress) progress.style.setProperty("--sp", p.toFixed(4));

      if (btn) {
        btn.classList.toggle("is-visible", window.scrollY > 380);
        btn.style.setProperty("--p", (p * 100).toFixed(1));
      }
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    paint();

    if (btn) {
      btn.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? "auto" : "smooth"
        });
      });
    }
  }

  /* ------------------------------ 复制邮箱 ------------------------------ */
  function initEmailCopy() {
    Array.prototype.forEach.call(
      document.querySelectorAll(".email-copy"),
      function (btn) {
        btn.addEventListener("click", function () {
          var text = btn.getAttribute("data-email") || btn.textContent.trim();

          function done() {
            btn.classList.add("is-copied");
            window.setTimeout(function () {
              btn.classList.remove("is-copied");
            }, 1600);
          }

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, done);
            return;
          }

          var tmp = document.createElement("textarea");
          tmp.value = text;
          tmp.setAttribute("readonly", "");
          tmp.style.position = "fixed";
          tmp.style.opacity = "0";
          document.body.appendChild(tmp);
          tmp.select();
          try { document.execCommand("copy"); } catch (err) { /* 忽略 */ }
          document.body.removeChild(tmp);
          done();
        });
      }
    );
  }

  /* ------------------------------ 卡片聚光 ------------------------------ */
  function initCardSpotlight() {
    if (reduceMotion || !canHover) return;

    Array.prototype.forEach.call(
      document.querySelectorAll(".publications ol.bibliography li"),
      function (card) {
        card.addEventListener(
          "pointermove",
          function (e) {
            var r = card.getBoundingClientRect();
            card.style.setProperty("--cx", e.clientX - r.left + "px");
            card.style.setProperty("--cy", e.clientY - r.top + "px");
          },
          { passive: true }
        );
      }
    );
  }

  /* ------------------------------ BibTeX 弹窗 ------------------------------ */
  function initBibtex() {
    Array.prototype.forEach.call(
      document.querySelectorAll(".bibtex-btn"),
      function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();

          var bibtex = btn.getAttribute("data-bibtex") || "";

          var modal = document.createElement("div");
          modal.className = "bibtex-modal";

          var box = document.createElement("div");
          box.className = "bibtex-box";

          var pre = document.createElement("pre");
          pre.textContent = bibtex;

          var actions = document.createElement("div");
          actions.className = "bibtex-actions";

          var copyBtn = document.createElement("button");
          copyBtn.type = "button";
          copyBtn.className = "primary";
          copyBtn.textContent = "复制";

          var closeBtn = document.createElement("button");
          closeBtn.type = "button";
          closeBtn.textContent = "关闭";

          function close() {
            document.removeEventListener("keydown", onKey);
            if (modal.parentNode) modal.parentNode.removeChild(modal);
          }

          function onKey(ev) {
            if (ev.key === "Escape") close();
          }

          copyBtn.addEventListener("click", function () {
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(bibtex).then(function () {
              copyBtn.textContent = "已复制";
              window.setTimeout(function () { copyBtn.textContent = "复制"; }, 1400);
            });
          });

          closeBtn.addEventListener("click", close);
          modal.addEventListener("click", function (ev) {
            if (ev.target === modal) close();
          });
          document.addEventListener("keydown", onKey);

          actions.appendChild(copyBtn);
          actions.appendChild(closeBtn);
          box.appendChild(pre);
          box.appendChild(actions);
          modal.appendChild(box);
          document.body.appendChild(modal);
        });
      }
    );
  }

  /* ------------------------------ 启动 ------------------------------ */
  function boot() {
    initReveal();
    initCursorGlow();
    initAuroraParallax();
    initScrollUI();
    initEmailCopy();
    initCardSpotlight();
    initBibtex();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
