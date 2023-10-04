import { DateTime } from 'luxon';
import { fetchWeatherData, getImagePathBasedOnCode } from './api';
import { convertDateToDayOfWeek, formatTime } from './dateUtils';

export async function changeWeatherDisplayData() {
  const searchInput = document.querySelector('.search-input');
  const weatherData = await fetchWeatherData(searchInput.value);

  if (weatherData !== null) {
    changeCurrentWeather(weatherData);
    changeTodayHourlyWeather(weatherData);
    changeCurrentForecastWeather(weatherData);
  }
}

function changeCurrentWeather(weatherData) {
  const weatherDisplay = document.querySelector('.current-weather-display');
  const city = weatherDisplay.querySelector('.city');
  const temperature = weatherDisplay.querySelector('.temperature');
  const forecast = weatherDisplay.querySelector('.forecast-condition');

  city.textContent = weatherData.location.name;
  temperature.textContent = `${weatherData.current.temp_c}°`;
  forecast.textContent = weatherData.current.condition.text;
}

function changeTodayHourlyWeather(weatherData) {
  const hourlyWeatherDisplay = document.querySelector('.today-hourly-weather');
  const [dateToday, timeNow] = weatherData.location.localtime.split(' ');
  const hourlyWeatherToday = weatherData.forecast.forecastday.find((item) => item.date === dateToday);
  const hours = hourlyWeatherToday.hour;

  clearDisplay(hourlyWeatherDisplay);

  hours.forEach((hour) => {
    const timeArray = hour.time.split(' ');
    const time = timeArray[timeArray.length - 1];
    hourlyWeatherDisplay.appendChild(createHourlyWeatherElement(time, hour.condition.code, hour.is_day, hour.temp_c));
  });

  console.log(`time now: ${timeNow}`);
}

function createHourlyWeatherElement(time, conditionCode, isDay, temperature) {
  const hourlyWeatherElement = document.createElement('div');
  hourlyWeatherElement.classList.add('hourly-weather');

  const timeElement = document.createElement('p');
  timeElement.classList.add('time');
  timeElement.textContent = formatTime(time);

  const weatherImageContainer = document.createElement('div');
  weatherImageContainer.classList.add('weather-image-container');

  const weatherImage = document.createElement('img');
  weatherImage.classList.add('weather-image');
  getImagePathBasedOnCode(conditionCode, isDay).then((response) => {
    weatherImage.src = response;
  });

  const temperatureElement = document.createElement('p');
  temperatureElement.classList.add('temperature');
  temperatureElement.textContent = temperature;

  weatherImageContainer.appendChild(weatherImage);
  hourlyWeatherElement.append(timeElement, weatherImageContainer, temperatureElement);
  return hourlyWeatherElement;
}

function changeCurrentForecastWeather(weatherData) {
  const forecastWeatherDisplay = document.querySelector('.forecast-weather-display');
  const forecastDays = weatherData.forecast.forecastday;

  // remove today's forecast
  forecastDays.shift();

  clearDisplay(forecastWeatherDisplay);
  forecastDays.forEach((forecastDay) => {
    forecastWeatherDisplay.appendChild(createForecastDayElement(forecastDay.date, forecastDay.day.maxtemp_c, forecastDay.day.condition.code));
  });

  console.log(forecastDays);
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
  temperatureElement.textContent = temperature;

  weatherImageContainer.appendChild(weatherImage);
  forecastDay.append(dayOfWeek, weatherImageContainer, temperatureElement);

  return forecastDay;
}

function clearDisplay(displayElement) {
  // const weatherDisplay = document.querySelector('.forecast-weather-display');

  if (displayElement === null) {
    return;
  }
  while (displayElement.hasChildNodes()) {
    displayElement.lastChild.remove();
  }
}
