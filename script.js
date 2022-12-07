document.addEventListener("DOMContentLoaded", LoadPokemons)

function LoadPokemons(){
    let innerRow = "";
    for(let i = 1, r = 0; i <= 16; i++){
        if(i % 4 === 1){
            innerRow = ""; // resetar para começar uma nova linha
            r++;
        }
        let row = document.querySelector(`.row${r}`)    
        let pokemonBox = `<div class="col">
                <h4>Name</h4>
                <img src="" alt="img pokemon">
                <p>ID Pokemon</p>
                </div>`;
        innerRow += pokemonBox;
        row.innerHTML = innerRow;
    }
}