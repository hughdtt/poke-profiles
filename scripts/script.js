//Setup
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const loader = document.getElementById("loader");

//Init the PokeAPI wrapper
const P = new Pokedex.Pokedex();

//Cheeky one-liner
const formatId = (id) => {
    return id < 100 ? (id < 10 ? `#00${id}` : `#0${id}`) : `#${id}`;
}

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

const generateProfile = (pokemonName) => {
    //Init pokemonObj so we can save data we need
    let pokemonObj = {
        _id: 0,
        national_id: 0,
        names: {
            en: '',
            jp: '',
        },
        description: {
            flavor_text: '',
            height: '',
            weight: '',
            stats: [],
            color: '',
            types: [],
            moves: [],
            region: '',
        },
        forms: [],
        evolutions: [],
        art_url: '',
        interval_id: [],
    };
    form.style.display= "none";
    main.style.display = "none";
    loader.style.display = "grid";
    Promise.all([P.getPokemonSpeciesByName(pokemonName), P.getPokemonByName(pokemonName)]).then( responses => {
        getSpeciesData(responses[0], pokemonObj);
        getGeneralData(responses[1], pokemonObj);
        showPokemon(pokemonObj);
    })
    .catch( error => {
        console.error(`Failed to fetch: ${error}`)
    });
    
    form.style.display= "block";
    main.style.display = "grid";
    loader.style.display = "none";
}




const getSpeciesData = (resp, model) => {
    model.forms = resp.varieties;
    model._id = resp.id;
    for (let i in resp.pokedex_numbers){
        if (resp.pokedex_numbers[i].pokedex.name == 'national'){
            model.national_id = resp.pokedex_numbers[i].entry_number;
        }
    }
    for (let i in resp.names){
        if (resp.names[i].language.name == 'en'){
            model.names.en = resp.names[i].name;
        }
        if (resp.names[i].language.name == 'ja-Hrkt'){
            model.names.jp = resp.names[i].name;
        }
    };
    for (let i in resp.flavor_text_entries){
        if(resp.flavor_text_entries[i].language.name == 'en' && resp.flavor_text_entries[i].version.name == 'firered'){
            model.description.flavor_text = resp.flavor_text_entries[i].flavor_text;   
        }
    }
    model.description.color = resp.color.name;
}

const getGeneralData = (resp, model) => {
    for (let i in resp.stats) {
        let statObj = {};
        statObj[`${resp.stats[i].stat.name}`] = `${resp.stats[i].base_stat}`
        model.description.stats.push(statObj)
    }
    model.art_url = resp.sprites.other["official-artwork"].front_default;
    model.description.height = resp.height;
    model.description.weight = resp.weight;
    for (let i in resp.types) {
        let string = resp.types[i].type.name
        model.description.types.push(string.charAt(0).toUpperCase() + string.slice(1))
    }

    for (let i in resp.abilities) {
        model.description.moves.push(resp.abilities[i].ability.name)
    }
    //Hardcoding this because api is missing doesn't have an easy to do it
    if (resp.id <= 151) { model.description.region = 'Kanto Region' }
    if (resp.id > 151 && resp.id <= 251) { model.description.region = 'Johto Region' }
    if (resp.id > 251 && resp.id <= 386) { model.description.region = 'Hoenn Region' }
    if (resp.id > 386 && resp.id <= 493) { model.description.region = 'Sinnoh Region' }
    if (resp.id > 493 && resp.id <= 649) { model.description.region = 'Unova Region' }
    if (resp.id > 649 && resp.id <= 721) { model.description.region = 'Kalos Region' }
    if (resp.id > 721 && resp.id <= 809) { model.description.region = 'Alola Region' }
    if (resp.id > 809) { model.description.region = 'Galar Region' }

    if (resp.id > 5) {
        for (let i = 0; i < 10; i++){
            model.interval_id.push(resp.id - 4 + i)
        }
    }
}

const showPokemon = (model) => {
    //Update background colour based on type
    document.body.style.backgroundColor = colours[model.description.types[0]];

    const cardHTML = `
        <div class="logo">
            <img src=${"https://cdn2.bulbagarden.net/upload/4/4b/Pok%C3%A9dex_logo.png"} alt="logo" />
        </div>
        <div class="id">
            <div>
                <span>${formatId(model.national_id)}</span></br>
                <span>${model.names.en}</span>
            </div>
        </div>
        <div class="titleCard">
            <div class="japName">
                <span>${model.names.jp}</span>
            </div>
            <div class="titleImg">
                <img src=${model.art_url} alt="pokeIMG" />
            </div>
        </div>
        <div class="physicalDesc">
            <div>
                <span><strong>Height -</strong> ${model.description.height / 10}m</span>
            </div>
            <div>
                <span><strong>Weight -</strong> ${model.description.weight / 10}kg</span>
            </div>
        </div>
        <div class="region">
            <div>
                <span>Pok&eacutedex - ${model.description.region}</span>
            </div>
        </div>
        <div class="type">
            <div>
                <img src=${"img/Pokemon_Type_Icon_" + model.description.types[0] + ".png"} alt="type" />
                ${model.description.types[1] ? `<img src=${"img/Pokemon_Type_Icon_" + model.description.types[1] + ".png"} alt=""/>` : ''}
            </div>
        </div>
        <div class="statsWrapper">
            <div id="statsLabel">
                <span style="font-size: 1.7rem;">Stats</span>
            </div>
            <div id="statsRow">
                <div class="statsColumn">
                    <span><strong>HP -</strong> ${model.description.stats[0]['hp']}</span>
                    <span><strong>Attack -</strong> ${model.description.stats[1]['attack']}</span>
                    <span><strong>Defence -</strong> ${model.description.stats[2]['defense']}</span>
                </div>
                <div class="statsColumn">
                    <span><strong>Sp. Attack -</strong> ${model.description.stats[3]['special-attack']}</span>
                    <span><strong>Sp. Defence -</strong> ${model.description.stats[4]['special-defense']}</span>
                    <span><strong>Speed -</strong> ${model.description.stats[5]['speed']}</span>
                </div>
            </div>
        </div>
        <div id="pagination"></div>
        <div id="flavor-text"><span>${model.description.flavor_text}</span></div>
    `;
    main.innerHTML = cardHTML;
}

//Load init page on pikachu
generateProfile('pikachu')

//Search on submit utility
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pokemon = search.value;
    if (pokemon) {
        generateProfile(pokemon.toLowerCase());
        search.value = '';
    }

});

//JqueryUI Autocomplete - Search on select Utility
$(function () {
    //try to grab english names
    $.getJSON("/poke-profiles/scripts/data-en.json", function (data) {
        data.sort();
        let prompt = "";
        $("#search").val(prompt).focus(function() { $(this).val(''); }).autocomplete({
            source: function( request, response ) {
                var matches = $.map( data, function(data) {
                  if ( data.toUpperCase().indexOf(request.term.toUpperCase()) === 0 ) {
                    return data;
                  }
                });
                response(matches);
            },
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
                    generateProfile(pokemon.toLowerCase());
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






