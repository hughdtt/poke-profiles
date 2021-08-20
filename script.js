/**
 * Using the PokeAPI js wrapper to handle cache. 
 */


const imageURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/"

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getPokemon(pokemonName){
    const P = new Pokedex.Pokedex()
    let pokemonObj = {
        id: 0,
        name: '',
        imageURL: '',
    };
    await P.getPokemonByName(pokemonName).then(function(response) {
        pokemonObj.id = response.id
        pokemonObj.name = response.name;
        pokemonObj.imageURL = response.sprites.versions["generation-v"]["black-white"].animated.front_default;
    })

    showPokemon(pokemonObj)
}

function showPokemon(pokemon){
    const cardHTML = `
        <div class="card">
            <div>
                <img src=${pokemon.imageURL}></img>
            </div>
            <div class="pokemon-profile">
                <h2>${pokemon.name}</h2>
                <p>ID: ${pokemon.id}</p>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;

}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pokemon = search.value;

    if (pokemon) {
        getPokemon(pokemon);

        search.value = "";
    }
});

