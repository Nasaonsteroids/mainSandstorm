const daysEl = document.querySelector('.day');
const hourEl = document.querySelector('.hour');
const minuteEl = document.querySelector('.minute');
const secondEl = document.querySelector('.seconds');

function timeCountDown() {
  const nowDate = new Date();
  const currentYear = nowDate.getFullYear();
  const nextNewYear = new Date(`January 1, ${currentYear + 1} 00:00:00`);
  const totalSeconds = (nextNewYear - nowDate) / 1000;

  const days = Math.floor(totalSeconds / 3600 / 24);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = Math.floor(totalSeconds) % 60;

  daysEl.textContent = formatTime(days);
  hourEl.textContent = formatTime(hours);
  minuteEl.textContent = formatTime(minutes);
  secondEl.textContent = formatTime(seconds);
}

function formatTime(time) {
  return time >= 10 ? time : `0${time}`;
}

timeCountDown();
setInterval(timeCountDown, 1000);
