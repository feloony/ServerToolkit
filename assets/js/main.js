(function () {
  "use strict";

  const toggle = document.querySelector(".mobile-nav-toggle");
  const menu = document.querySelector(".mobile-nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      menu.classList.toggle("open");
    });
  }

  if (menu) {
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("active");
        menu.classList.remove("open");
      });
    });
  }

  const toastContainer = document.querySelector(".toast-container") || createToastContainer();

  function createToastContainer() {
    const container = document.createElement("div");
    container.className = "toast-container";
    container.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 200;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `;
    document.body.appendChild(container);
    return container;
  }

  window.showToast = function (message, type = "info") {
    const toast = document.createElement("div");
    const colors = {
      success: "#22c55e",
      error: "#ef4444",
      info: "#4f6ef7"
    };
    toast.style.cssText = `
      background: #ffffff;
      border: 1px solid #e2e5ea;
      border-left: 3px solid ${colors[type] || colors.info};
      color: #1a1d21;
      padding: 0.875rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 0.625rem;
      min-width: 280px;
      animation: slideIn 0.3s ease forwards;
      font-family: 'Inter', -apple-system, sans-serif;
      border-radius: 12px;
    `;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease forwards";
      toast.addEventListener("animationend", () => toast.remove());
    }, 3000);
  };

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(120%); }
      to { transform: translateX(0); }
    }
    @keyframes slideOut {
      to { transform: translateX(120%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  window.copyToClipboard = function (text, successMessage = "Copied to clipboard") {
    if (!navigator.clipboard) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        showToast(successMessage, "success");
      } catch (e) {
        showToast("Failed to copy", "error");
      }
      document.body.removeChild(textarea);
      return;
    }

    navigator.clipboard.writeText(text).then(
      () => showToast(successMessage, "success"),
      () => showToast("Failed to copy", "error")
    );
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll(".footer-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();