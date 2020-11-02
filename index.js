'use strict';

const baseURL = 'https://bikewise.org:443/api/v2/locations/markers'


const options = {
  method: 'GET',
  mode: 'cors',
 
};


function getData(terms, location) {
    const param = {
        query: terms,
        proximity: location
    }
        
    const qString = buildString(param)
    const url = baseURL + '?' + qString
    console.log(url)

    fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => showInfo(responseJson))
    .catch(err => {
      $('#results').text(`Something went wrong: ${err.message}`);
    });
}

function showInfo(responseJson) {
    $('#results').empty()
    let rf = responseJson.features
    for (let i=0; i < responseJson.features.length; i++) {
      $('#results').append(`<h2>${rf[i].properties.title}</h2>
        <br><p>${rf[i].properties.description}</p><br>${rf[i].geometry.coordinates}<hr>`)
    }
    
}

function buildString(param) {
    const queryItems = Object.keys(param)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`)
    return queryItems.join('&');
}


function readForm() {
    $('form').submit(e => {
        e.preventDefault()
        const terms = $('#searchBar').val()
        const location = $('#location').val()
        console.log(terms, location)
        getData(terms, location)
    })
    
}

$(readForm)