"use strict"

const pokeContainer = document.querySelector(".pokemons-container");
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input");
const pagesBox = document.getElementById("pages");
const loading = document.querySelector("#loading");

const previous = document.getElementById("previous");
const next = document.getElementById("next");
const pageNum = document.getElementById("page-number");
const backBtn = document.querySelector(".go-back");

const modalPokemon = document.querySelector("#single-poke-modal")
const closeButton = document.querySelector(".close-page")

const infoPokeName = document.querySelector(".info-poke-name");
const infoPokeId = document.querySelector(".info-id");
const modalImage = document.querySelector(".info-img");
let info = num => document.querySelector(`.info${num}`)
let currentIDs = [1, 20];

const pokemonBox = (pokeData) =>{
  const pokemonName = firstLetterUpper(pokeData.name)
    
  return ( 
    `<div id="${pokeData.name}" class="col-md col-sm-6 col-12 card m-0 m-lg-4 pokemon">
        <h4 class="text-primary pt-3">${pokemonName}</h4>
        <img src="${pokeData.sprites['front_default']}" alt="image ${pokeData.name}">
        <span class="text-secondary fs-5">${format(pokeData.id)}</span>
    </div>`)
}

window.addEventListener("load", ()=> fetchPokemons(currentIDs))
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

modalImage.addEventListener('load', ()=>{
  modalPokemon.classList.replace("d-none", "d-grid");
})

function closeModal(e, inCloseBtn){
  if(e.target.id === "single-poke-modal" || inCloseBtn){
    modalPokemon.classList.replace("d-grid", "d-none")
  }
  return;
}

async function fetchData(data){
  const res = await fetch(data);
  const convertedData = await res.json();
  return convertedData;
}

function fetchPokemons(ids){
  const getURL = id => `https://pokeapi.co/api/v2/pokemon/${id}`;
  const pokemonPromises = [];
  let [i, numLastPokemonId] = ids;

  for(i; i <= numLastPokemonId; i++){
    pokemonPromises.push(fetchData(getURL(i)));
  }

  Promise.all(pokemonPromises)
  .then(pokemonsData =>{
    loadPokemons(pokemonsData);
  })
  .catch(err =>{
    alert(err);
  })
}

function loadPokemons(pokemons){
  const innerRows = pokemons.reduce((acc, pokemon, index) => {
    let row = 1;
    if((index + 1) % 4 === 1){
            acc += `<div class="row row${row} w-100">`
    }

    acc += pokemonBox(pokemon);
        
    if((index + 1) % 4 === 0){
            acc += "</div>"
            row++
    } 

    return acc;
  }, "");
  
  loading.classList.replace("d-none", "d-flex");
  pokeContainer.classList.replace("d-grid", "d-none");
  backBtn.classList.replace("d-flex", "d-none");
  pagesBox.classList.replace("d-none", "d-flex");
  pokeContainer.innerHTML = innerRows;

  addEventPokemons();
}

function format(id){
  if(id < 10) return "Nº00" + id;
  if(id < 100 && id >= 10) return "Nº0" + id;
  if(id > 100) return "Nº" + id;
}

function firstLetterUpper(str){
  return str.charAt().toUpperCase() + str.slice(1);
}

function changePage(e){
  if(e.target.id === "next"){
    currentIDs = currentIDs.map(id => id + 20);
    fetchPokemons(currentIDs);
    pageNum.innerHTML = Number(pageNum.innerHTML) + 1;
  }
  if(e.target.id === "previous"){
    if(currentIDs[0] !== 1){
      currentIDs = currentIDs.map(id => id - 20);
      fetchPokemons(currentIDs);
      pageNum.innerHTML = Number(pageNum.innerHTML) - 1;
    }
  } 
  window.scrollTo(0, 0)
}

async function search(value){

  const url = `https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`;
  const pokemonData = await fetchData(url);
    
  const innerRows = `
  <div class="row row1 w-100">
      ${pokemonBox(pokemonData)}
      <div class="col"></div>
      <div class="col"></div>
      <div class="col"></div>
  </div>`;

  pokeContainer.innerHTML = innerRows;
  searchInput.value = "";
  backBtn.classList.replace("d-none", "d-flex");
  pagesBox.classList.replace("d-flex", "d-none");

  addEventPokemons();
}   

function addEventPokemons(){
  const pokemonsDivs = document.querySelectorAll(".pokemon") ;
  const pokemonsImgs = document.querySelectorAll(".pokemon img");
  
  pokemonsImgs[pokemonsImgs.length - 1].addEventListener("load", ()=>{
    setTimeout(()=>{
      loading.classList.replace("d-flex", "d-none");
      pokeContainer.classList.replace("d-none", "d-grid");
    }, 500)
  })

  pokemonsDivs.forEach((pokemonDiv)=>{
    pokemonDiv.addEventListener("click", loadPokemonPage);
  })
}

async function loadPokemonPage(e){
  const name = e.target.offsetParent.id;
  const url =  `https://pokeapi.co/api/v2/pokemon/${name}`;
  const pokemon = await fetchData(url);
  const extraInfo = await fetchData("https://pokeapi.co/api/v2/version-group/1/");
  let types = pokemon.types.reduce((acc, item) =>{
    return acc + `<span class="d-block">${firstLetterUpper(item.type.name)}</h5>`
  }, "")
  let abilities = pokemon.abilities.reduce((acc, item)=>{
    return acc + `<span class="d-block">${firstLetterUpper(item.ability.name)}</span>`
  }, "")

  infoPokeName.innerText = firstLetterUpper(pokemon.name);
  infoPokeId.innerText = format(pokemon.id);
  modalImage.setAttribute("src", pokemon.sprites.other['official-artwork']['front_default']);
  info(1).innerText = Number(pokemon.height / 10).toFixed(1) + " m";
  info(2).innerText = Number(pokemon.weight / 10).toFixed(1) + " kg";
  info(3).innerText = firstLetterUpper(extraInfo.regions[0].name);
  info(4).innerHTML = abilities;
  info(5).innerHTML = types;

}