// Plays a short beeping alarm using the Web Audio API (no sound file needed)
export function playAlarm(seconds = 3) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();

  for (let i = 0; i < seconds * 2; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const start = ctx.currentTime + i * 0.5;
    osc.start(start);
    osc.stop(start + 0.25);
  }
  setTimeout(() => ctx.close(), seconds * 1000 + 500);
}

export async function askNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "default") return Notification.requestPermission();
  return Notification.permission;
}

export function showNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
