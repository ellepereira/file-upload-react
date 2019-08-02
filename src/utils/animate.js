export function animate(from, to, duration, drawFn) {
  return new Promise((resolve) => {
    let stop = false;
    const dur = duration || 200;
    let start = 0;
    let end = 0;

    function startAnim(timeStamp) {
      start = timeStamp;
      end = start + dur;
      draw(timeStamp);
    }

    const draw = (now) => {
      if (stop) {
        resolve();
        return;
      }

      if (now - start >= dur) {
        stop = true;
      }

      const p = (now - start) / dur;
      const x = from + (to - from) * p;
      drawFn(x);
      requestAnimationFrame(draw);
    };

    requestAnimationFrame(startAnim);
  });
}
