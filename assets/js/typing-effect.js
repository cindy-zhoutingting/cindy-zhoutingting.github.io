document.addEventListener('DOMContentLoaded', function() {
  const texts = [
    "Large Language Models for Databases",
    "AI4DB & DB4AI",
    "Database Performance Optimization",
    "Distributed Database Systems",
    "Natural Language Interfaces"
  ];

  let currentTextIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const typingElement = document.getElementById('typing-effect');
    if (!typingElement) return;

    const currentText = texts[currentTextIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
      currentCharIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
      currentCharIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && currentCharIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 1000; // 暂停一会儿
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentTextIndex = (currentTextIndex + 1) % texts.length;
      typingSpeed = 500; // 切换文本前暂停一会儿
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();
});