/*------------------------------------------------------------
|Name: Damian Owen                                           |
|Teacher: Ben Burchfield                                     |
|Class: CSC 3100 Web Design                                  |
|Date: 24 Feb 2025                                           |
|Assignment details: app.js file for my Weather application. |
------------------------------------------------------------*/

// Start function to get the users location:
function getUserLocation(){
    //confirms geolocation is in the navigator:
    if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) =>{
            let lat = parseFloat(position.coords.latitude)
            let lon = parseFloat(position.coords.longitude)
            getWeatherByCoordinates(lat,lon)
        
        }, 
        //if navigator has an error:
        (error)=>{
            //data the user will see if they don't have location access on:
            document.getElementById("cityName").innerHTML ="Location Access Denied"
            document.getElementById("temperature").innerHTML ="--°"
            document.getElementById("humidity").innerHTML ="--%"
            document.getElementById("weatherDescription").innerHTML ="Allow location access in order to see your area's weather conditions."
            document.getElementById("weatherIcon").className="bi bi-exclamation-circle text-danger"
        });
    } else {
        document.getElementById("cityName").innerHTML = "Geolocation is not supported.";
    }
}
//End function to get the users location

//Start function to fetch City and State:
async function getCityAndState(lat,lon) {
    lat = parseFloat(lat)
    lon = parseFloat(lon)
    const city = await fetch(`https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
    const cityData = await city.json()
    const cityName = cityData.city + ', '+ cityData.principleSubdivision
    document.getElementById("cityName").innerHTML = cityName
}
//End function to fetch City and State

//Start function to fetch Weather based on coordinates:
async function getWeatherByCoordinates(lat,lon){
    try{
        lat = parseFloat(lat)
        lon = parseFloat(lon)
        //fetches city name:
        const geo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`)
        const geoData =await geo.json()

        //Fetches Weather data:
        const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`)
        const weatherData = await weather.json()
        console.log(weatherData)
        const temp = weatherData.current.temperature_2m
        const humidity = weatherData.current.relative_humidity_2m
        const weatherCode = weatherData.current.weather_code

        //Fetches the weather description and the weather icon
        const weatherDescription= getWeatherDescription(weatherCode)
        const icon = getWeatherIcon(weatherCode)

        //Update the UI with the gathered data:
        document.getElementById("temperature").innerHTML = `$(temp)℃`
        document.getElementById("humidity").innerHTML = `$(humidity)%`
        document.getElementById("weatherDescription").innerHTML = weatherDescription

        

    }
}

//weather icons gathered from bootstrap
function getWeatherIcon(code) {
    const weatherIcons ={
        0: "bi-brightness-high",
        1: "bi-cloud-sun",
        2: "bi-cloud",
        3: "bi-clouds",
        45: "bi-cloud-fog2",
        48: "bi-cloud-fog",
        51: "bi-cloud-drizzle",
        53: "bi-cloud-drizzle",
        55: "bi-cloud-drizzle",
        61: "bi-cloud-rain",
        63: "bi-cloud-rain-heavy",
        65: "bi-cloud-rain-heavy",
        71: "bi-cloud-snow",
        73: "bi-cloud-snow",
        75: "bi-cloud-snow",
        77: "bi-snow",
        80: "bi-cloud-rain",
        81: "bi-cloud-rain-heavy",
        82: "bi-cloud-rain-heavy",
        85: "bi-cloud-snow",
        86: "bi-cloud-snow",
        95: "bi-cloud-lightning",
        96: "bi-cloud-lightning-rain",
        99: "bi-cloud-lightning-rain",
    }
    return weatherIcons[code]
}

//function to get weather descriptions based on the weather codes
function getWeatherDescription(code){
    const weatherDescriptions = {
        0: "Clear Sky",
        1: "Mostly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Dense Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Heavy Drizzle",
        61: "Light Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        71: "Light Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        77: "Snow Grains",
        80: "Showers",
        81: "Heavy Showers",
        82: "Violent Showers",
        85: "Snow Showers",
        86: "Heavy Snow Showers",
        95: "Thunderstorms",
        96: "Rainy Thunderstorms",
        99: "Severe Thunderstorms",
    }
    return weatherDescriptions[code]
}

//Fetch the weather conditions when the page is loaded
document.addEventListener("DOMContentLoaded", getUserLocation)

//references for easy C&P:
//https://open-meteo.com/en/docs#latitude=${lat}&longitude=${lon}