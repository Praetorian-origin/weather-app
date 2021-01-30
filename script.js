const weatherModule = (function () {
  let measureMod = "imperial";
  let symbolMeasure = "F°";
  let temp;
  let feelLikeTemp;

  const errHtmlElement = document.getElementById("err-msg");
  const cityHtmlElement = document.getElementById("city");
  const countryHtmlElement = document.getElementById("country");
  const real_temperatureHtmlElement = document.getElementById(
    "real_temperature"
  );
  const feellike_temperatureHtmlElement = document.getElementById(
    "feellike_temperature"
  );
  const descr_weatherHtmlElement = document.getElementById("descr_weather");
  const humidityHtmlElement = document.getElementById("humidity");
  const cityForm = document.getElementById("city-form");
  const cityInput = document.getElementById("city-input");
  const imgWeather = document.getElementById("imgWeather");
  const weatherInfoHtml = document.getElementById("weather-info");
  const loadingAnimation = document.getElementsByClassName("lds-dual-ring")[0];
  const checkbox = document.getElementById("check");

  
  checkbox.addEventListener("change", () => {
    if (measureMod === "metric") {
      measureMod = "imperial";
      symbolMeasure = "F°";
    } else {
      measureMod = "metric";
      symbolMeasure = "°C";
    }
    temp = convertTemp(temp, measureMod);
    feelLikeTemp = convertTemp(feelLikeTemp, measureMod);
    updateTempAttributes(temp, feelLikeTemp);
  });

  function convertTemp(temp, mode) {
    if (mode === "metric") {
      temp = ((temp - 32) * 5) / 9;
    } else {
      temp = (temp * 9) / 5 + 32;
    }
    temp = Math.round(temp * 100) / 100;
    return temp;
  }

  function updateTempAttributes(temp, feellikeTemp) {
    real_temperatureHtmlElement.textContent = temp + " " + symbolMeasure;
    feellike_temperatureHtmlElement.textContent =
      feelLikeTemp + " " + symbolMeasure;
  }

  function setLoadingActive() {
    weatherInfoHtml.classList.add("hidden");
    loadingAnimation.classList.remove("hidden");
  }

  function setLoadingInactive() {
    weatherInfoHtml.classList.remove("hidden");
    loadingAnimation.classList.add("hidden");
  }

  function updateWeather(town) {
    setLoadingActive();
    errHtmlElement.textContent = "";
    getWeatherData(town)
      .then((data) => {
        showWeather(processWeatherData(data));
        cityInput.value = "";
        cityInput.blur();
      })
      .catch((err) => {
        errHtmlElement.textContent = err;
      });
    setLoadingInactive();
  }

  cityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateWeather(cityInput.value);
  });

  async function getWeatherData(town) {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${town}&units=${measureMod}&APPID=d4534e8676f9de20faa31393cc154ad3`,
      {
        mode: "cors",
      }
    );
    if (response.status == "200") {
      return response.json();
    } else {
      throw new Error("country not found");
    }
  }

  function processWeatherData(jsonWeatherData) {
    // wind, weahter, city, temperature
    return {
      city: jsonWeatherData.name,
      country: jsonWeatherData.sys.country,
      real_temperature: jsonWeatherData.main.temp,
      feellike_temperature: jsonWeatherData.main.feels_like,
      descr_weather: jsonWeatherData.weather[0].description,
      humidity: jsonWeatherData.main.humidity,
      icon: jsonWeatherData.weather[0].icon,
    };
  }

  const showWeather = (weatherData) => {
    cityHtmlElement.textContent = weatherData.city;
    countryHtmlElement.textContent = weatherData.country;
    descr_weatherHtmlElement.textContent = weatherData.descr_weather;
    humidityHtmlElement.textContent = "Humidity: " + weatherData.humidity;

    temp = weatherData.real_temperature;
    feelLikeTemp = weatherData.feellike_temperature;
    updateTempAttributes(temp, feelLikeTemp);

    imgWeather.src = `http://openweathermap.org/img/wn/${weatherData.icon}@4x.png`;
  };

  updateWeather("London");
})();
