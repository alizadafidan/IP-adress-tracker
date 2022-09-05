const API_KEY = "at_GG51CjGvaswB8AyJiH1RTrcp11xNj"; //IP Geolocation API
const IP_API_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;
const MAP_BOX_API_URL =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
const MAP_BOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoid2FzaGluZ3RvbjI5OSIsImEiOiJja2dzaTNkMjEwNDM0MzFvZnNnNTNxNjNvIn0.c0RymMFd_Q9NADrTGZh7wg";

//Selecting elements
const button = document.querySelector(".header-button");
const ipAdress = document.querySelector(".header-ip-adress");
const region = document.querySelector(".header-ip-location");
const timezone = document.querySelector(".header-ip-timezone");
const isp = document.querySelector(".header-ip-isp");
const form = document.querySelector(".header-form");
const input = document.querySelector(".header-input");

//Leaflet

const greenIcon = L.icon({
  iconUrl: "images/icon-location.svg",

  iconSize: [30, 35], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

const mymap = L.map("map-id");
const marker = L.marker([0, 0], { icon: greenIcon }).addTo(mymap);

function displayMap(lat, lng) {
  mymap.setView([lat, lng], 13);
  marker.setLatLng([lat, lng]);

  L.tileLayer(MAP_BOX_API_URL, {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: MAP_BOX_ACCESS_TOKEN,
  }).addTo(mymap);
  //   marker.bindPopup(`<b>${region.textContent}</b>`).openPopup();
}

(function () {
  const res = fetch(`${IP_API_URL}`, { method: "GET" })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  res
    .then((res) => {
      const lat = res.location.lat;
      const lng = res.location.lng;
      console.log(res);
      ipAdress.innerHTML = res.ip;
      region.innerHTML = res.location.city;
      timezone.innerHTML = `UTC ${res.location.timezone}`;
      isp.innerHTML = res.isp;
      displayMap(lat, lng);
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
        const lat = res.location.lat;
        const lng = res.location.lng;
        console.log(res);
        ipAdress.innerHTML = res.ip;
        region.innerHTML = res.location.city;
        timezone.innerHTML = `UTC ${res.location.timezone}`;
        isp.innerHTML = res.isp;
        displayMap(lat, lng);
      })
      .catch((err) => console.error(err));
  });
}

button.addEventListener("click", getGeoLocation());
