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
        <br><p>${rf[i].properties.description}</p><br>${rf[i].geometry.coordinates}`)
        
     

      var lat = `${rf[i].geometry.coordinates[1]}`
      var lon = `${rf[i].geometry.coordinates[0]}`
      
      
      //$('#results').append(`<div id="mapid"></div><hr>`)
      addMaps(lat, lon)
      
    }
    
}



function addMaps(lat, lon) {
  var mymap = L.map('mapid').setView([lat, lon], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiZmluazYxMiIsImEiOiJja2gyNW02cngwOGk2MnptejR3bGY1eHdyIn0.1vtv_OlheSQGcC6akM79Tg'
  }).addTo(mymap);
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
