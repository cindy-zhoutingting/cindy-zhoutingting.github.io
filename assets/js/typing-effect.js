/* 侧栏副标题：打字机轮播
   内容自动读取页面「研究兴趣」下的方向，随 index.md 更新而同步 */
(function () {
  "use strict";

  var FALLBACK = ["公司金融", "法与金融", "企业信息披露", "生成式人工智能与金融决策"];

  // 从研究兴趣卡片中读取最新方向
  function collect() {
    var fields = document.querySelectorAll(".interest-list .interest-field");
    var list = [];

    Array.prototype.forEach.call(fields, function (el) {
      var text = (el.textContent || "").trim();
      if (text) list.push(text);
    });

    return list.length ? list : FALLBACK;
  }

  function start() {
    var el = document.getElementById("typing-effect");
    if (!el) return;

    var TEXTS = collect();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = TEXTS.join(" · ");
      return;
    }

    var textIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = TEXTS[textIndex];
      var delay;

      if (deleting) {
        charIndex--;
        delay = 40;
      } else {
        charIndex++;
        delay = 95;
      }

      el.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex === current.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        textIndex = (textIndex + 1) % TEXTS.length;
        delay = 400;
      }

      window.setTimeout(tick, delay);
    }

    window.setTimeout(tick, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
