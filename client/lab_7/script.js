async function dataHandler() {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  
    const request = await fetch(endpoint);
    const cities = await request.json();
    const accessToken = 'pk.eyJ1Ijoia2Rqb3Vyc2hhcmkiLCJhIjoiY2t1cWdudzIwNHY0MTJvbW44Y3dnMXloYiJ9.oEkujYAs3w0qNFscPtmj7Q'

    // Leaflet map
    const mymap = L.map('mapid').setView([38.7849,-76.8721], 11)
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoia2Rqb3Vyc2hhcmkiLCJhIjoiY2t1cWd1bW03MGM3MTJ2cGoyOGxwOHlkbSJ9.BKKKaI2Q0a6UAKQMKu_HvA'
    }).addTo(mymap);
    const markerGroup = L.layerGroup().addTo(mymap);
  
    function findMatches(wordQuery, possibleCities) {
      return possibleCities.filter((place) => {
        // find out if the city or state the query was
        const regex = new RegExp(wordQuery, 'gi');
        return place.zip.match(regex) || place.name.match(regex);
      });
    }
  
    const searchInput = document.querySelector('#query');
    const possibleSuggestions = document.querySelector('.suggestions');
  
    function displayMatches(event) {
      const matchArray = findMatches(event.target.value, cities);
      const filteredList = matchArray.splice(0,5);
      if (!searchInput.value) {
        possibleSuggestions.innerHTML = '';
        markerGroup.clearLayers();
      } else {
          markerGroup.clearLayers();
          const html = filteredList.map((place) => {
            const points = place.geocoded_column_1;
            const coords = points.coordinates;
            const marker = coords.slice().reverse();
            singleMarker = L.marker(marker).addTo(markerGroup);
            singleMarker.bindPopup(place.name);
            const regex = new RegExp(event.target.value, 'gi');
            const resName = place.name.replace(regex, `<span class="hl"> ${event.target.value}</span>`);
            return `
                <li class="box result">
                    <span>${resName}</span> 
                    <br/>
                    <span>${place.category}</span> 
                    <br/>
                    <span>${place.address_line_1}, ${place.city}</span> 
                    <br/>
                </li>      
            `;
        }).join('');
        let firstLoc = filteredList[0].geocoded_column_1.coordinates.slice().reverse()
        mymap.flyTo(firstLoc, 12.5);
        possibleSuggestions.innerHTML = html;
    }
    }
  
    searchInput.addEventListener('change', displayMatches)
  
    searchInput.addEventListener('submit', (event) => {
        displayMatches(event);
    });
  }

  window.onload = dataHandler;