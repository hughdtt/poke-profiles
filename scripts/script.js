//Setup
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getPokemon(pokemonName){

    //Init the PokeAPI wrapper
    const P = new Pokedex.Pokedex()

    //Init pokemonObj so we can save data we need
    let pokemonObj = {
        id: 0,
        name: '',
        japName: '',
        imageURL: '',
    };

    //Japanese Name conversion
    const japName = await fetch('./data.json');
    const japNameData = await japName.json();

    //Call API to grab pokemon name
    await P.getPokemonByName(pokemonName).then(function(response) {
        pokemonObj.id = response.id
        pokemonObj.name = response.name;
        pokemonObj.japName = japNameData[response.id - 1]; //Data is already in ID order
        pokemonObj.imageURL = response.sprites.other["official-artwork"].front_default;
    })

    //Show on page
    showPokemon(pokemonObj)
}

//Pass data through to page
function showPokemon(pokemon){
    const cardHTML = `
        <div class="card">
            <div>
                <img src=${pokemon.imageURL}></img>
            </div>
            <div class="pokemon-profile">
                <h2>${pokemon.name}</h2>
                <h2>${pokemon.japName}</h2>
                <p>ID: ${pokemon.id}</p>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;

}

getPokemon('bulbasaur');
//Search utility
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pokemon = search.value;

    if (pokemon) {
        getPokemon(pokemon);

        search.value = "";
    }
});


