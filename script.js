const revealTargets = document.querySelectorAll(
  "main section, .device-card, .feature-list li, .platform-card"
);
const alwaysVisibleTargets = document.querySelectorAll(".footer, .footer *");
const progressBar = document.querySelector(".scroll-progress");
const ambientA = document.querySelector(".ambient-a");
const ambientB = document.querySelector(".ambient-b");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

alwaysVisibleTargets.forEach((target) => target.classList.add("is-visible"));

if (prefersReducedMotion) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  revealTargets.forEach((target, index) => {
    target.classList.add("scroll-reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index * 45, 320)}ms`);
  });

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
    {
      threshold: 0.05,
      rootMargin: "0px 0px 22% 0px"
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

const updateScrollProgress = () => {
  if (!progressBar) {
    return;
  }

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable <= 0 ? 0 : window.scrollY / scrollable;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

if (!prefersReducedMotion) {
  const moveAmbientByPointer = (event) => {
    const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
    const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;

    if (ambientA) {
      ambientA.style.transform = `translate3d(${xRatio * -14}px, ${yRatio * -10}px, 0)`;
    }

    if (ambientB) {
      ambientB.style.transform = `translate3d(${xRatio * 18}px, ${yRatio * 14}px, 0)`;
    }
  };

  window.addEventListener("mousemove", moveAmbientByPointer);
}