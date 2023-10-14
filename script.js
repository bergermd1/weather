let weatherData = '';

window.onload = () => {
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
    
    const json = await response.json();
    console.log(json);

    locationData.country = json.location.country;
    locationData.region = json.location.region;

    json.forecast.forecastday.forEach((day, dayIndex) => {
        const currentDay = json.forecast.forecastday[dayIndex];
        dailyData.push({
            conditionText: currentDay.day.condition.text,
            conditionIcon: processIconPath(currentDay.day.condition.icon),
            minTempF: currentDay.day.mintemp_f,
            minTempC: currentDay.day.mintemp_c,
            maxTempF: currentDay.day.maxtemp_f,
            maxTempC: currentDay.day.maxtemp_c,
            hourlyData: [],
        })

        day.hour.forEach((hour, hourIndex) => {
            dailyData[dayIndex].hourlyData.push({
                time: currentDay.hour[hourIndex].time,
                tempC: currentDay.hour[hourIndex].temp_c,
                tempF: currentDay.hour[hourIndex].temp_f,
                isDay: currentDay.hour[hourIndex].is_day,
                chanceOfRain: currentDay.hour[hourIndex].chance_of_rain,
            });
        });
    });

    weatherData.locationData = locationData;
    weatherData.dailyData = dailyData;

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

function processHTML(allData) {
    const container = document.createElement('div');
    container.classList.add('container');

    allData.dailyData.forEach((day, dayIndex) => {
        const dayContainer = document.createElement('div');
        dayContainer.classList.add('day-container');
        container.appendChild(dayContainer);

        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        dayCard.textContent = day.conditionText;
        dayContainer.appendChild(dayCard);
        
        const hourCardContainer = document.createElement('div');
        hourCardContainer.classList.add('hour-card-container');
        dayContainer.appendChild(hourCardContainer);
        
        /////add hour elements here
        // for (property in allData.dailyData[dayIndex].hourlyData) {
        allData.dailyData[dayIndex].hourlyData.forEach(hour => {
            const hourCard = document.createElement('div');
            hourCard.classList.add('hour-card');

            // const time

            // hour.

            for (property in hour) {
                hourCard.innerHTML += `${property}: ${hour[property]}<br>`;
            }

            hourCardContainer.appendChild(hourCard);
        });
        /////
    });

    return container;
}