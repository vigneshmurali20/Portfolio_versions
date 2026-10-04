/*
 * Toolbox playground: the design tools as physics bodies you can grab,
 * throw and drop into the "Now using" slot. Built on Matter.js, with our own
 * pointer handling so touch scrolling keeps working outside the icons.
 * Every action also has a button, so it works from a keyboard too.
 */
import Matter from 'matter-js';

const { Engine, Bodies, Body, Composite, Constraint, Query } = Matter;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function createPlayground({ root, tools, reduced, onSelect, onHover }) {
  const box = root.querySelector('[data-playground]');
  const canvas = root.querySelector('[data-pg-canvas]');
  const slotEl = root.querySelector('[data-pg-slot]');
  const g = canvas.getContext('2d');

  const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0012 } });
  engine.positionIterations = 8;
  engine.velocityIterations = 6;
  const world = engine.world;

  const state = {
    W: 1,
    H: 1,
    dpr: 1,
    size: 76,
    walls: [],
    bodies: [],
    images: [],
    drag: null,
    hover: null,
    slotted: null,
    // a body the visitor threw or picked; it snaps if it lands in the slot
    intended: null,
    intendedUntil: 0,
    dropped: false,
    running: false,
    visible: false,
  };

  const slot = { x: 0, y: 0, r: 0, w: 0 };

  function measure() {
    const r = box.getBoundingClientRect();
    state.W = r.width;
    state.H = r.height;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(state.W * state.dpr);
    canvas.height = Math.round(state.H * state.dpr);
    state.size = clamp(state.W * 0.085, 56, 84);
    const s = slotEl.getBoundingClientRect();
    slot.x = s.left - r.left + s.width / 2;
    slot.y = s.top - r.top + s.height / 2;
    slot.w = s.width;
  }

  function buildWalls() {
    Composite.remove(world, state.walls);
    const t = 200;
    const { W, H } = state;
    const opts = { isStatic: true, friction: 0.4, restitution: 0.2 };
    state.walls = [
      Bodies.rectangle(W / 2, H + t / 2, W + t * 2, t, opts),
      Bodies.rectangle(-t / 2, H / 2, t, H * 4, opts),
      Bodies.rectangle(W + t / 2, H / 2, t, H * 4, opts),
      Bodies.rectangle(W / 2, -H * 1.5 - t / 2, W + t * 2, t, opts),
    ];
    Composite.add(world, state.walls);
  }

  function makeBody(tool, i, x, y) {
    const s = state.size;
    const b = Bodies.rectangle(x, y, s, s, {
      chamfer: { radius: s * 0.22 },
      restitution: 0.35,
      friction: 0.2,
      frictionAir: 0.012,
      density: 0.002,
      angle: (Math.random() - 0.5) * 0.8,
    });
    b.plugin = { tool, i, scale: 1, glow: 0 };
    return b;
  }

  function dropAll() {
    Composite.remove(world, state.bodies);
    state.bodies = [];
    state.slotted = null;
    slotEl.classList.remove('is-full');
    const cols = Math.max(3, Math.floor((state.W - slot.w - 60) / (state.size * 1.2)));
    tools.forEach((tool, i) => {
      const x = 40 + state.size / 2 + (i % cols) * state.size * 1.2 + Math.random() * 10;
      const y = -state.size * (1 + Math.floor(i / cols) * 1.3) - Math.random() * 40;
      const b = makeBody(tool, i, Math.min(x, state.W - slot.w - 40), y);
      state.bodies.push(b);
    });
    // stagger them in
    state.bodies.forEach((b, i) => setTimeout(() => Composite.add(world, b), reduced ? 0 : i * 70));
  }

  function inSlot(p) {
    return Math.abs(p.x - slot.x) < slot.w * 0.6 && Math.abs(p.y - slot.y) < slot.w * 0.6;
  }

  function eject(b) {
    if (!b) return;
    Body.setStatic(b, false);
    Body.setPosition(b, { x: slot.x - slot.w * 0.4, y: slot.y - slot.w * 0.9 });
    Body.setVelocity(b, { x: -8 - Math.random() * 4, y: -10 });
    Body.setAngularVelocity(b, -0.2);
  }

  let snapAnim = null;
  function snap(b) {
    if (state.slotted === b) return;
    const prev = state.slotted;
    state.slotted = b;
    if (prev) eject(prev);
    Body.setStatic(b, true);
    state.intended = null;
    const from = { x: b.position.x, y: b.position.y, a: b.angle };
    const start = performance.now();
    const dur = reduced ? 1 : 520;
    snapAnim = (now) => {
      const k = clamp((now - start) / dur, 0, 1);
      const e = 1 - Math.pow(1 - k, 4);
      Body.setPosition(b, { x: from.x + (slot.x - from.x) * e, y: from.y + (slot.y - from.y) * e });
      Body.setAngle(b, from.a * (1 - e));
      if (k >= 1) snapAnim = null;
    };
    slotEl.classList.add('is-full');
    slotEl.classList.remove('pulse');
    void slotEl.offsetWidth;
    slotEl.classList.add('pulse');
    onSelect?.(b.plugin.tool);
  }

  /* ---------------------------------------------------------- pointer */
  const local = (e) => {
    const r = box.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const bodyAt = (p) => Query.point(state.bodies, p).filter((b) => !b.isStatic || b === state.slotted)[0] || null;

  // Cancel the touch scroll only when the finger lands on a tool.
  canvas.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0];
      if (t && bodyAt(local(t))) e.preventDefault();
    },
    { passive: false },
  );

  canvas.addEventListener('pointerdown', (e) => {
    const p = local(e);
    const b = bodyAt(p);
    if (!b) return;
    if (b === state.slotted) {
      state.slotted = null;
      slotEl.classList.remove('is-full');
      Body.setStatic(b, false);
      onSelect?.(null);
    }
    canvas.setPointerCapture(e.pointerId);
    const c = Constraint.create({
      pointA: p,
      bodyB: b,
      pointB: { x: p.x - b.position.x, y: p.y - b.position.y },
      stiffness: 0.18,
      damping: 0.08,
      length: 0,
    });
    // keep the grab point fixed to the icon as it rotates
    c.angleB = b.angle;
    Composite.add(world, c);
    state.drag = { body: b, c, id: e.pointerId };
    box.classList.add('is-grabbing');
  });

  canvas.addEventListener('pointermove', (e) => {
    const p = local(e);
    if (state.drag && e.pointerId === state.drag.id) {
      state.drag.c.pointA = p;
      slotEl.classList.toggle('is-target', inSlot(p));
      return;
    }
    const b = bodyAt(p);
    if (b !== state.hover) {
      state.hover = b;
      onHover?.(!!b);
    }
  });

  const release = (e) => {
    if (!state.drag || e.pointerId !== state.drag.id) return;
    const { body, c } = state.drag;
    Composite.remove(world, c);
    state.drag = null;
    box.classList.remove('is-grabbing');
    slotEl.classList.remove('is-target');
    if (inSlot(local(e)) || inSlot(body.position)) {
      snap(body);
    } else {
      state.intended = body;
      state.intendedUntil = performance.now() + 2500;
    }
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => {
    if (!state.drag && state.hover) {
      state.hover = null;
      onHover?.(false);
    }
  });

  /* ---------------------------------------------------------- loop */
  function draw() {
    const { W, H, dpr, size } = state;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    for (const b of state.bodies) {
      if (!Composite.get(world, b.id, 'body')) continue;
      const { x, y } = b.position;
      const pl = b.plugin;
      const target = b === state.hover || (state.drag && state.drag.body === b) ? 1.08 : 1;
      pl.scale += (target - pl.scale) * 0.2;
      const s = size * pl.scale;
      g.save();
      g.translate(x, y);
      g.rotate(b.angle);
      // soft contact shadow
      g.fillStyle = 'rgba(17,16,20,0.10)';
      g.beginPath();
      g.roundRect(-s / 2 + 3, -s / 2 + 6, s, s, s * 0.24);
      g.fill();
      const img = state.images[pl.i];
      if (img) {
        g.save();
        g.beginPath();
        g.roundRect(-s / 2, -s / 2, s, s, s * 0.24);
        g.clip();
        g.drawImage(img, -s / 2, -s / 2, s, s);
        g.restore();
      }
      if (b === state.slotted) {
        g.strokeStyle = '#111014';
        g.lineWidth = 2;
        g.beginPath();
        g.roundRect(-s / 2 - 5, -s / 2 - 5, s + 10, s + 10, s * 0.3);
        g.stroke();
      }
      g.restore();
    }
  }

  let last = performance.now();
  let raf = 0;
  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(now - last, 32);
    last = now;
    if (snapAnim) snapAnim(now);
    // fixed 60 Hz steps keep the simulation stable at any frame rate
    for (let left = dt; left > 0.5; left -= 1000 / 60) Engine.update(engine, Math.min(left, 1000 / 60));
    // a thrown or picked tool that settles in the slot snaps into it
    const b = state.intended;
    if (b && now < state.intendedUntil && inSlot(b.position) && b.speed < 6) snap(b);
    if (b && now >= state.intendedUntil) state.intended = null;
    // keep strays inside the box
    for (const body of state.bodies) {
      if (body.isStatic) continue;
      if (body.position.y > state.H + 200 || body.position.x < -200 || body.position.x > state.W + 200) {
        Body.setPosition(body, { x: state.W * 0.3, y: -state.size });
        Body.setVelocity(body, { x: 0, y: 0 });
      }
    }
    draw();
  }

  function start() {
    if (state.running) return;
    state.running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    state.running = false;
    cancelAnimationFrame(raf);
  }

  /* ---------------------------------------------------------- public actions */
  function shake() {
    for (const b of state.bodies) {
      if (b.isStatic) continue;
      Body.setVelocity(b, { x: (Math.random() - 0.5) * 18, y: -10 - Math.random() * 12 });
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.5);
    }
  }
  function reset() {
    onSelect?.(null);
    dropAll();
  }
  function pick(key) {
    const b = state.bodies.find((x) => x.plugin.tool.key === key);
    if (!b) return;
    if (!Composite.get(world, b.id, 'body')) Composite.add(world, b);
    if (state.slotted === b) return;
    // lift the tool out of the pile and lob it into the slot
    Body.setStatic(b, false);
    Body.setPosition(b, { x: slot.x - slot.w * 1.4, y: slot.y - slot.w * 1.6 });
    Body.setVelocity(b, { x: 0, y: 0 });
    snap(b);
  }

  measure();
  buildWalls();
  const ready = Promise.all(tools.map((t) => loadImage(t.src))).then((imgs) => {
    state.images = imgs;
  });

  const io = new IntersectionObserver(
    ([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) {
        if (!state.dropped) {
          state.dropped = true;
          ready.then(dropAll);
        }
        start();
      } else stop();
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  io.observe(box);

  let resizeT = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      const oldW = state.W;
      measure();
      buildWalls();
      if (state.dropped && Math.abs(oldW - state.W) > 40) dropAll();
      else if (state.slotted) Body.setPosition(state.slotted, { x: slot.x, y: slot.y });
    }, 120);
  });
  ro.observe(box);

  return { shake, reset, pick, destroy: () => (stop(), io.disconnect(), ro.disconnect()) };
}
