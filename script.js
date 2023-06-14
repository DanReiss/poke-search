"use strict"

const pokeContainer = document.querySelector(".pokemons-container");
const searchForm = document.querySelector("#search-form")
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

const pokemonBox = (pokeData) =>{
  const pokemonName = firstLetterUpper(pokeData.name)
    
  return ( 
    `<div id="${pokeData.name}" class="col-md col-sm-6 col-12 card m-0 m-lg-4 pokemon">
        <h4 class="text-primary pt-3">${pokemonName}</h4>
        <img src="${pokeData.sprites['front_default']}" alt="image ${pokeData.name}">
        <span class="text-secondary fs-5">${format(pokeData.id)}</span>
    </div>`)
}

console.log()

closeButton.addEventListener("click", (e)=>{ closeModal(e, true)})
modalPokemon.addEventListener("click", closeModal)

previous.addEventListener("click", changePage);
next.addEventListener("click", changePage);

backBtn.addEventListener("click", ()=>{fetchPokemons(currentIDs)});

searchForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  if(!searchInput.value) return;

  search(searchInput.value)
})

function closeModal(e, inCloseBtn){
  if(e.target.id === "single-poke-modal" || inCloseBtn){
    if(modalPokemon.classList.contains("d-grid")) {    
      modalPokemon.classList.remove("d-grid")
      modalPokemon.classList.add("d-none");
    } 
  }
  return;
}


function fetchPokemons(ids){
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
    alert(err);
  })
}

fetchPokemons();

function loadPokemons(pokemons){
  const innerRows = pokemons.reduce((acc, pokemon, index) => {
    let row = 1;
    if((index + 1) % 4 === 1){
            acc += `<div class="row row${row}">`
    }

    acc += pokemonBox(pokemon);
        
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
  return str.charAt().toUpperCase() + str.slice(1)
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


async function search(value){

  const url = `https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`;
  await fetch(url)
  .then(res => res.json())
  .then(pokemon =>{      
    
    const innerRows = 
    `<div class="row row1">
       ${pokemonBox(pokemon)}
        <div class="col m-2"></div>
        <div class="col m-2"></div>
        <div class="col m-2"></div>
     </div>`;
    pokeContainer.innerHTML = innerRows;
  })
  .catch(()=>{
    alert("Not Found, please write a valid value")
  })

  searchInput.value = "";
  backBtn.classList.remove("d-none")
  backBtn.classList.add("d-flex")
  pagesBox.classList.remove("d-flex");
  pagesBox.classList.add("d-none");

  addEventPokemons();
}   


function addEventPokemons(){
  const pokemonsDivs = document.querySelectorAll(".pokemon") 
  pokemonsDivs.forEach((pokemonDiv)=>{
    pokemonDiv.addEventListener("click", loadPokemonPage)
  })
}

async function loadPokemonPage(e){
  const name = e.target.offsetParent.id;
  const url =  `https://pokeapi.co/api/v2/pokemon/${name}`;
  
  await fetch(url)
  .then(res => res.json())
  .then((pokemon)=>{

    infoPokeId.innerText = format(pokemon.id)
    infoPokeName.innerText = firstLetterUpper(pokemon.name)
    infoImage.setAttribute("src", pokemon.sprites.other['official-artwork']['front_default'])

    info(1).innerText = Number(pokemon.height / 10).toFixed(1) + " m";
    info(2).innerText = Number(pokemon.weight / 10).toFixed(1) + " kg";


    let abilities = pokemon.abilities.reduce((acc, item)=>{
      return acc + `<span class="d-block">${firstLetterUpper(item.ability.name)}</span>`
    }, "")
    info(4).innerHTML = abilities;


    let types = pokemon.types.reduce((acc, item) =>{
      return acc + `<span class="d-block">${firstLetterUpper(item.type.name)}</h5>`
    }, "")
    info(5).innerHTML = types;

   })
  .catch(err =>{
    alert(err)
  })

  await fetch("https://pokeapi.co/api/v2/version-group/1/")
  .then(res => res.json())
  .then(pokemon => {
    info(3).innerText = firstLetterUpper(pokemon.regions[0].name)
  })
  .catch(err =>{
    alert(err)
  })

  modalPokemon.classList.remove("d-none")
  modalPokemon.classList.add("d-grid")
}
