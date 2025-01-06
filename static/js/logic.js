// Create a map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// A function to determine the marker size based on the population
function markerSize(earthquakemagnitude) {
    return 100000 + (earthquakemagnitude * 8);
}

// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Get the data with d3.
d3.json(geoData).then(function (data) {

    // Loop through the countries array, and create one marker for each country object.
    for (let i = 0; i < data.features.length; i++) {

         // Conditionals for features geometry.coordinates
         let fillColor = "";
         if (data.features[i].geometry.coordinates[2] < 10) {
             fillColor = "#d9e861";
         }
         else if (data.features[i].geometry.coordinates[2] < 30) {
             fillColor = "#bde354";
         }
         else if (data.features[i].geometry.coordinates[2] < 50) {
             fillColor = "#99dc44";
         }
         else if (data.features[i].geometry.coordinates[2] < 70) {
             fillColor = "#86d83b";
         }
         else if (data.features[i].geometry.coordinates[2] < 90) {
             fillColor = "#74d533";
         }
         else {
             color = "#74d533";
         }
         // Add circles to the map.
         L.circle(data.features[i].geometry.coordinates.slice(0, 2).reverse(), {
             fillOpacity: 0.75,
             color: "white",
             fillColor: fillColor,
 
             // Adjust the radius.
             radius: markerSize(data.features[i].properties.mag)
         }).bindPopup(`<h1>${data.features[i].properties.title}</h1>`).addTo(myMap);
     }
     let legend = L.control({ position: 'bottomright' });
 
     legend.onAdd = function () {
 
         let div = L.DomUtil.create('div', 'info legend');
         let grades = [0, 10, 30, 50, 70, 90];
         let labels = ["#d9e861", "#bde354", "#99dc44", "#86d83b", "#74d533"];
         div.innerHTML += "<h1>earthquake depth</h1>";
         // loop through our density intervals and generate a label with a colored square for each interval
         for (let i = 0; i < grades.length; i++) {
             div.innerHTML +=
                 '<i style="background:' + labels[i] + '"></i> ' +
                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + 'km<br>' : '+');
         }
 
         return div;
     };
 
     legend.addTo(myMap);
 });