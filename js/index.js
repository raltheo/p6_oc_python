async function GetResults(url){
    let response = await fetch(url)
    let results = await response.json()
    return results.results
}
async function GetOneResult(id){
    let response = await fetch("http://127.0.0.1:8000/api/v1/titles/"+ id)
    let result = await response.json()
    return result
}
async function getBestRated(wanted){
    let films = []
    let number = Math.ceil(wanted / 5);
    for(let i = 1; i <= number; i++){
        let response = await GetResults(`http://127.0.0.1:8000/api/v1/titles/?format=json&page=${i}&sort_by=-imdb_score`)
        for(let a = 0; a <= response.length-1; a++){
            if(films.length >= wanted)continue
            films.push(response[a])
        }
    }
    return films
}
async function getCategory(wanted, category){
    let films = []
    let number = Math.ceil(wanted / 5);
    for(let i = 1; i <= number; i++){
        let response = await GetResults(`http://127.0.0.1:8000/api/v1/titles/?format=json&page=${i}&genre=${category}&sort_by=-imdb_score`)
        for(let a = 0; a <= response.length-1; a++){
            if(films.length >= wanted)continue
            films.push(response[a])
        }
    }
    return films
}

async function displayMostRating(){
    let data = await GetResults('http://127.0.0.1:8000/api/v1/titles/?format=json&sort_by=-imdb_score')
    let film = await GetOneResult(data[0].id)
    document.querySelector(".container_most_rating").style.backgroundImage = `url(${film.image_url})`
    document.querySelector(".container_most_rating").innerHTML = (
        `
        <div class="most_rating">
            <h2 class="titre_most_rating">${film.title}</h2>
            <p class="film_genre_top1">${film.genres}</p>
            <p>${film.description}</p>
            <button class="button_card card_film" id=${film.id}>Lecture</button>
        </div>
        `
    )
}


function btn_scroll() {
    const scrollContainers = document.querySelectorAll(".container_cat");
    scrollContainers.forEach(function(scrollContainer) {
        const scrollButtonLeft = scrollContainer.querySelector(".button_scroll_left");
        const scrollButtonRight = scrollContainer.querySelector(".button_scroll_right");

        scrollButtonLeft.addEventListener("click", function() {
            const container = scrollButtonLeft.nextElementSibling;
            container.scrollBy({
                top: 0,
                left: -500,
                behavior: "smooth" 
            });
        });

        scrollButtonRight.addEventListener("click", function() {
            const container = scrollButtonLeft.nextElementSibling;
            container.scrollBy({
                top: 0,
                left: 500,
                behavior: "smooth" 
            });
        });
    });
}

async function displayBestRated(wanted){
    let films = await getBestRated(wanted)
    let bestRate = document.querySelector(".container_best_rate")
    bestRate.innerHTML = (
        films.map(film => (
            `
            <div class="card_film_css card_film" id="${film.id}" style="background-image: url(${film.image_url});">
            </div>
            `
        )).join('')
    )
}

async function displayCategory(cat , classname, wanted){
    let films = await getCategory(wanted, cat)
    let container = document.querySelector(`.${classname}`)
    container.innerHTML = (
        films.map(film => (
            `
            <div class="card_film_css card_film" id="${film.id}" style="background-image: url(${film.image_url});">
            </div>
            `
        )).join('')
    )
}

async function displayModal(){
    let modal = document.querySelector(".modal")
    modal.style.display = "none"
    await displayMostRating()
    await displayBestRated(7)
    await displayCategory("comedy", "container_cat_card1", 7)
    await displayCategory("thriller", "container_cat_card2", 7)
    await displayCategory("romance", "container_cat_card3", 7)
    let films = document.querySelectorAll(".card_film")
    films.forEach(function(film) {
        const id = film.id
        film.addEventListener("click", async function(){
            if (modal.style.display == "none"){
                modal.style.display = "block"
                let data = await GetOneResult(id)
                modal.innerHTML = (
                    `
                    <div class="close">x</div>
                    <div class="info_modal">
                        <img src="${data.image_url}">
                        <h3>${data.title}</h3>
                        <div class="wrapped">
                            <p>Genre : ${data.genres}</p>
                            <p>Date de sortie : ${data.date_published}</p>
                        </div>
                        <div class="wrapped">
                            <p>Rated : ${data.rated}</p>
                            <p>Imdb : ${data.imdb_score}</p>
                        </div>
                        <div class="wrapped">
                            <p>Realisator : ${data.directors}</p>
                            <p>Duration : ${data.duration} min</p>
                        </div>

                        <p class="modal_long_text">Actors : ${data.actors}</p>
                        <div class="wrapped">
                            <p>Country : ${data.countries}</p>
                            <p>Box office result : ${data.worldwide_gross_income}</p>
                        </div>
                        
                        <p class="modal_long_text">Resume : ${data.description} </p>
                        <br>
                        <button class="button_card">Lecture</button>
                    </div>
                    `
                )
                
            }
            
            document.querySelector(".close").addEventListener("click", function(){
                modal.style.display = "none"
            })
            
        })
        
    });
}

btn_scroll()
displayModal()