import { fetchWeatherData, getImagePathBasedOnCode } from './api';
import { convertDateToDayOfWeek, formatTimeHourOnly } from './dateUtils';
import { getTemperatureUnitLS, setPreviousLocationLS } from './localStorage';

const currentWeatherTemps = {};
const hourlyWeatherTemps = {};
const forecastWeatherTemps = {};
const additionalWeatherInfoTemps = {};

export async function changeWeatherDisplayData(searchInputValue) {
  const weatherData = await fetchWeatherData(searchInputValue);
  const temperatureUnit = getTemperatureUnitLS();

  if (weatherData === null) {
    displaySearchError();
    return;
  }

  if (weatherData !== null) {
    hideSearchError();
    setPreviousLocationLS(searchInputValue);
    changeCurrentWeather(weatherData, temperatureUnit);
    changeTodayHourlyWeather(weatherData, temperatureUnit);
    changeCurrentForecastWeather(weatherData, temperatureUnit);
    changeAdditionalWeatherInfo(weatherData, temperatureUnit);
  }
}

function changeCurrentWeather(weatherData, temperatureUnit) {
  const weatherDisplay = document.querySelector('.current-weather-display');
  const city = weatherDisplay.querySelector('.city');
  const temperature = weatherDisplay.querySelector('.temperature');
  const temperatureValue = temperature.querySelector('.temperature-value');
  const forecast = weatherDisplay.querySelector('.forecast-condition');
  currentWeatherTemps.temp_c = weatherData.current.temp_c;
  currentWeatherTemps.temp_f = weatherData.current.temp_f;

  city.textContent = weatherData.location.name;
  temperatureValue.textContent = `${weatherData.current[temperatureUnit]}`;
  forecast.textContent = weatherData.current.condition.text;
}

function changeTodayHourlyWeather(weatherData, temperatureUnit) {
  const hourlyWeatherDisplay = document.querySelector('.today-hourly-weather .weather-info');
  const [dateToday, timeNow] = weatherData.location.localtime.split(' ');
  const hourlyWeatherToday = weatherData.forecast.forecastday.find((item) => item.date === dateToday);
  const hours = hourlyWeatherToday.hour;
  const celsius = [];
  const fahrenheit = [];

  clearDisplay(hourlyWeatherDisplay);

  hours.forEach((hour) => {
    const timeArray = hour.time.split(' ');
    const time = timeArray[timeArray.length - 1];
    hourlyWeatherDisplay.appendChild(createHourlyWeatherElement(time, hour.condition.code, hour.is_day, hour[temperatureUnit]));

    celsius.push(hour.temp_c);
    fahrenheit.push(hour.temp_f);
  });

  hourlyWeatherTemps.temp_c = [...celsius];
  hourlyWeatherTemps.temp_f = [...fahrenheit];
}

function createHourlyWeatherElement(time, conditionCode, isDay, temperature) {
  const hourlyWeatherElement = document.createElement('div');
  hourlyWeatherElement.classList.add('hourly-weather');
  const [timeHour] = time.split(':');
  hourlyWeatherElement.classList.add(`hour-${Number(timeHour)}`);

  const timeElement = document.createElement('p');
  timeElement.classList.add('time');
  timeElement.textContent = formatTimeHourOnly(time);

  const weatherImageContainer = document.createElement('div');
  weatherImageContainer.classList.add('weather-image-container');

  const weatherImage = document.createElement('img');
  weatherImage.classList.add('weather-image');
  getImagePathBasedOnCode(conditionCode, isDay).then((response) => {
    weatherImage.src = response;
  });

  const temperatureElement = document.createElement('p');
  temperatureElement.classList.add('temperature');

  const temperatureValue = document.createElement('span');
  temperatureValue.classList.add('temperature-value');
  temperatureValue.textContent = temperature;

  const degreeSymbol = document.createElement('span');
  degreeSymbol.classList.add('degree-symbol');
  degreeSymbol.textContent = '°';

  temperatureElement.append(temperatureValue, degreeSymbol);
  weatherImageContainer.appendChild(weatherImage);
  hourlyWeatherElement.append(timeElement, weatherImageContainer, temperatureElement);

  return hourlyWeatherElement;
}

function changeCurrentForecastWeather(weatherData, temperatureUnit) {
  const forecastWeatherDisplay = document.querySelector('.forecast-weather-display .weather-info');
  const forecastDays = weatherData.forecast.forecastday;
  // remove today's forecast
  const forecastDaysShifted = [...forecastDays];
  forecastDaysShifted.shift();
  const maxtemp = `max${temperatureUnit}`;
  const celsius = [];
  const fahrenheit = [];

  clearDisplay(forecastWeatherDisplay);
  forecastDaysShifted.forEach((forecastDay) => {
    forecastWeatherDisplay.appendChild(createForecastDayElement(forecastDay.date, forecastDay.day[maxtemp], forecastDay.day.condition.code));
    celsius.push(forecastDay.day.maxtemp_c);
    fahrenheit.push(forecastDay.day.maxtemp_f);
  });

  forecastWeatherTemps.temp_c = [...celsius];
  forecastWeatherTemps.temp_f = [...fahrenheit];
}

function createForecastDayElement(date, temperature, conditionCode) {
  const forecastDay = document.createElement('div');
  forecastDay.classList.add('forecast-day');

  const dayOfWeek = document.createElement('p');
  dayOfWeek.classList.add('day-of-week');
  dayOfWeek.textContent = convertDateToDayOfWeek(date);

  const weatherImageContainer = document.createElement('div');
  weatherImageContainer.classList.add('weather-image-container');

  const weatherImage = document.createElement('img');
  weatherImage.classList.add('weather-image');
  getImagePathBasedOnCode(conditionCode, true).then((response) => {
    weatherImage.src = response;
  });

  const temperatureElement = document.createElement('p');
  temperatureElement.classList.add('temperature');

  const temperatureValue = document.createElement('span');
  temperatureValue.classList.add('temperature-value');
  temperatureValue.textContent = temperature;

  const degreeSymbol = document.createElement('span');
  degreeSymbol.classList.add('degree-symbol');
  degreeSymbol.textContent = '°';

  temperatureElement.append(temperatureValue, degreeSymbol);
  weatherImageContainer.appendChild(weatherImage);
  forecastDay.append(dayOfWeek, weatherImageContainer, temperatureElement);

  return forecastDay;
}

export function changeTemperatureUnit(temperatureUnit) {
  changeCurrentWeatherUnit(temperatureUnit);
  changeTodayHourlyWeatherUnit(temperatureUnit);
  changeForecastWeatherUnit(temperatureUnit);
  changeAdditionalWeatherInfoUnits(temperatureUnit);
}

function changeCurrentWeatherUnit(temperatureUnit) {
  const currentWeatherTemperatureValue = document.querySelector('.current-weather-display .temperature-value');
  currentWeatherTemperatureValue.textContent = currentWeatherTemps[temperatureUnit];
}

function changeTodayHourlyWeatherUnit(temperatureUnit) {
  const hourlyWeatherTemperatureValues = document.querySelectorAll('.today-hourly-weather .hourly-weather .temperature-value');
  [...hourlyWeatherTemperatureValues].forEach((temperatureValue, i) => {
    temperatureValue.textContent = hourlyWeatherTemps[temperatureUnit][i];
  });
}

function changeForecastWeatherUnit(temperatureUnit) {
  const forecastTemperatureValues = document.querySelectorAll('.forecast-weather-display .temperature .temperature-value');
  [...forecastTemperatureValues].forEach((temperatureValue, i) => {
    temperatureValue.textContent = forecastWeatherTemps[temperatureUnit][i];
  });
}

function changeAdditionalWeatherInfoUnits(temperatureUnit) {
  const additionalWeatherInfo = document.querySelector('.additional-weather-info');

  [...additionalWeatherInfo.children].forEach((item) => {
    const infoHeader = item.querySelector('h1');
    const propertyName = infoHeader.textContent.toLowerCase().replaceAll(' ', '_');
    if (Object.prototype.hasOwnProperty.call(additionalWeatherInfoTemps, propertyName)) {
      const infoValue = item.querySelector('p');
      infoValue.textContent = additionalWeatherInfoTemps[propertyName][temperatureUnit];
    }
  });
}

function createSingleAdditionalWeatherInfo(infoName, infoValue, unitValue = '', spaceBetween = false) {
  const container = document.createElement('div');
  container.classList.add('weather-info');
  const infoClassName = infoName.toLowerCase().replaceAll(' ', '-');
  container.classList.add(infoClassName);

  const header = document.createElement('h1');
  header.textContent = infoName;

  const value = document.createElement('p');
  if (unitValue !== '' && spaceBetween) {
    value.textContent = `${infoValue} ${unitValue}`;
  } else if (unitValue !== '' && !spaceBetween) {
    value.textContent = `${infoValue}${unitValue}`;
  } else {
    value.textContent = infoValue;
  }

  container.append(header, value);
  return container;
}

function changeAdditionalWeatherInfo(weatherData, temperatureUnit) {
  const additionalWeatherInfo = document.querySelector('.additional-weather-info');
  const windSpeedUnit = temperatureUnit === 'temp_c' ? 'km/h' : 'mph';
  const windSpeedProperty = temperatureUnit === 'temp_c' ? 'wind_kph' : 'wind_mph';
  const feelsLikeTempProperty = temperatureUnit === 'temp_c' ? 'feelslike_c' : 'feelslike_f';

  clearDisplay(additionalWeatherInfo);

  const feelsLikeValues = {};
  feelsLikeValues.temp_c = `${weatherData.current.feelslike_c}°`;
  feelsLikeValues.temp_f = `${weatherData.current.feelslike_f}°`;

  const windSpeedValues = {};
  windSpeedValues.temp_c = `${weatherData.current.wind_kph} km/h`;
  windSpeedValues.temp_f = `${weatherData.current.wind_mph} mph`;

  additionalWeatherInfoTemps.feels_like = feelsLikeValues;
  additionalWeatherInfoTemps.wind_speed = windSpeedValues;

  const feelsLikeValue = weatherData.current[feelsLikeTempProperty];
  const feelsLike = createSingleAdditionalWeatherInfo('Feels Like', feelsLikeValue, '°');
  const humidityValue = weatherData.current.humidity;
  const humidity = createSingleAdditionalWeatherInfo('Humidity', humidityValue, '%');
  const chanceOfRainValue = weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
  const chanceOfRain = createSingleAdditionalWeatherInfo('Chance Of Rain', chanceOfRainValue, '%');
  const windSpeedValue = weatherData.current[windSpeedProperty];
  const windSpeed = createSingleAdditionalWeatherInfo('Wind Speed', windSpeedValue, windSpeedUnit, true);

  additionalWeatherInfo.append(feelsLike, humidity, chanceOfRain, windSpeed);
}

function displaySearchError() {
  const searchError = document.querySelector('.search-error');
  const searchInput = document.querySelector('.search-input');

  searchInput.classList.add('error');
  searchError.classList.add('active');
  searchError.textContent = 'Location not found. Please search for another location.';
}

function hideSearchError() {
  const searchError = document.querySelector('.search-error');
  const searchInput = document.querySelector('.search-input');
  searchInput.classList.remove('error');
  searchError.classList.remove('active');
  searchError.textContent = '';
}

function clearDisplay(displayElement) {
  if (displayElement === null) {
    return;
  }
  while (displayElement.hasChildNodes()) {
    displayElement.lastChild.remove();
  }
}
