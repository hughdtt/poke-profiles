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
            let string = response.types[element].type.name
            pokemonObj.details.types.push(string.charAt(0).toUpperCase() + string.slice(1)) 
        }
        for (let type in response.stats){
            let statObj = {};
            statObj[`${response.stats[type].stat.name}`] = `${response.stats[type].base_stat}`
            pokemonObj.details.stats.push(statObj)
        }
        for (let id in response.abilities){
            pokemonObj.details.moves.push(response.abilities[id].ability.name)
        }

        //Hardcoding this because api is missing doesn't have an easy to do it
        if (response.id <= 151){pokemonObj.details.region = 'Kanto Region'}
        if (response.id > 151 && response.id <= 251){pokemonObj.details.region = 'Johto Region'}
        if (response.id > 251 && response.id <= 386){pokemonObj.details.region = 'Hoenn Region'}
        if (response.id > 386 && response.id <= 493){pokemonObj.details.region = 'Sinnoh Region'}
        if (response.id > 493 && response.id <= 493){pokemonObj.details.region = 'Sinnoh Region'}
        if (response.id > 493 && response.id <= 649){pokemonObj.details.region = 'Unova Region'}
        if (response.id > 649 && response.id <= 721){pokemonObj.details.region = 'Kalos Region'}
        if (response.id > 721 && response.id <= 809){pokemonObj.details.region = 'Alola Region'}
        if (response.id > 809){pokemonObj.details.region = 'Galar Region', pokemonObj.altName = ''}
    })
    showPokemon(pokemonObj);
}

//Background Colours
const colours = {
    Normal: '#A8A77A',
    Fire: '#EE8130',
    Water: '#6390F0',
    Electric: '#fac802e8',
    Grass: '#7AC74C',
    Ice: '#96D9D6',
    Fighting: '#C22E28',
    Poison: '#A33EA1',
    Ground: '#E2BF65',
    Flying: '#A98FF3',
    Psychic: '#F95587',
    Bug: '#A6B91A',
    Rock: '#B6A136',
    Ghost: '#735797',
    Dragon: '#6F35FC',
    Dark: '#705746',
    Steel: '#B7B7CE',
    Fairy: '#D685AD',
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
        <div class="logo">
            <img src=${"https://cdn2.bulbagarden.net/upload/4/4b/Pok%C3%A9dex_logo.png"} alt="logo" />
        </div>
        <div class="id">
            <div>
                <span>${formatId(pokemon.id)}</span></br>
                <span>${pokemon.name}</span>
            </div>
        </div>
        <div class="titleCard">
            <div class="japName">
                <span>${pokemon.altName}</span>
            </div>
            <div class="titleImg">
                <img src=${pokemon.imageURL} alt="pokeIMG" />
            </div>
        </div>
        <div class="physicalDesc">
            <div>
                <span><strong>Height -</strong> ${pokemon.details.height/10}m</span>
            </div>
            <div>
                <span><strong>Weight -</strong> ${pokemon.details.weight/10}kg</span>
            </div>
        </div>
        <div class="region">
            <div>
                <span>Pok&eacutedex - ${pokemon.details.region}</span>
            </div>
        </div>
        <div class="type">
            <div>
                <img src=${"img/Pokemon_Type_Icon_"+pokemon.details.types[0]+".png"} alt="type" />
                ${pokemon.details.types[1] ? `<img src=${"img/Pokemon_Type_Icon_"+pokemon.details.types[1]+".png"} alt=""/>`: ''}
            </div>
        </div>
        <div class="statsDesc">
            <span style="font-size: 1.7rem;">Stats</span>
            <div class="stats">
                <span><strong>HP -</strong> ${pokemon.details.stats[0]['hp']}</span>
                <span><strong>Attack -</strong> ${pokemon.details.stats[1]['attack']}</span>
                <span><strong>Defense -</strong> ${pokemon.details.stats[2]['defense']}</span>
                <span><strong>Special Attack -</strong> ${pokemon.details.stats[3]['special-attack']}</span>
                <span><strong>Special Defense -</strong> ${pokemon.details.stats[4]['special-defense']}</span>
                <span><strong>Speed -</strong> ${pokemon.details.stats[5]['speed']}</span>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;

}

getPokemon('pikachu')

//Search utility
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pokemon = search.value;

    if (pokemon) {
        getPokemon(pokemon.toLowerCase()); //api returns names in lower case; this handles cases where user decides to search using capital letters

        search.value = "";
    }
});


