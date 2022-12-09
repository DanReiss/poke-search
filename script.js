// document.addEventListener("DOMContentLoaded", fetchPokemons)

let pokeContainer = document.querySelector(".pokemons-container")


    // if(i % 4 === 1){
    //     innerRow += `<div class="row row${row}">`
    // }
    // innerRow += `<div class="col card m-2">
    //                 <h4>${pokemon.name}</h4>
    //                 <img src="${pokemon.sprites['front_default']}" alt="image ${pokemon.name}">
    //                 <p>${format(pokemon.id)}</p>
    //             </div>`;
    // if(i % 4 === 0){
    //     innerRow += "</div>"
    // }    
    


const fetchPokemons = () =>{
    const getURL = id => `https://pokeapi.co/api/v2/pokemon/${id}`

    const pokemonPromises = [];

    for(let i =1; i<= 20; i++){
        pokemonPromises.push(fetch(getURL(i)).then(response => response.json()))
    }

    Promise.all(pokemonPromises)
    .then(pokemonsData =>{
        loadPokemons(pokemonsData)
    })
}

fetchPokemons();


function loadPokemons(pokemons){
    const innerRows = pokemons.reduce((acc, pokemon, index) => {
        let row = 1;
        if((index + 1) % 4 === 1){
            acc += `<div class="row row${row}">`
        }
        acc += `<div class="col card m-2">
                        <h4>${pokemon.name}</h4>
                        <img src="${pokemon.sprites['front_default']}" alt="image ${pokemon.name}">
                        <p>${format(pokemon.id)}</p>
                    </div>`;
        if((index + 1) % 4 === 0){
            acc += "</div>"
            row++
        } 
        return acc
    }, "");
    pokeContainer.innerHTML = innerRows;
}

function format(id){
    if(id < 10) return "Nº00" + id;
    if(id < 100 && id >= 10) return "Nº0" + id;
    if(id > 100) return "Nº" + id;
}

