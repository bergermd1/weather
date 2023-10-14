window.onload = () => {
    processData('Lima', 3)
}


async function processData(query, days) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=c6ef69ffc86c43afb2b232327231310&q=${query}&days=${days}`, {mode: 'cors'});
    const weatherData = {};
    const hourlyData = [];
    
    const json = await response.json();
    console.log(json);

    json.forecast.forecastday.forEach((day, dayIndex) => {
        day.hour.forEach((hour, hourIndex) => {
            // console.log(json.forecast.forecastday[dayIndex]);
            hourlyData.push({
                    time: json.forecast.forecastday[dayIndex].hour[hourIndex].time,
                    tempC: json.forecast.forecastday[dayIndex].hour[hourIndex].temp_c,
                    tempF: json.forecast.forecastday[dayIndex].hour[hourIndex].temp_f,
                    isDay: json.forecast.forecastday[dayIndex].hour[hourIndex].is_day,
                    chanceOfRain: json.forecast.forecastday[dayIndex].hour[hourIndex].chance_of_rain,
                });
        });
    });

    console.log(hourlyData);

    // hourlyData

    // weatherData.max = json.forecast.forecastday[0].;
    // weatherData.condtionIcon = processIconPath(json.current.condition.icon);
    // weatherData.tempC = json.current.temp_c;
    // weatherData.tempF = json.current.temp_f;
    // weatherData.condition = json.current.condition.text;
    // weatherData.condtionIcon = processIconPath(json.current.condition.icon);
    // weatherData.tempC = json.current.temp_c;
    // weatherData.tempF = json.current.temp_f;
    
    // console.log(json);
    return hourlyData;
}

function processIconPath(str) {
    const start = str.indexOf('64x64');
    str = str.slice(start);
    return 'images/' + str;
}

// processData('Lima', 3).then(data => {
//     // console.log(data);
// })

// http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London