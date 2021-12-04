document.body.innerHTML=`<div class="container">
               <div class="row" id="header-row">
                     <div class="col-lg-6 col-md-12 col-sm-12 title-bar">
                      <a onclick="window.location.reload()"><h1 class="title"><i class="fas fa-cloud-sun-rain"></i>Weather4U</h1></a>
                       <h2 class="sub-title">Get updates on weather and forecast!<h2>
                      </div>
                       <div class="col-lg-6 col-md-12 col-sm-12">
                 <input type="search" onkeyup="enter(event)" id="search" placeholder="Search a Location..">
     <button type="button" onclick="getData(document.getElementById('search').value)" class="search"><i class="fas fa-search"></i></button>
                       </div>

              </div>
          </div>
         <div class="container">
               <div class="row" id="weather-details">


                </div>
             </div>`

//to trigger enter search with button click
function enter(event)
{
  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector(".search").click();
  }

}

//function to convert from unix time to Local Time
    function localTime(unix) {
      var date = new Date(unix * 1000);
      // Hours part from the timestamp
      var hours = date.getUTCHours();
      // Minutes part from the timestamp
      var minutes = date.getUTCMinutes();
      if (minutes >= 10)
        minutes = date.getUTCMinutes();
      else
        minutes = "0" + date.getUTCMinutes();

      var formattedTime = hours + ':' + minutes;
      return formattedTime;

    }
 //function to convert from unix Date to Local Date
    function localDate(unix) {
      var date = new Date(unix * 1000);
      var formattedDate = date.getUTCDate();
      var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      var formattedDay = date.getUTCDay();
      var formattedMonth = date.getUTCMonth() + 1;
      return `${days[formattedDay]},${formattedDate}/${formattedMonth}`;

    }
//get data from the server using async,await,fetch  and display it on the screen
async function getData(city,latitude,longitude) {
  
  if(city==="")
  {
     document.querySelector("#weather-details").innerHTML =`<h1 class="infoText">-Type in a city name-</h1>`
     return;
  }
document.querySelector("#weather-details").innerHTML =`<div class="loader"><h1 class="loading">Loading...</h1><div></div><div></div><div></div><div></div></div>`
  if (city===null)
    var response =
      await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c06dc9f82bcf0aeb3e875a71cb3f56a8&units=metric`)
  else
  var response =
      await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c06dc9f82bcf0aeb3e875a71cb3f56a8&units=metric`)

  const data = await response.json();
    if(data.cod=="404")
    {
      document.querySelector("#weather-details").innerHTML =`<h1 class="infoText">-No results found-</h1>`
      console.log(data.cod,data.message)
     return; 
    }
  if (city === null)
    var forecast_response =
      await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=c06dc9f82bcf0aeb3e875a71cb3f56a8&units=metric`)
  else
    var forecast_response =
      await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c06dc9f82bcf0aeb3e875a71cb3f56a8&units=metric`);
  const forecast = await forecast_response.json();

  //--------parameters to display current weather data
    const titleCase = (string) =>
      string.toLowerCase().split(",").map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    const temperature = Math.round(data.main.temp);
    const feels_like = Math.round(data.main.feels_like);
    const weather_main = data.weather.map((details) => details.main).join(",").toUpperCase();
    const weather_des = data.weather.map((details) => details.description).join(",");
    const icon = data.weather[0].icon;
    const unix = data.dt + data.timezone;


    const unixSunRise = data.sys.sunrise + data.timezone;
    const unixSunSet = data.sys.sunset + data.timezone;
    var formattedTime = localTime(unix);
    let sunRiseTime = localTime(unixSunRise);
    let sunSetTime = localTime(unixSunSet);
    let Humidity = data.main.humidity;
    let Visibility = (data.visibility / 1000).toFixed(2);
    let Pressure = data.main.pressure;
 //---------parameters to display forecast weather data
  var unixForecast = [];
  var temp = [];
  var main = [];
  var des = [];
  var humid = [];
  var icons = [];
  var vis = [];
  var pop = [];
  for (var i = 0; i < 6; i++) {
    unixForecast.push(forecast.city.timezone + forecast.list[i].dt);
    temp.push(Math.round(forecast.list[i].main.temp));
    main.push(forecast.list[i].weather[0].main);
    des.push(forecast.list[i].weather[0].description);
    humid.push(forecast.list[i].main.humidity);
    icons.push(forecast.list[i].weather[0].icon);
    vis.push((forecast.list[i].visibility/1000).toFixed(2));
    pop.push(Math.round(forecast.list[i].pop*100))

  }


  document.querySelector("#weather-details").innerHTML = `
<div class="weather">
              <div class="weather primary-container">
                           <div class="city-weather-details">
                            <h1 class="heading"><img class="city-icon" src="/city-icon.png"> ${data.name},${data.sys.country}</h1>
                            <p class="temp">${temperature}°<span class="celsius">C</span></p>
                            <p class="sub-head">Feels like: ${feels_like}°C</p>
                            <p class="sub-head time">Updated: ${formattedTime} Local Time</p>
                           </div>
                         <div class="weather-description">
                          <h1 class="sub-head main">${weather_main}</h1>
                          <p class="sub-head">Description: ${titleCase(weather_des)}</p>
                          <img src="icon/${icon}.png" alt="weather-icon" class="weather-icon">
                         </div>
                       <div class="sunrise">
                          <div>
                          <h1 class="sub-head time">${localDate(unixSunRise)}</h1>
                          </div>
                          <div>
                          <h1 class="sub-head"><img class="sunrise-icon" src="/sunrise.png"> Sunrise: ${sunRiseTime}</h1>
                          <h1 class="sub-head"><img class="sunset-icon" src="/sunset-icon.jpg"> Sunset: ${sunSetTime}</h1>
                          </div>

                        </div>
                          <div class="other">
                          <div>
                          <p class="sub-head">${Humidity}%</p>
                          <p class="sub-head">Humidity</p>
                          </div>
                          <div>
                          <p class="sub-head">${Visibility} km</p>
                          <p class="sub-head">Visibility</p>
                          </div>
                          <div>
                          <p class="sub-head">${Pressure} hPa</p>
                          <p class="sub-head">Pressure</p>
                          </div>
                          </div>
                          <div>
                          <button type="button" class="btn btn-dark btn-lg viewbtn btn${data.id}"
                              onclick="toggleForecast(${data.id})">View 3-Hour Forecast
                                              </button>
                          </div>

            </div>
            <div class="forecast-container${forecast.city.id} for" style="display:none">
                            <div>
                           <h1 class="sub-head time">${localDate(unixForecast[0])} ${localTime(unixForecast[0])}</h1>
                           <p class="temp foretemp">${temp[0]}°C</p>
                           <p class="temp foretemp">${main[0]}-${des[0]}</p>
                            <img src="icon/${icons[0]}.png" alt="weather-icon" class="for-icon">
                            <p class="foretemp">Humidity: ${humid[0]}%</p>
                            <p class="foretemp">Visibility: ${vis[0]}km</p>
                            <p class="foretemp">Chance of Rain: ${pop[0]}%</p>
                            </div>

                            <div>
                            <h1 class="sub-head time">${localDate(unixForecast[1])} ${localTime(unixForecast[1])}</h1>
                           <p class="temp foretemp">${temp[1]}°C</p>
                           <p class="temp foretemp">${main[1]}-${des[1]}</p>
                            <img src="icon/${icons[1]}.png" alt="weather-icon" class="for-icon">
                            <p class="foretemp">Humidity: ${humid[1]}%</p>
                            <p class="foretemp">Visibility: ${vis[1]}km</p>
                            <p class="foretemp">Chance of Rain: ${pop[1]}%</p>
                            </div>
                             <div>
                              <h1 class="sub-head time">${localDate(unixForecast[2])} ${localTime(unixForecast[2])}</h1>
                           <p class="temp foretemp">${temp[2]}°C</p>
                           <p class="temp foretemp">${main[2]}-${des[2]}</p>
                            <img src="icon/${icons[2]}.png" alt="weather-icon" class="for-icon">
                            <p class="foretemp">Humidity: ${humid[2]}%</p>
                            <p class="foretemp">Visibility: ${vis[2]}km</p>
                            <p class="foretemp">Chance of Rain: ${pop[2]}%</p>
                            </div>
                            <div>
                              <h1 class="sub-head time">${localDate(unixForecast[3])} ${localTime(unixForecast[3])}</h1>
                           <p class="temp foretemp">${temp[3]}°C </p>
                           <p class="temp foretemp">${main[3]}-${des[3]}</p>
                            <img src="icon/${icons[3]}.png" alt="weather-icon" class="for-icon">
                            <p class="foretemp">Humidity: ${humid[3]}%</p>
                            <p class="foretemp">Visibility: ${vis[3]}km</p>
                            <p class="foretemp">Chance of Rain: ${pop[3]}%</p>
                            </div>
                             <div>
                              <h1 class="sub-head time">${localDate(unixForecast[4])} ${localTime(unixForecast[4])}</h1>
                           <p class="temp foretemp">${temp[4]}°C</p>
                           <p class="temp foretemp">${main[4]}-${des[4]}</p>
                            <img src="icon/${icons[4]}.png" alt="weather-icon" class="for-icon">
                            <p class="foretemp">Humidity: ${humid[4]}%</p>
                            <p class="foretemp">Visibility: ${vis[4]}km</p>
                            <p class="foretemp">Chance of Rain: ${pop[4]}%</p>
                            </div>

                          </div>
     </div>

`
  document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x1200/?"+data.name+"')";
  
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
  getLocation();
function showPosition(position) {
  let lat=position.coords.latitude;
  let lon=position.coords.longitude;
  getData(null,lat,lon);
}

//toggling the forecast data with the button click using this function
function toggleForecast(id) {

  var block = document.querySelector(`.forecast-container${id}`);
  var btn = document.querySelector(`.btn${id}`);

  if (block.style.display === "none")
  {
    block.style.display = "flex";
    btn.innerText = "Hide 3-Hour Forecast";
  }
  else
  {
  block.style.display = "none";
    btn.innerText = "View 3-Hour Forecast";

  }
}
