"use strict"



const pokeContainer = document.querySelector(".pokemons-container");
const searchBtn = document.querySelector("#search-button");
const searchInput = document.querySelector("#search-input");
const pagesBox = document.getElementById("pages");

const previous = document.getElementById("previous");
const next = document.getElementById("next");
const pageNum = document.getElementById("page-number");

const backBtn = document.querySelector(".go-back");

let currentIDs = [];

const modalPokemon = document.querySelector("#single-poke-modal")
const closeButton = document.querySelector(".close-page")
const infoPokeName = document.querySelector(".info-poke-name");
const infoPokeId = document.querySelector(".info-id");
const infoImage = document.querySelector(".info-img");
const divInfos = document.querySelector(".infos");
const infoType = document.querySelector(".type");
const infoWeaknesses = document.querySelector(".weaknesses");
let info = num => document.querySelector(`.info${num}`)



closeButton.addEventListener("click", ()=>{
    if(modalPokemon.classList.contains("d-flex")) {
        modalPokemon.classList.remove("d-flex")
        modalPokemon.classList.add("d-none");
    }
})

previous.addEventListener("click", changePage);
next.addEventListener("click", changePage);

searchBtn.addEventListener("click", search);

const fetchPokemons = (ids) =>{
    const getURL = id => `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokemonPromises = [];

    let [i, numLastPokemonId] = ids? ids : [1, 20]

    if(!ids) currentIDs = [1, 20];


    for(i; i <= numLastPokemonId; i++){
        pokemonPromises.push(fetch(getURL(i)).then(response => response.json()));
    }

    Promise.all(pokemonPromises)
    .then(pokemonsData =>{
        loadPokemons(pokemonsData);
    })
    .catch(err =>{
        if(err) alert(err);
    })
}

fetchPokemons();

backBtn.addEventListener("click", ()=>{fetchPokemons(currentIDs)});

function loadPokemons(pokemons){
    const innerRows = pokemons.reduce((acc, pokemon, index) => {
        let row = 1;
        const pokemonName = firstLetterUpper(pokemon.name)
        if((index + 1) % 4 === 1){
            acc += `<div class="row row${row}">`
        }
        acc += `<div class="col-md col-sm-6 col-12 card m-0 m-lg-4 pokemon">
                        <h4 class="text-primary pt-3">${pokemonName}</h4>
                        <img class="pokemon-image" src="${pokemon.sprites['front_default']}" alt="image ${pokemon.name}">
                        <p class="text-secondary id-pokemon">${format(pokemon.id)}</p>
                    </div>`;
        if((index + 1) % 4 === 0){
            acc += "</div>"
            row++
        } 
        return acc
    }, "");

    pokeContainer.innerHTML = innerRows;
    backBtn.classList.remove("d-flex")
    backBtn.classList.add("d-none")
    pagesBox.classList.remove("d-none");
    pagesBox.classList.add("d-flex");
    pokeContainer.innerHTML = innerRows;

    addEventPokemons();
}

function format(id){
    if(id < 10) return "Nº00" + id;
    if(id < 100 && id >= 10) return "Nº0" + id;
    if(id > 100) return "Nº" + id;
}

function firstLetterUpper(str){
    return str[0].toUpperCase() + str.slice(1, str.length)
}

function changePage(e){
    if(e.target.id === "next"){
        currentIDs = [currentIDs[0] + 20, currentIDs[1] + 20]
        fetchPokemons(currentIDs)
        pageNum.innerHTML = Number(pageNum.innerHTML) + 1
    }else if(e.target.id === "previous"){
        if(currentIDs[0]){
            currentIDs = [currentIDs[0] - 20, currentIDs[1] - 20]
            fetchPokemons(currentIDs)
            pageNum.innerHTML = Number(pageNum.innerHTML) - 1
        }
    } 
}


function search(){
    if(!searchInput.value) alert("Type an ID or a Name!")
    else{
        const url = 'https://pokeapi.co/api/v2/pokemon/' + searchInput.value.toLowerCase();
        fetch(url).then(res => res.json())
        .catch((err)=>{
            if(err) alert("No valid value, please write correctly")
        })
        .then(pokemon =>{
            const pokemonName = firstLetterUpper(pokemon.name)
            const innerRows = `<div class="row row1">
                    <div class="col-md col-sm-6 col-12 card m-0 m-lg-4 pokemon">
                        <h4 class="text-primary pt-3">${pokemonName}</h4>
                        <img src="${pokemon.sprites['front_default']}" alt="image ${pokemon.name}">
                        <p class="text-secondary id-pokemon">${format(pokemon.id)}</p>
                    </div>
                    <div class="col m-2"></div>
                    <div class="col m-2"></div>
                    <div class="col m-2"></div>
             </div>`;

            searchInput.value = "";
            backBtn.classList.remove("d-none")
            backBtn.classList.add("d-flex")
            pagesBox.classList.remove("d-flex");
            pagesBox.classList.add("d-none");
            pokeContainer.innerHTML = innerRows;
        })
        addEventPokemons();
    }   
}


function addEventPokemons(){
    setTimeout(() =>{
        const pokemonsDivs = document.querySelectorAll(".pokemon") 
        pokemonsDivs.forEach((pokemonDiv)=>{
            pokemonDiv.addEventListener("click", loadPokemonPage)
        })
    },1000) 
}

function loadPokemonPage(e){
    const name = e.path[1].children[0].innerText.toLowerCase();
    const url =  'https://pokeapi.co/api/v2/pokemon/' + name;
    fetch(url).then(res => res.json())
    .catch(err =>{
        if(err) alert(err)
    })
    .then((pokemon)=>{
        const pokeName = firstLetterUpper(pokemon.name)
        infoPokeId.innerText = format(pokemon.id)
        infoPokeName.innerText = pokeName
        infoImage.setAttribute("src", pokemon.sprites.other['official-artwork']['front_default'])

        info(1).innerText = Number(pokemon.height / 10).toFixed(1) + " m";
        info(2).innerText = Number(pokemon.weight / 10).toFixed(1) + " kg";


        let abilities = pokemon.abilities.reduce((acc, item)=>{
            return acc + `<span class="d-block">${firstLetterUpper(item.ability.name)}</span>`
        }, "")
        info(4).innerHTML = abilities;


        let types = pokemon.types.reduce((acc, item) =>{
            // const typeBackgroundColor = typePokemonColors(item.type.name)

            return acc + `<span class="d-block">${firstLetterUpper(item.type.name)}</h5>`
         }, "")
        info(5).innerHTML = types;
        
    })

    fetch("https://pokeapi.co/api/v2/version-group/1/")
    .then(res => res.json())
    .then(pokemon => {
        info(3).innerText = firstLetterUpper(pokemon.regions[0].name)

        setTimeout(()=>{
            modalPokemon.classList.remove("d-none")
            modalPokemon.classList.add("d-flex")
        },300)
        
    })
}
