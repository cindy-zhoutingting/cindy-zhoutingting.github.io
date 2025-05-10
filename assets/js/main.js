document.addEventListener('DOMContentLoaded', function() {
  // 为研究兴趣部分的链接添加点击事件
  const links = document.querySelectorAll('#research-interests a');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // 滚动到目标元素
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 添加高亮效果
        targetElement.style.transition = 'background-color 0.5s ease';
        targetElement.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';

        setTimeout(() => {
          targetElement.style.backgroundColor = '';
        }, 2000);
      }
    });
  });

  // 添加论文点击效果
  document.querySelectorAll('.publications .title').forEach(title => {
    title.style.cursor = 'pointer';

    title.addEventListener('click', function() {
      const paper = this.closest('li');

      // 添加点击效果
      paper.style.transition = 'transform 0.2s ease';
      paper.style.transform = 'scale(0.98)';

      setTimeout(() => {
        paper.style.transform = 'translateY(-3px)';
      }, 200);

      // 如果有PDF链接，打开它
      const pdfLink = paper.querySelector('a[href$=".pdf"]');
      if (pdfLink) {
        setTimeout(() => {
          window.open(pdfLink.href, '_blank');
        }, 300);
      }
    });
  });

  // BibTex 弹窗功能
  document.querySelectorAll('.bibtex-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const bibtex = this.getAttribute('data-bibtex');
      // 创建弹窗
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.left = 0;
      modal.style.top = 0;
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.3)';
      modal.style.zIndex = 99999;
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';

      // 检查是否为暗色模式
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      const box = document.createElement('div');
      box.style.background = isDark ? '#23272f' : '#fff';
      box.style.color = isDark ? '#eee' : '#222';
      box.style.padding = '24px';
      box.style.borderRadius = '8px';
      box.style.maxWidth = '90vw';
      box.style.maxHeight = '70vh';
      box.style.overflow = 'auto';
      box.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
      box.style.position = 'relative';

      // 复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.style.marginRight = '10px';
      copyBtn.style.padding = '6px 18px';
      copyBtn.style.border = 'none';
      copyBtn.style.background = '#302AE6';
      copyBtn.style.color = '#fff';
      copyBtn.style.borderRadius = '4px';
      copyBtn.style.cursor = 'pointer';

      // 关闭按钮
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.padding = '6px 18px';
      closeBtn.style.border = 'none';
      closeBtn.style.background = '#888';
      closeBtn.style.color = '#fff';
      closeBtn.style.borderRadius = '4px';
      closeBtn.style.cursor = 'pointer';

      // BibTeX 内容
      const pre = document.createElement('pre');
      pre.style.fontSize = '1em';
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.wordBreak = 'break-all';
      pre.style.background = isDark ? '#181a20' : '#f7f7f7';
      pre.style.color = isDark ? '#eee' : '#222';
      pre.style.padding = '12px 16px';
      pre.style.borderRadius = '6px';
      pre.style.marginBottom = '16px';
      pre.textContent = bibtex;

      // 复制功能
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(bibtex).then(function() {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
        });
      };

      closeBtn.onclick = function() {
        document.body.removeChild(modal);
      };

      // 按钮容器
      const btnBox = document.createElement('div');
      btnBox.style.textAlign = 'right';
      btnBox.appendChild(copyBtn);
      btnBox.appendChild(closeBtn);

      box.appendChild(pre);
      box.appendChild(btnBox);
      modal.appendChild(box);
      document.body.appendChild(modal);

      // 点击遮罩关闭
      modal.onclick = function(e) {
        if (e.target === modal) document.body.removeChild(modal);
      };
    });
  });
});

function topFunction() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}