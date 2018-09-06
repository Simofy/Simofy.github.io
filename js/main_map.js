mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltb2Z5IiwiYSI6ImNqZ2RxbTYyNTBzcmUycW54NTBndWttaGkifQ.DHN8biziVIwJcBsjzeBLeg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-0.01922607421875,
      52.97180028087255],
    zoom: 5.00
});
map.addControl(new mapboxgl.NavigationControl());
//transporto juostos
//https://opendata.arcgis.com/datasets/0fdec79d8c5d4d36a67655b0cb1a5f8e_0.geojson

//stotelse
//https://opendata.arcgis.com/datasets/f21d2712be664965b1a3980383689834_0.geojson

map.on('load', function () {
    // Add a layer showing the places.

    map.addSource("routes", {
        "type": "geojson",
        "data":data
    });
    map.addLayer({
        "id": "routes",
        "type": "line",
        "source": "routes",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#000",
            "line-width": {
              'base': 3,
              'stops': [[12, 2], [22, 180]]
            }
        }
    });
 



    map.on('click', 'routes', function (e) {
    });
    map.on('mouseenter', 'routes', function (e) {

    });

    map.on('mouseleave', 'routes', function (e) {

    });
    map.on('mousemove', 'routes', function (e) {
   
    });
   


});
