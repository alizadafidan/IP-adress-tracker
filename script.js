const API_KEY = "at_GG51CjGvaswB8AyJiH1RTrcp11xNj";
const IP_API_URL = `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}`;
const API_URL =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
const MAP_BOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoid2FzaGluZ3RvbjI5OSIsImEiOiJja2dzaTNkMjEwNDM0MzFvZnNnNTNxNjNvIn0.c0RymMFd_Q9NADrTGZh7wg";

console.log(API_URL);
//Selecting elements
const button = document.querySelector(".header-button");
const ipAdress = document.querySelector(".header-ip-adress");
const region = document.querySelector(".header-ip-location");
const timezone = document.querySelector(".header-ip-timezone");
const isp = document.querySelector(".header-ip-isp");
const form = document.querySelector(".header-form");
const input = document.querySelector(".header-input");

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(function (position) {
    let { latitude } = position.coords;
    let { longitude } = position.coords;
    const coords = [latitude, longitude];
    console.log(coords);
    const map = L.map("map-id").setView(coords, 13);
    const marker = L.marker(coords).addTo(map);

    L.tileLayer(API_URL, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: MAP_BOX_ACCESS_TOKEN,
    }).addTo(map);
    marker.bindPopup(`<b>${region.textContent}</b>`).openPopup();
  });

(function () {
  const res = fetch(`${IP_API_URL}`, { method: "GET" })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  res
    .then((res) => {
      console.log(res);
      ipAdress.innerHTML = res.ip;
      region.innerHTML = res.location.region;
      timezone.innerHTML = `UTC ${res.location.timezone}`;
      isp.innerHTML = res.isp;
    })
    .catch((err) => console.error(err));
})();

function getGeoLocation() {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const regexp =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!regexp.test(input.value)) {
      alert("INVALID IP ADRESS");
      input.value = "";
      return;
    }

    const res = fetch(`${IP_API_URL}&ipAddress=${input.value}`)
      .then((res) => res.json())
      .catch((err) => console.error(err));
    res
      .then((res) => {
        console.log(res);
        ipAdress.innerHTML = res.ip;
        region.innerHTML = res.location.region;
        timezone.innerHTML = `UTC ${res.location.timezone}`;
        isp.innerHTML = res.isp;
      })
      .catch((err) => console.error(err));
  });
}

button.addEventListener("click", getGeoLocation());
