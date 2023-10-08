export async function fetchWeatherData(searchInput) {
  try {
    // `https://api.weatherapi.com/v1/current.json?key=d965eb8a607d4371a5230012230310&q=${searchInput}`
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=d965eb8a607d4371a5230012230310&q=${searchInput}&days=8`);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}. Message: ${json.error.message}`);
    }

    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getImagePathBasedOnCode(code, day) {
  const response = await fetch('./json/weather_conditions.json');
  const json = await response.json();
  const iconObject = json.find((item) => item.code === code);
  const iconName = iconObject.icon;
  const dayString = day ? 'day' : 'night';
  const path = `./images/weather-icons/${dayString}/${iconName}.png`;
  return path;
}
