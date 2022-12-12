// html elements
const input = document.querySelector(".input");
const detect_btn = document.querySelector(".detect-btn");
const details_area = document.querySelector(".details-area");
const temp = document.querySelector(".temp");
const city_name = document.querySelector(".city-name");
const feels_like = document.querySelector(".feels-like");
const humidity = document.querySelector(".humidity");
const rep = document.querySelector(".reporter");


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

function fetchData() {
  fetch(api)
    .then((res) => res.json())
    .then((result) => {
      details(result);
      fetchUser();
    });
}

function fetchUser() {
  randomReporter = Math.floor(Math.random() * 10) + 1
  fetch(`https://jsonplaceholder.typicode.com/users/${randomReporter}`)
  .then(response => response.json())
  .then(json => reporterDetails(json.name))
}

function details(info) { 
  if (info.cod == "404") {
    alert(`${input.value} isn't a valid name`);
    return;
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
  temperature= feelsLikeTemp
  if(temperature >=80){
    reporterResponse = 'it is hot out today. Wear shorts.'
  } else if(temperature < 80 && temperature >= 65){
    reporterResponse = 'it is warm out today. Wear short sleeves.'
  } else if(temperature < 65 && temperature >=45){
    reporterResponse = 'it is cool out today. Wear Fleece.'
  } else if(temperature < 45 && temperature >= 25){
    reporterResponse = 'it is cold out today. Wear a light to medium coat.'
  } else {
    reporterResponse = 'it is freezing out today. Wear a winter jacket.'
  }
  rep.innerHTML = `Reporter ${reporter} says ${reporterResponse}`

}


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
  alert(error.message);
}
