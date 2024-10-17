const pokemonList = document.getElementById('pokemon-list');
const pokemonDetails = document.getElementById('pokemon-details');
const loadingElement = document.getElementById('loading');
const modal = document.getElementById('pokemonModal');
const closeBtn = document.getElementsByClassName('close')[0];

async function fetchPokemonData() {
    try {
        for (let i = 1; i <= 200; i++) {
            const pokemonData = await fetchSinglePokemon(i);
            if (pokemonData) {
                const card = createPokemonCard(pokemonData);
                pokemonList.appendChild(card);
            }
        }
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        pokemonList.innerHTML += `<p>An error occurred while fetching Pokémon data. Please try again later.</p>`;
    } finally {
        loadingElement.style.display = 'none';
    }
}

async function fetchSinglePokemon(id) {
    try {
        const response = await fetch(`${'https://pokeapi.co/api/v2/pokemon/'}${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const speciesResponse = await fetch(data.species.url);
        if (!speciesResponse.ok) throw new Error(`HTTP error! status: ${speciesResponse.status}`);
        const speciesData = await speciesResponse.json();
        return { ...data, speciesData };
    } catch (error) {
        console.error(`Error fetching Pokémon ${id}:`, error);
        return null;
    }
}

function createPokemonCard(data) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
        <h3>${data.name}</h3>
        <img src="${data.sprites.front_default}" alt="${data.name}">
    `;
    card.addEventListener('click', () => displayPokemonDetails(data));
    return card;
}

function displayPokemonDetails(data) {
    const { speciesData } = data;
    const types = data.types.map(type => type.type.name).join(', ');
    const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
    const eggGroups = speciesData.egg_groups.map(group => group.name).join(', ');

    pokemonDetails.innerHTML = `
        <div class="details-container">
            <div class="left-column">
                <div class="pokemon-image">
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                </div>
                <div class="stat-group">
                    <h3>Basic Information</h3>
                    <ul>
                        <li><strong>Name:</strong> ${data.name}</li>
                        <li><strong>National No:</strong> ${speciesData.id}</li>
                        <li><strong>Type:</strong> ${types}</li>
                        <li><strong>Species:</strong> ${speciesData.genera.find(g => g.language.name === 'en').genus}</li>
                        <li><strong>Height:</strong> ${data.height / 10} m</li>
                        <li><strong>Weight:</strong> ${data.weight / 10} kg</li>
                        <li><strong>Abilities:</strong> ${abilities}</li>
                        <li><strong>Local No:</strong> ${data.id}</li>
                    </ul>
                </div>
            </div>
            <div class="right-column">
                <div class="stat-group">
                    <h3>Training</h3>
                    <ul>
                        <li><strong>EV Yield:</strong> ${data.base_experience}</li>
                        <li><strong>Catch Rate:</strong> ${speciesData.capture_rate}</li>
                        <li><strong>Base Friendship:</strong> ${speciesData.base_happiness}</li>
                        <li><strong>Base Experience:</strong> ${data.base_experience}</li>
                        <li><strong>Growth Rate:</strong> ${speciesData.growth_rate.name}</li>
                    </ul>
                </div>
                <div class="stat-group">
                    <h3>Breeding</h3>
                    <ul>
                        <li><strong>Egg Groups:</strong> ${eggGroups}</li>
                        <li><strong>Gender Ratio:</strong> ${speciesData.gender_rate}</li>
                        <li><strong>Egg Cycles:</strong> ${speciesData.hatch_counter} cycles</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

fetchPokemonData();