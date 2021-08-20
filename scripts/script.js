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
        typeImageURL: '',
        details: {
            height: '',
            weight: '',
            region: 'Kanto Region',
            bio: 'Example',
            types: [],
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
        pokemonObj.typeImageURL = '';
        pokemonObj.details.height = response.height;
        pokemonObj.details.weight = response.weight;
        for (let element in response.types){
            pokemonObj.details.types.push(response.types[element].type.name) 
        }
        console.log(pokemonObj)
    })

    //Show on page
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
    const formatId = (id) => {
        return id < 100 ? (id < 10 ? `#00${id}` : `#0${id}`) : `#${id}`;
    }
    const cardHTML = `
        <div class="id">
            <div>
                <p>${formatId(pokemon.id)}</p>
                <p>${pokemon.name}</p>
            </div>
        </div>
        <div class="titleCard">
            <div>
                <p>${pokemon.altName}</p>
            </div>
            <div>
                <img src=${pokemon.imageURL} alt="pokeIMG"></img>
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
        getPokemon(pokemon.toLowerCase());

        search.value = "";
    }
});


