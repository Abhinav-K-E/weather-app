// DOM Elements

const form = document.getElementById("search-form");
const input = document.querySelector("#search-item");
const msg = document.querySelector(".form-msg");
const list = document.querySelector(".cities");

// Api key

const apiKey = 'cf3a55aed40a061f42c8ea35c0356856';

form.addEventListener('submit',e=>{
    e.preventDefault();

    msg.textContent="";
    msg.classList.remove("visible");

    let inputVal = input.value;

    // check city existance
    const listArray = Array.from(list.querySelectorAll('.cities li'))
    //console.log(listArray);

    if(listArray.length >0){
        const filteredArray = listArray.filter(el=>{
            let content = '';
            let cityName = el.querySelector('.city_name').textContent.toLowerCase();
            let cityCountry = el.querySelector('.city_country').textContent.toLowerCase();

            // check for city,country format

            if(inputVal.includes(',')){
                if(inputVal.split(',')[1].length>2){
                    inputVal = input.split(',')[0];

                    content = cityName;
                }// targetting country name
                else{
                    content = `${cityName},${cityCountry}`;
                }
            }else{
                content = cityName;
            }

            return content == inputVal.toLowerCase();
        })

        //console.log(filteredArray);

        // If filteredArray is not blank, we have matches so we show a message and exit
		if (filteredArray.length > 0) {
			msg.textContent = `You already know the weather for ${filteredArray[0].querySelector(".city_name").textContent} ...otherwise be more specific by providing the country code as well 😉`;

			msg.classList.add('visible')

			form.reset()
			input.focus()

			return
		}
        
    }

    // Ajax Magic to update website data

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url).then(response => response.json())
    .then(data =>{
        //console.log(data);

        // If we get a 404 code, throw an error
		if (data.cod == '404') {
			throw new Error(`${data.cod}, ${data.message}`)
		}

        // data object destructuring

        const {main , name , sys , weather} = data;

        //console.log(weather);

        const icon = `./img/weather/${weather[0]['icon']}.svg`;

        const li = document.createElement('li');

        const markUp = `
                    <figure>
                        <img src="${icon}" alt="">
                    </figure>

                    <div>
                        <h2>${Math.round(main.temp)}<sup>°C</sup></h2>
                        <p class="city_conditions">${weather[0]['description'].toUpperCase()}</p>
                        <h3><span class="city_name">${name}</span><span class="city_country">${sys.country}</span></h3>
                    </div> `
        
        li.innerHTML = markUp;

        list.appendChild(li);



    })
    .catch(()=>{
        msg.textContent = "Please search for a valid city⚡";
        msg.classList.add("visible");
    })

    msg.textContent="";
    form.reset();
    input.focus()
})