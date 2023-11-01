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

async function getMostRating(){
    let data = await GetResults('http://127.0.0.1:8000/api/v1/titles/?format=json&sort_by=-imdb_score,-votes')
    let film = await GetOneResult(data[0].id)
    document.querySelector(".container_most_rating").style.backgroundImage = `url(${film.image_url})`
    document.querySelector(".container_most_rating").innerHTML = (
        `
        <div class="most_rating">
            <h2 class="titre_most_rating">${film.title}</h2>
            <p class="film_genre_top1">${film.genres}</p>
            <p>${film.description}</p>
            <button class="button_card">Lecture</button>
            <button class="button_card">Info</button>
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
            console.log("click");
            const container = scrollButtonLeft.nextElementSibling;
            container.scrollBy({
                top: 0,
                left: -500,
                behavior: "smooth" 
            });
        });

        scrollButtonRight.addEventListener("click", function() {
            console.log("click");
            const container = scrollButtonLeft.nextElementSibling;
            container.scrollBy({
                top: 0,
                left: 500,
                behavior: "smooth" 
            });
        });
    });
}



async function bestRated(){
    let films = []
    let data1 = await GetResults('http://127.0.0.1:8000/api/v1/titles/?format=json&sort_by=-imdb_score,-votes')
    let data2 = await GetResults('http://127.0.0.1:8000/api/v1/titles/?format=json&page=2&sort_by=-imdb_score,-votes')
    for(let i = 0; i < data1.length; i++){
        if(i == 0){
            continue
        }
        films.push(data1[i])
    }
    for(let i = 0; i < data2.length; i++){
        if(films.length >= 7){
            continue
        }
        films.push(data2[i])
    }
    let bestRate = document.querySelector(".container_best_rate")
    bestRate.innerHTML = (
        films.map(film => (
            `
            <div class="card_film" id="${film.id}" style="background-image: url(${film.image_url});">
            </div>
            `
        )).join('')
    )
}

async function category(cat , classname){
    let films = []
    let data1 = await GetResults(`http://127.0.0.1:8000/api/v1/titles/?format=json&genre=${cat}&sort_by=-imdb_score`)
    let data2 = await GetResults(`http://127.0.0.1:8000/api/v1/titles/?format=json&page=2&genre=${cat}&sort_by=-imdb_score`)
    for(let i = 0; i < data1.length; i++){        
        films.push(data1[i])
    }
    for(let i = 0; i < data2.length; i++){
        if(films.length >= 7){
            continue
        }
        films.push(data2[i])
    }
    let container = document.querySelector(`.${classname}`)
    container.innerHTML = (
        films.map(film => (
            `
            <div class="card_film" id="${film.id}" style="background-image: url(${film.image_url});">
            </div>
            `
        )).join('')
    )
}

function waitForElementToExist(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
  
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
  
      observer.observe(document.body, {
        subtree: true,
        childList: true,
      });
    });
  }

async function modal(){
    let modal = document.querySelector(".modal")
    modal.style.display = "none"
    await getMostRating()
    await bestRated()
    await category("comedy", "container_cat_card1")
    await category("thriller", "container_cat_card2")
    await category("romance", "container_cat_card3")
    
    
    let films = document.querySelectorAll(".card_film")
    films.forEach(function(film) {
        const id = film.id
        film.addEventListener("click", async function(){
            
            
            if (modal.style.display == "none"){
                modal.style.display = "block"
                let data = await GetOneResult(id)
                console.log(data)
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

                        <p>Actors : ${data.actors}</p>
                        <p>Country : ${data.countries}</p>
                        <p>Box office result : idk</p>
                        <p>Resume : ${data.long_description} </p>
                        <br>
                        <button class="button_card">Lecture</button>
                    </div>
                    `
                )
                
            }
            
            document.querySelector(".close").addEventListener("click", function(){
                modal.style.display = "none"
            })
            // document.addEventListener("click", function (event) {
            //     if (event.target !== modal && event.target !== film) {
            //         modal.style.display = "none"; // Hide the modal
            //     }
            
            // });
        })
        
    });

    
    
    

        
    
}




btn_scroll()
modal()