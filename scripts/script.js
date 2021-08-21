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
        altName: '',
        imageURL: '',
        details: {
            height: '',
            weight: '',
            region: '',
            stats: [],
            types: [],
            moves:[],
        },
    };

    //Japanese Name conversion
    const altName = await fetch('/poke-profiles/scripts/data.json');
    const altNameData = await altName.json();

    //Call API to grab pokemon details
    await P.getPokemonByName(pokemonName).then(function(response) {
        pokemonObj.id = response.id
        pokemonObj.name = response.name.toUpperCase();
        pokemonObj.altName = altNameData[response.id - 1]; 
        pokemonObj.imageURL = response.sprites.other["official-artwork"].front_default;
        pokemonObj.details.height = response.height;
        pokemonObj.details.weight = response.weight;
        for (let element in response.types){
            pokemonObj.details.types.push(response.types[element].type.name) 
        }
        for (let type in response.stats){
            let statObj = {};
            statObj[`${response.stats[type].stat.name}`] = `${response.stats[type].base_stat}`
            pokemonObj.details.stats.push(statObj)
        }
        for (let id in response.abilities){
            pokemonObj.details.moves.push(response.abilities[id].ability.name)
        }
        if (response.id <= 151){pokemonObj.details.region = 'Kanto Region'}
        // console.table(pokemonObj.details.stats)
    })
    showPokemon(pokemonObj);
}

//Background Colours
const colours = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

//Pass data through to page
function showPokemon(pokemon){
    //Update background colour based on type
    document.body.style.backgroundColor = colours[pokemon.details.types[0]];

    //Cheeky one-liner
    const formatId = (id) => {
        return id < 100 ? (id < 10 ? `#00${id}` : `#0${id}`) : `#${id}`;
    }

    const cardHTML = `
        <div class="id">
            <div>
                <span>${formatId(pokemon.id)}</span></br>
                <span>${pokemon.name}</span>
            </div>
        </div>
        <div class="titleCard">
            <div class="japName">
                <p>${pokemon.altName}</p>
            </div>
            <div class="titleImg">
                <img src=${pokemon.imageURL} alt="pokeIMG" />
            </div>
        </div>
        

    `;

    main.innerHTML = cardHTML;

}

getPokemon('bulbasaur')

//Search utility
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pokemon = search.value;

    if (pokemon) {
        getPokemon(pokemon.toLowerCase()); //api returns names in lower case; this handles cases where user decides to search using capital letters

        search.value = "";
    }
});

/**
 * <div class="region">
            <div>
                <p>Pok&eacutedex - ${pokemon.details.region}</p>
            </div>
        </div>
        <div class="physicalDesc">
            <div>
                <p>Height: ${pokemon.details.height/10}m</p>
            </div>
            <div>
                <p>Weight: ${pokemon.details.weight/10}kg</p>
            </div>
        </div>
        <div class="statsDesc">
            <div>
                <h2>Stats</h2>
                <p>HP: ${pokemon.details.stats[0]['hp']}</p>
                <p>Attack: ${pokemon.details.stats[1]['attack']}</p>
                <p>Defense: ${pokemon.details.stats[2]['defense']}</p>
                <p>Special Attack: ${pokemon.details.stats[3]['special-attack']}</p>
                <p>Special Defense: ${pokemon.details.stats[4]['special-defense']}</p>
                <p>Speed: ${pokemon.details.stats[5]['speed']}</p>
            </div>
        </div>
 */

