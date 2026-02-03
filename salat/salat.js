const city = new URLSearchParams(window.location.search).get('city') || 'sousse';
const country = new URLSearchParams(window.location.search).get('country') || 'Tunisia';
const method = 2; // Islamic Society of North America

const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const times = data.data.timings;

    const list = document.getElementById("prayer-times");
    list.innerHTML = "";

    const prayers = [
      "Fajr",
      "Dhuhr",
      "Asr",
      "Maghrib",
      "Isha"
    ];

    prayers.forEach(prayer => {
      const li = document.createElement("li");
      li.textContent = `${prayer}: ${times[prayer]}`;
      list.appendChild(li);
    });
  })
  .catch(() => {
    document.getElementById("prayer-times").innerHTML =
      "<li>Unable to load prayer times</li>";
  });
