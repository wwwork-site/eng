(() => {
  const body = document.body;
  const currentPage = body.dataset.page;
  const navLinks = document.querySelectorAll("[data-page-link]");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");

  navLinks.forEach((link) => {
    if (link.dataset.pageLink === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    link.addEventListener("click", () => {
      if (nav && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
      }
    });
  });

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealItems.length && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-current-year]").forEach((yearNode) => {
    yearNode.textContent = String(new Date().getFullYear());
  });

  const faqItems = document.querySelectorAll("[data-faq-item]");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      faqItems.forEach((other) => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });

  const leadForm = document.getElementById("leadForm");
  if (leadForm) {
    const status = document.getElementById("formStatus");

    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(leadForm);
      const fields = {
        name: String(formData.get("name") || "").trim(),
        company: String(formData.get("company") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        teamSize: String(formData.get("teamSize") || "").trim(),
        message: String(formData.get("message") || "").trim(),
      };

      const bodyLines = [
        "Новая заявка с сайта EngCore Ultimate",
        "",
        `Имя: ${fields.name}`,
        `Компания: ${fields.company}`,
        `Email: ${fields.email}`,
        `Объем найма / команда: ${fields.teamSize}`,
        "",
        "Комментарий:",
        fields.message || "-",
      ];

      const subject = encodeURIComponent("Заявка EngCore Ultimate");
      const bodyText = encodeURIComponent(bodyLines.join("\n"));
      window.location.href = `mailto:hello@engcore.io?subject=${subject}&body=${bodyText}`;

      if (status) {
        status.textContent = "Почтовый клиент открыт. Проверьте письмо и отправьте заявку.";
      }
    });
  }
})();
