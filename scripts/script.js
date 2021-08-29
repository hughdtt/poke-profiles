//Setup
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

//Background Colours
const colours = {
    Normal: '#A8A77A',
    Fire: '#EE8130',
    Water: '#6390F0',
    Electric: '#ffd73ae8',
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


async function getPokemon(pokemonName) {
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
            moves: [],
        },
    };

    //Japanese Name conversion
    const jpName = await fetch('/poke-profiles/scripts/data-jp.json');
    const jpData = await jpName.json();

    //Call API to grab pokemon details
    await P.getPokemonByName(pokemonName).then(function (response) {
        pokemonObj.id = response.id
        pokemonObj.name = response.name.toUpperCase();
        pokemonObj.altName = jpData[response.id - 1];
        pokemonObj.imageURL = response.sprites.other["official-artwork"].front_default;
        pokemonObj.details.height = response.height;
        pokemonObj.details.weight = response.weight;
        for (let element in response.types) {
            let string = response.types[element].type.name
            pokemonObj.details.types.push(string.charAt(0).toUpperCase() + string.slice(1))
        }
        for (let type in response.stats) {
            let statObj = {};
            statObj[`${response.stats[type].stat.name}`] = `${response.stats[type].base_stat}`
            pokemonObj.details.stats.push(statObj)
        }
        for (let id in response.abilities) {
            pokemonObj.details.moves.push(response.abilities[id].ability.name)
        }

        //Hardcoding this because api is missing doesn't have an easy to do it
        if (response.id <= 151) { pokemonObj.details.region = 'Kanto Region' }
        if (response.id > 151 && response.id <= 251) { pokemonObj.details.region = 'Johto Region' }
        if (response.id > 251 && response.id <= 386) { pokemonObj.details.region = 'Hoenn Region' }
        if (response.id > 386 && response.id <= 493) { pokemonObj.details.region = 'Sinnoh Region' }
        if (response.id > 493 && response.id <= 649) { pokemonObj.details.region = 'Unova Region' }
        if (response.id > 649 && response.id <= 721) { pokemonObj.details.region = 'Kalos Region' }
        if (response.id > 721 && response.id <= 809) { pokemonObj.details.region = 'Alola Region' }
        if (response.id > 809) { pokemonObj.details.region = 'Galar Region' }
    })
    
    await showPokemon(pokemonObj);
    getPokemonSpecies(pokemonName);
}

async function getPokemonSpecies(pokemonName){
    //Init the PokeAPI wrapper
    const P = new Pokedex.Pokedex()
    const paginationEl = document.getElementById("pagination");
    const interval = {
        offset: 1,
        limit: 10,
      }
    await P.getPokemonSpeciesByName(pokemonName).then(function(response){
        if (response.id > 5){
            interval.offset = response.id - 5
        }
        P.getPokemonsList(interval).then(function(response) {
            for (let i = 0; i < response.results.length; i++){
                const pagItem = document.createElement("a");
                pagItem.href = response.results[i].url
                pagItem.classList.add("pokeID");
                pagItem.target = "_blank";
                pagItem.innerText = response.results[i].name;
                paginationEl.appendChild(pagItem);
            }
        });
    });
    
}


//Pass data through to page
function showPokemon(pokemon) {
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
                <span><strong>Height -</strong> ${pokemon.details.height / 10}m</span>
            </div>
            <div>
                <span><strong>Weight -</strong> ${pokemon.details.weight / 10}kg</span>
            </div>
        </div>
        <div class="region">
            <div>
                <span>Pok&eacutedex - ${pokemon.details.region}</span>
            </div>
        </div>
        <div class="type">
            <div>
                <img src=${"img/Pokemon_Type_Icon_" + pokemon.details.types[0] + ".png"} alt="type" />
                ${pokemon.details.types[1] ? `<img src=${"img/Pokemon_Type_Icon_" + pokemon.details.types[1] + ".png"} alt=""/>` : ''}
            </div>
        </div>
        <div class="statsWrapper">
            <div id="statsLabel">
                <span style="font-size: 1.7rem;">Stats</span>
            </div>
            <div id="statsRow">
                <div class="statsColumn">
                    <span><strong>HP -</strong> ${pokemon.details.stats[0]['hp']}</span>
                    <span><strong>Attack -</strong> ${pokemon.details.stats[1]['attack']}</span>
                    <span><strong>Defence -</strong> ${pokemon.details.stats[2]['defense']}</span>
                </div>
                <div class="statsColumn">
                    <span><strong>Sp. Attack -</strong> ${pokemon.details.stats[3]['special-attack']}</span>
                    <span><strong>Sp. Defence -</strong> ${pokemon.details.stats[4]['special-defense']}</span>
                    <span><strong>Speed -</strong> ${pokemon.details.stats[5]['speed']}</span>
                </div>
            </div>
        </div>
        <div id="pagination"></div>
    `;
    main.innerHTML = cardHTML;
}

//Load init page on pikachu
getPokemon('pikachu')

//Search on submit utility
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pokemon = search.value;
    if (pokemon) {
        getPokemon(pokemon.toLowerCase());
        search.value = '';
    }

});


//JqueryUI Autocomplete - Search on select Utility
$(function () {
    //try to grab english names
    $.getJSON("/poke-profiles/scripts/data-en.json", function (data) {
        let prompt = "";
        $("#search").val(prompt).focus(function() { $(this).val(''); }).autocomplete({
            source: data,
            response: function (event, ui) {
                if (!ui.content.length) {
                    var noResult = { label: "No results found", value: "No results found" };
                    ui.content.push(noResult);
                }
            },
            select: function (event, ui) {
                //Search on select
                const pokemon = ui.item.label;
                if (pokemon) {
                    getPokemon(pokemon.toLowerCase());
                }
                $('#search').blur();
            }
        });
        //Highlight search field
        $.ui.autocomplete.prototype._renderItem = function (ul, item) {
            var t = String(item.value).replace(
                new RegExp(this.term, "gi"),
                "<span class='menu-item-bold'>$&</span>");
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<div>" + t + "</div>")
                .appendTo(ul);
        };
    }).fail(function () {
        console.log("Error fetching Pokemon en-names");
    });
});





