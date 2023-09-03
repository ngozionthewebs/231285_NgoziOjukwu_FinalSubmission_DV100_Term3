const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY_HERE';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
            .then((res) => res.json())
            .then((data) => {
                showWeatherData(data);
            });
    });
}

function showWeatherData(data) {
    const temperature = data.current.temp;
    const weatherIcon = data.current.weather[0].icon;

    currentTempEl.innerHTML = `<div class="temp">${temperature}&#176;C</div>`;

    const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
    const weatherIconElement = document.createElement('img');
    weatherIconElement.setAttribute('src', weatherIconUrl);
    weatherIconElement.setAttribute('alt', 'Weather Icon');
    weatherIconElement.classList.add('main-icon');
    currentTempEl.appendChild(weatherIconElement);

    const currentStatus = data.current.weather[0].description;
    const currentStatusElement = document.createElement('div');
    currentStatusElement.classList.add('current-status');
    currentStatusElement.textContent = currentStatus;
    currentTempEl.appendChild(currentStatusElement);

    let otherDayForecast = '';
    data.daily.forEach((day, idx) => {
        if (idx !== 0) {
            otherDayForecast += `
                <div class="weather-forecast-item2">
                    <div class="time-of-day">${days[new Date(day.dt * 1000).getDay()]}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon" class="w-icon">
                    <div class="temp-of-day">${day.temp.day}&#176;C</div>
                </div>
            `;
        }
    });

    weatherForecastEl.innerHTML = otherDayForecast;
}
