// Chematrix Solutions — shared interactions

document.addEventListener("DOMContentLoaded", () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", links.classList.contains("open"));
    });
    links
      .querySelectorAll("a")
      .forEach((a) =>
        a.addEventListener("click", () => links.classList.remove("open")),
      );
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* Counters */
  const counters = document.querySelectorAll(".counter[data-target]");
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = target * (0.15 + 0.85 * p);
      el.textContent =
        (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* Showcase panel tabs (index + services) */
  const tabs = document.querySelectorAll(".panel-tab");
  const stages = document.querySelectorAll(".panel-stage");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const key = tab.dataset.panel;
      stages.forEach(
        (s) => (s.style.display = s.dataset.panel === key ? "grid" : "none"),
      );
    });
  });

  /* Case study filters */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const caseCards = document.querySelectorAll(".case-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      caseCards.forEach((card) => {
        const tags = card.dataset.tags || "";
        card.style.display = f === "all" || tags.includes(f) ? "flex" : "none";
      });
    });
  });

  /* Blog search */
  const blogSearch = document.querySelector("#blogSearchInput");
  const blogCards = document.querySelectorAll(".blog-card");
  if (blogSearch) {
    blogSearch.addEventListener("input", () => {
      const q = blogSearch.value.trim().toLowerCase();
      blogCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? "flex" : "none";
      });
    });
  }
  const blogCatLinks = document.querySelectorAll(".blog-cats a");
  blogCatLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      blogCatLinks.forEach((l) => l.classList.remove("active-cat"));
      link.classList.add("active-cat");
      const cat = link.dataset.cat;
      blogCards.forEach((card) => {
        card.style.display =
          cat === "all" || card.dataset.cat === cat ? "flex" : "none";
      });
    });
  });

  /* Contact form — front-end only demo handling */
  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = "Message sent";
      btn.disabled = true;
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 2600);
    });
  }

  /* Active nav link */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
});

/* Case study category tabs */
document.addEventListener("DOMContentLoaded", () => {
  const categoryTabs = document.querySelectorAll(
    '.case-category-tabs [role="tab"]',
  );
  const categorySections = document.querySelectorAll(
    '.case-section[role="tabpanel"]',
  );

  if (!categoryTabs.length || !categorySections.length) {
    return;
  }

  function activateCategory(tab) {
    const targetId = tab.dataset.caseSection;

    categoryTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    categorySections.forEach((section) => {
      section.hidden = section.id !== targetId;
    });
  }

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateCategory(tab));
  });

  const hashTarget = window.location.hash
    ? document.querySelector(window.location.hash)
    : null;
  const matchingSection = hashTarget?.closest('.case-section[role="tabpanel"]');
  const initialTab = matchingSection
    ? document.querySelector(`[data-case-section="${matchingSection.id}"]`)
    : categoryTabs[0];

  activateCategory(initialTab);
});

(function () {
  const root = document.querySelector("#case-studies");

  if (!root) {
    return;
  }

  const tabs = root.querySelectorAll(".case-study-tab");
  const panels = root.querySelectorAll(".case-study-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const targetPanelId = tab.getAttribute("data-panel");

      tabs.forEach(function (item) {
        const isActive = item === tab;

        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach(function (panel) {
        const isTarget = panel.id === targetPanelId;

        panel.classList.toggle("is-active", isTarget);
        panel.hidden = !isTarget;
      });
    });

    tab.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(tabs).indexOf(tab);
      let nextIndex = currentIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      }

      if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      }

      if (nextIndex !== currentIndex) {
        event.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    });
  });

  panels.forEach(function (panel) {
    const track = panel.querySelector(".case-study-track");
    const previousButton = panel.querySelector(".carousel-prev");
    const nextButton = panel.querySelector(".carousel-next");

    if (!track || !previousButton || !nextButton) {
      return;
    }

    function getScrollAmount() {
      const card = track.querySelector(".case-study-card");

      if (!card) {
        return 320;
      }

      return card.getBoundingClientRect().width + 22;
    }

    previousButton.addEventListener("click", function () {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    });

    nextButton.addEventListener("click", function () {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    });

    let autoScrollTimer;
    let isPaused = false;

    function startAutoScroll() {
      window.clearInterval(autoScrollTimer);

      autoScrollTimer = window.setInterval(function () {
        if (isPaused || panel.hidden) {
          return;
        }

        const maxScroll = track.scrollWidth - track.clientWidth - 4;

        if (track.scrollLeft >= maxScroll) {
          track.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          track.scrollBy({
            left: getScrollAmount(),
            behavior: "smooth",
          });
        }
      }, 4500);
    }

    panel.addEventListener("mouseenter", function () {
      isPaused = true;
    });

    panel.addEventListener("mouseleave", function () {
      isPaused = false;
    });

    panel.addEventListener("focusin", function () {
      isPaused = true;
    });

    panel.addEventListener("focusout", function () {
      isPaused = false;
    });

    startAutoScroll();
  });
})();
