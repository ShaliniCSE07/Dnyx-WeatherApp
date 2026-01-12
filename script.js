
const API_KEY = "27a935df262069b5f182e621e90127fb";

let currentTempC = null;
let isCelsius = true;
let currentCity = "";
let currentDescription = "";
let currentHumidity = "";

function getWeather() {
  const city = document.getElementById("cityInput").value;
  const weatherDiv = document.getElementById("weatherResult");

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  weatherDiv.innerHTML = "Loading...";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        weatherDiv.innerHTML = `<p class="text-red-500">City not found</p>`;
        return;
      }

      // Current weather data
      currentTempC = data.main.temp;
      isCelsius = true;
      currentCity = data.name;
      currentDescription = data.weather[0].description;
      currentHumidity = data.main.humidity;

      displayWeather();

      // displaying the conversion button
      document.getElementById("toggleContainer").classList.remove("hidden");
      document.querySelector("#toggleContainer button").innerText = "Show in Fahrenheit";

      // Fetching 5-day forecast
      fetchForecast(city);
    })
    .catch(error => {
      weatherDiv.innerHTML = "Something went wrong";
      console.log(error);
    });
}


function displayWeather() {
  const weatherDiv = document.getElementById("weatherResult");

  const tempText = isCelsius
    ? `${currentTempC}°C`
    : `${celsiusToFahrenheit(currentTempC)}°F`;

  weatherDiv.innerHTML = `
    <h2 class="text-xl font-bold">${currentCity}</h2>
    <p class="text-lg">🌡 ${tempText}</p>
    <p class="capitalize">☁ ${currentDescription}</p>
    <p>💧 Humidity: ${currentHumidity}%</p>
  `;
}

function fetchForecast(city) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "Loading...";

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      forecastDiv.innerHTML = "";

      const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));

      dailyForecast.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const tempC = day.main.temp;
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const description = day.weather[0].description;

        const card = document.createElement("div");
        card.classList.add(
          "bg-blue-100",
          "p-2",
          "rounded",
          "text-center",
          "flex",
          "flex-col",
          "items-center",
          "min-w-[80px]"
        );

        // Store Celsius temp for toggle
        card.dataset.tempC = tempC;

        card.innerHTML = `
          <p class="font-bold text-sm">${date}</p>
          <img src="${icon}" alt="weather icon" class="mx-auto">
          <p class="capitalize text-sm">${description}</p>
          <p class="text-sm font-semibold">${tempC}°C</p>
        `;

        forecastDiv.appendChild(card);
      });
    })
    .catch(error => {
      forecastDiv.innerHTML = "Failed to load forecast";
      console.log(error);
    });
}

function toggleTemp() {
  if (currentTempC === null) return;

  isCelsius = !isCelsius;
  displayWeather();

  const forecastDiv = document.getElementById("forecast");
  forecastDiv.childNodes.forEach(card => {
    const tempC = parseFloat(card.dataset.tempC);
    const tempText = isCelsius
      ? `${tempC}°C`
      : `${celsiusToFahrenheit(tempC)}°F`;
    card.querySelector("p:last-child").innerText = tempText;
  });

  document.querySelector("#toggleContainer button").innerText =
    isCelsius ? "Show in Fahrenheit" : "Show in Celsius";
}

function celsiusToFahrenheit(c) {
  return ((c * 9) / 5 + 32).toFixed(1);
}

