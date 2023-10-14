let weatherData = '';

window.onload = () => {
    // const weatherData = processData('Lima', 3);
    processData('Lima', 3).then((processedData) => {
            weatherData = processedData;
            console.log(weatherData);
            document.querySelector('body').appendChild(getHeader(weatherData.locationData));
            document.querySelector('body').appendChild(processHTML(weatherData));
        }
    );
}

async function processData(query, days) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=c6ef69ffc86c43afb2b232327231310&q=${query}&days=${days}`, {mode: 'cors'});
    const weatherData = {};
    const locationData = {};
    const dailyData = [];
    const hourlyData = [];
    
    const json = await response.json();
    console.log(json);

    locationData.country = json.location.country;
    locationData.region = json.location.region;

    json.forecast.forecastday.forEach((day, dayIndex) => {
        dailyData.push({
            conditionText: json.forecast.forecastday[dayIndex].day.condition.text,
            conditionIcon: processIconPath(json.forecast.forecastday[dayIndex].day.condition.icon),
            minTempF: json.forecast.forecastday[dayIndex].day.mintemp_f,
            minTempC: json.forecast.forecastday[dayIndex].day.mintemp_c,
            maxTempF: json.forecast.forecastday[dayIndex].day.maxtemp_f,
            maxTempC: json.forecast.forecastday[dayIndex].day.maxtemp_c,
        })
        
        day.hour.forEach((hour, hourIndex) => {
            hourlyData.push({
                time: json.forecast.forecastday[dayIndex].hour[hourIndex].time,
                tempC: json.forecast.forecastday[dayIndex].hour[hourIndex].temp_c,
                tempF: json.forecast.forecastday[dayIndex].hour[hourIndex].temp_f,
                isDay: json.forecast.forecastday[dayIndex].hour[hourIndex].is_day,
                chanceOfRain: json.forecast.forecastday[dayIndex].hour[hourIndex].chance_of_rain,
            });
        });
    });

    weatherData.locationData = locationData;
    weatherData.dailyData = dailyData;
    weatherData.hourlyData = hourlyData;

    return weatherData;
}

function processIconPath(str) {
    const start = str.indexOf('64x64');
    str = str.slice(start);
    return 'images/' + str;
}

function getHeader(locationData) {
    const header = document.createElement('div');
    header.classList.add('header');
    header.textContent = `Local weather for ${locationData.region}, ${locationData.country}`
    return header;
}

function processHTML(data) {
    // data.dailyData;
    // data.hourlyData;

    const container = document.createElement('div');
    container.classList.add('container');

    data.dailyData.forEach((day, dayIndex) => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        dayCard.textContent = day.conditionText;
        /////add hour elements here
        data.hourlyData
        /////
        container.appendChild(dayCard);
    });

    return container;
}