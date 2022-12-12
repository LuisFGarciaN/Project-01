// html elements
const input = document.querySelector(".input");
const detect_btn = document.querySelector(".detect-btn");
const details_area = document.querySelector(".details-area");
const temp = document.querySelector(".temp");
const city_name = document.querySelector(".city-name");
const feels_like = document.querySelector(".feels-like");
const humidity = document.querySelector(".humidity");
const rep = document.querySelector(".reporter");
const infoTxt = document.querySelector(".info-txt");

// API ID here
let api;
let apiId = "6a6ee6b3ca4d66a2761e76f3627ca518";
let temperature;
let feelsLikeTemp;

input.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && input.value != "") {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=imperial&appid=${apiId}`;
    fetchData();
  }
});
detect_btn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Oops!! Sorry try again.");
  }
});
function onSuccess(pos) {
  const { latitude, longitude } = pos.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiId}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

// fetching api
function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => {
      details(result);
      fetchUser();
    });
}
// reporter API
function fetchUser() {
  randomReporter = Math.floor(Math.random() * 10) + 1;
  fetch(`https://jsonplaceholder.typicode.com/users/${randomReporter}`)
    .then((response) => response.json())
    .then((json) => reporterDetails(json.name));
}

function details(info) {
  infoTxt.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoTxt.innerText = `${input.value} isn't a valid name`;
  } else {
    infoTxt.classList.remove("pending", "error");
  }
  if (details_area.classList.contains("inactive")) {
    details_area.classList.replace("inactive", "active");
  }
  temperature = parseInt(info.main.temp);
  feelsLikeTemp = parseInt(info.main.feels_like);

  temp.innerHTML = `${temperature}°F`;
  feels_like.innerHTML = `${feelsLikeTemp}°F<br>feels like  `;
  humidity.innerHTML = `${info.main.humidity}%<br> humidity`;
  city_name.innerHTML = `${info.name}, ${info.sys.country}`;
}

function reporterDetails(reporter) {
  //TODO write if logic for temperature change strings
  let reporterResponse;
  temperature = feelsLikeTemp;
  if (temperature >= 80) {
    reporterResponse = "<br>it is hot out today.<br> Wear shorts.";
  } else if (temperature < 80 && temperature >= 65) {
    reporterResponse = "<br>it is warm out today.<br> Wear short sleeves.";
  } else if (temperature < 65 && temperature >= 45) {
    reporterResponse = "<br>it is cool out today. <br>Wear Fleece.";
  } else if (temperature < 45 && temperature >= 25) {
    reporterResponse =
      "<br>it is cold out today.<br> Wear a light to medium coat.";
  } else {
    reporterResponse =
      "<br>it is freezing out today.<br> Wear a winter jacket.";
  }
  rep.innerHTML = `Reporter ${reporter} says ${reporterResponse}`;
}
