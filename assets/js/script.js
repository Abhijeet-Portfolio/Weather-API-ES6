/* Author: 

*/

let city;
let error = document.querySelector('.form-group span');
let form = document.querySelector('form');
let find = document.querySelector('.find');
let display = document.querySelector('.display');

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

// form find
find.addEventListener('click',(e) => {
    e.preventDefault();
    city = document.querySelector('.city').value;
    if(city === '' || city === null) {
        error.classList.add('error');
        error.textContent = 'This field is required!'
        if(display.classList.contains('show')) {
            display.classList.remove('show');
            bgChange('');
        }
    }
    else { validateCity(city);}
});

// validate the city
let validateCity = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8e08f2c66d3abadc4ad7e3b408caf570&units=metric`)
    .then(reponse => reponse.json())
    .then(data => {
        if(data.cod === 200) {
            displayWeather(data);
            removeError();
            form.reset();
        }
        else { throw data;}
    })
    .catch(err => {
        error.classList.add('error');
        error.textContent = err.message;
        if(display.classList.contains('show')) {
            display.classList.remove('show');
            bgChange('');
        }
    });
}

// display weather of city
let displayWeather = data => {
    console.log(data);
    display.classList.add('show');
    document.querySelector('.showCity').textContent = data.name;
    document.querySelector('.temp').textContent = data.main.temp;
    document.querySelector('.wind').textContent = data.wind.speed;
    document.querySelector('.status h5').textContent = data.weather[0].main;
    let img = document.querySelector('.status img');
    img.setAttribute('src',`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    img.setAttribute('alt',data.weather[0].main);
    bgChange(data.weather[0].main);  
}

// backgroung change
let bgChange = weather => document.body.style.backgroundImage = `url("assets/images/${weather}.jpg")`;
