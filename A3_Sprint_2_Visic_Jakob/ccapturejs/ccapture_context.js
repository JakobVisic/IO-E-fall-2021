function Ccapture_context(fps) {
  this.capturer = null;
  this.btn = document.createElement("button");
  this.btn.textContent = "start recording";
  document.body.appendChild(this.btn);
  this.btn.onclick = e => {
    return record(this);
  }
}

function record(ctx) {
  ctx.capturer = new CCapture({
    format: "webm",
    framerate: fps
  });
  ctx.capturer.start();
  ctx.btn.textContent = "stop recording";
  var prev_fn = ctx.btn.onclick;
  ctx.btn.onclick = e => {
    ctx.capturer.stop();
    ctx.capturer.save();
    ctx.capturer = null;
    ctx.btn.textContent = "start recording";
    ctx.btn.onclick = prev_fn;
  };
}

