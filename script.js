(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const pairs = [
    { el: document.querySelector(".t1"), path: document.getElementById("e2") },
    { el: document.querySelector(".t2"), path: document.getElementById("e4") },
    { el: document.querySelector(".t3"), path: document.getElementById("e5") },
  ];

  const state = pairs.map((p, i) => ({
    ...p,
    len: p.path ? p.path.getTotalLength() : 0,
    t: (i * 0.28) % 1,
    speed: 0.00022 + i * 0.00004,
  }));

  function tick() {
    state.forEach((s) => {
      if (!s.el || !s.path || !s.len) return;
      s.t = (s.t + s.speed) % 1;
      const pt = s.path.getPointAtLength(s.t * s.len);
      s.el.setAttribute("cx", pt.x);
      s.el.setAttribute("cy", pt.y);
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const nav = document.getElementById("nav");
  const sections = [...document.querySelectorAll("section[id]")];
  const links = [...document.querySelectorAll(".nav-links a")];

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        links.forEach((a) => {
          a.style.color = a.getAttribute("href") === "#" + id ? "#C9A227" : "";
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));

  window.addEventListener("scroll", () => {
    nav.style.borderBottomColor =
      window.scrollY > 8 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)";
  }, { passive: true });
})();
