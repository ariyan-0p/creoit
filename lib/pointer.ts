/** Shared pointer position so cursor + hero lens read from one listener. */
export const pointer = { x: 0, y: 0, nx: 0, ny: 0, moved: false };

let bound = false;
export function bindPointer() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.moved = true;
    },
    { passive: true }
  );
}
