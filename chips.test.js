(function () {
  const chip = document.getElementById('creditChip');
  if (!chip) return;

  // S'assure que le chip est interactif (hover + pointeur) pour pouvoir le saisir
  chip.classList.add('interactive');

  let dragging = false;
  let startX = 0, startY = 0;           // position curseur au début
  let startLeft = 0, startTop = 0;      // position absolue du chip (px)
  let rect0 = null;

  const getPoint = (e) => {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const onStart = (e) => {
    const { x, y } = getPoint(e);
    rect0 = chip.getBoundingClientRect();

    // Fige la position de départ en absolu (px) et bascule en ancrage left/top
    startX = x;
    startY = y;
    startLeft = rect0.left;
    startTop  = rect0.top;

    // On passe en position fixe absolue, en neutralisant bottom/right pour le drag
    chip.style.position = 'fixed';
    chip.style.left = `${startLeft}px`;
    chip.style.top  = `${startTop}px`;
    chip.style.right = 'auto';
    chip.style.bottom = 'auto';

    dragging = true;
    chip.classList.add('is-dragging');

    // Empêche scroll/selection pendant le drag tactile
    if (e.cancelable) e.preventDefault();
  };

  const onMove = (e) => {
    if (!dragging) return;
    const { x, y } = getPoint(e);
    const dx = x - startX;
    const dy = y - startY;

    // Contrainte dans le viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = rect0.width;
    const h = rect0.height;

    const nextLeft = clamp(startLeft + dx, 0, vw - w);
    const nextTop  = clamp(startTop  + dy, 0, vh - h);

    chip.style.left = `${nextLeft}px`;
    chip.style.top  = `${nextTop}px`;

    if (e.cancelable) e.preventDefault();
  };

  const onEnd = () => {
    if (!dragging) return;
    dragging = false;
    chip.classList.remove('is-dragging');
    // Note: aucune persistance => au reload, la position par défaut CSS revient automatiquement.
  };

  // Souris
  chip.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove, { passive: false });
  window.addEventListener('mouseup', onEnd);

  // Tactile
  chip.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
  window.addEventListener('touchcancel', onEnd);

  // Sécurité: si fenêtre redimensionnée pendant drag, on stoppe proprement
  window.addEventListener('resize', onEnd);
})();
