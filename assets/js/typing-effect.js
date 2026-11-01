/* 侧栏副标题：打字机轮播 */
(function () {
  "use strict";

  var TEXTS = ["公司金融", "企业并购", "公司治理", "数字化转型"];

  function start() {
    var el = document.getElementById("typing-effect");
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = TEXTS.join(" · ");
      return;
    }

    var textIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var hold = 0;

    function tick() {
      var current = TEXTS[textIndex];
      var delay;

      if (deleting) {
        charIndex--;
        delay = 45;
      } else {
        charIndex++;
        delay = 110;
      }

      el.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex === current.length) {
        deleting = true;
        hold = 2;
        delay = 1500;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        textIndex = (textIndex + 1) % TEXTS.length;
        delay = 420;
      }

      if (hold > 0 && delay < 1000) hold -= 1;

      window.setTimeout(tick, delay);
    }

    window.setTimeout(tick, 520);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
