async function windowActions() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endpoint);
  const cities = await request.json();

  function findMatches(wordQuery, possibleCities) {
    return possibleCities.filter((place) => {
      // find out if the city or state the query was
      const regex = new RegExp(wordQuery, 'gi');
      return place.name.match(regex) || place.category.match(regex) || place.zip.match(regex);
    });
  }

  const searchInput = document.querySelector('#query');
  const possibleSuggestions = document.querySelector('.suggestions');

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, cities);
    const html = matchArray.map((place) => {
      const regex = new RegExp(event.target.value, 'gi');
      const resName = place.name.replace(regex, `<span class="hl"> ${event.target.value}</span>`);
      const catName = place.category.replace(regex, `<span class="hl"> ${event.target.value}</span>`);
      const zipName = place.zip.replace(regex, `<span class="hl"> ${event.target.value}</span>`);
      return `
            <li>
                <span>${resName}</span> 
                <br/>
                <span class="category">${catName}</span> 
                <br/>
                <span class="address">${place.address_line_1}</span> 
                <br/> 
                <span class="city">${place.city}</span> 
                <br/>
                <span class="zip">${zipName}</span>
                <br/>
            </li> 
            <br/>       
        `;
    }).join('');
    possibleSuggestions.innerHTML = html;
  }

  searchInput.addEventListener('change', displayMatches);

  searchInput.addEventListener('keyup', (event) => {
    if (searchInput.value === '') {
      possibleSuggestions.innerHTML = '';
    } else {
      displayMatches(event);
    }
  });
}
window.onload = windowActions;