(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const beads = [...document.querySelectorAll(".bead")];
  const state = beads.map((el, i) => {
    const id = el.getAttribute("data-path");
    const path = document.getElementById(id);
    return {
      el,
      path,
      len: path ? path.getTotalLength() : 0,
      t: (i * 0.22) % 1,
      speed: 0.0011 + i * 0.00018,
    };
  });

  function frame() {
    if (!reduce) {
      state.forEach((s) => {
        if (!s.path || !s.len) return;
        s.t = (s.t + s.speed) % 1;
        const p = s.path.getPointAtLength(s.t * s.len);
        s.el.setAttribute("cx", p.x);
        s.el.setAttribute("cy", p.y);
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  const links = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("section[id]")];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  sections.forEach((s) => io.observe(s));
})();
