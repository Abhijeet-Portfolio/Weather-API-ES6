/* Author: 

*/

let city = document.querySelector('.city');
let cities;
let error = document.querySelector('.form-group span');
let form = document.querySelector('form');
let find = document.querySelector('.find');
let display = document.querySelector('.display');
let capitalize = ([ first, ...rest ], locale = navigator.language) => first.toLocaleUpperCase(locale) + rest.join('');

// remove error
let removeError = () => {
    if(error.classList.contains('error')) {
        error.classList.remove('error');
    }
}

// form reset
document.querySelector('.clear').addEventListener('click', (e) => {
    e.preventDefault();
    form.reset();
    removeError();
});

// validate Input
city.addEventListener('input', () => {
    let textRegax = /([a-zA-Z\s]){1,30}$/;
    let noNumberRegax = /[^a-zA-Z\s]/gi;
    if (city.value == null || city.value == '') {
        removeError();
    }
    else if(!textRegax.test(city.value)) {
        error.classList.add('error');
        error.textContent = "Must contains only alphabets";
        city.value = city.value.replace(noNumberRegax,'');
    }
    else {removeError();}
});

// form find
find.addEventListener('click',(e) => {
    e.preventDefault();
    if(city.value === '' || city.value === null) {
        error.classList.add('error');
        error.textContent = 'This field is required!'
        if(display.classList.contains('show')) {
            display.classList.remove('show');
            bgChange('');
        }
    }
    else {getWeather(city.value);}
});

fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bcities.json')
.then( Response => Response.json())
.then( data => cities = data[102].cities);

// fetch('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.json')
// .then(data => data.json())
// .then(data => cities = data.India);

// Get weather
let getWeather = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8e08f2c66d3abadc4ad7e3b408caf570&units=metric`)
    .then(reponse => reponse.json())
    .then(data => {
        if(data.cod === 200) {
            verifyCity(city,data);
            removeError();
        }
        else { throw data;}
    })
    .catch(err => {
        error.classList.add('error');
        error.textContent = 'City not found';
        if(display.classList.contains('show')) {
            display.classList.remove('show');
            bgChange('');
        }
    });
}

// verify city
let verifyCity = (city,data) => {    
    for(let i = 0; i <= cities.length; i++) {
        if ((cities[i].name) === (capitalize(city))) {
            displayWeather(data);
            return;
        }
    }
}

// display weather of city
let displayWeather = data => {
    display.classList.add('show');
    display.innerHTML = 
    `<div>
        <h2>${data.name}</h2>
        <h3>${data.main.temp} &deg;C</h3>
        <h4>Wind speed: ${data.wind.speed} mi/h</h4>
    </div>
    <div class="status">
        <figure>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}">
        </figure>
        <h5>${data.weather[0].main}</h5>
    </div>`
    bgChange(data.weather[0].main);  
}

// backgroung change
let bgChange = weather => document.body.style.backgroundImage = `url("assets/images/${weather}.jpg")`;
