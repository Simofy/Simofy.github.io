mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltb2Z5IiwiYSI6ImNqZ2RxbTYyNTBzcmUycW54NTBndWttaGkifQ.DHN8biziVIwJcBsjzeBLeg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [25.279652, 54.687157],
    zoom: 12.00
});
map.addControl(new mapboxgl.NavigationControl());
//transporto juostos
//https://opendata.arcgis.com/datasets/0fdec79d8c5d4d36a67655b0cb1a5f8e_0.geojson

//stotelse
//https://opendata.arcgis.com/datasets/f21d2712be664965b1a3980383689834_0.geojson
var selectedRoute = 1;
var routesToCheck = [];
function test(i) {
    routesToCheck.forEach(element =>{
        if(element.id == i){
            //map.setPaintProperty(String(i), 'fill-color', "#fff");
            map.setLayoutProperty("route_"+String(selectedRoute), 'visibility','none');
            selectedRoute = i;
            map.setLayoutProperty("route_"+String(i), 'visibility','visible');
            return false;
        }
    });
    
    //document.getElementById(i).style.visibility='visible';
}
map.on('load', function () {
    // Add a layer showing the places.

    map.addSource("routes", {
        "type": "geojson",
        "data":"https://opendata.arcgis.com/datasets/0fdec79d8c5d4d36a67655b0cb1a5f8e_0.geojson"
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
            "line-color": "#a3a3c2",
            "line-width": {
              'base': 2,
              'stops': [[12, 2], [22, 180]]
            }
        }
    });
    for(let i = 1; i <= 206; i++){
        map.addLayer({
            "id":"route_"+ String(i),
            "type": "line",
            "source": "routes",
            "layout": {
                "line-join": "round",
                "visibility" : "none",
                "line-cap": "round"
            },
            "paint": {
                "line-color":[
                    'match',
                    ['get', 'AUTOTIPAS'],
                    1, '#262626',
                    2, '#00ff00',
                    3, '#0000ff',
                    4, '#ff5050',
                    /* other */ '#ff3300'
                ],
                "line-width": {
                  'base': 1.5,
                  'stops': [[12, 2], [22, 180]]
                }
            },
            "filter": ["==", "OBJECTID",i]
        });
    }



    map.addLayer({
        "id": "stops",
        "type": "circle",
        "source": {
            "type": "geojson",
            "data":"https://opendata.arcgis.com/datasets/f21d2712be664965b1a3980383689834_0.geojson"
        },
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 1.75,
                'stops': [[12, 2], [22, 500]]
            },
            'circle-color': [
                'match',
                ['get', 'WiFi'],
                'yra', '#1aff1a',
                /* other */ '#ff3300'
            ]
        }
    });
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    var routes_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    var routes_hover_flag = true;
    var routes_hover_disable_flag = false;
    map.on('click', function (e) {
        routes_hover_flag = true;
    });

    map.on('click', 'routes', function (e) {
        if(routes_hover_disable_flag)return false;
        routes_hover_flag = false;
        routes_popup.remove();
        let html_string ='';
        e.features.forEach(element => {
            let properties = element.properties;
            //MARSRUTONR
            //KRYPTIS
            routesToCheck.push({id:properties.OBJECTID, element:element});
            let toAdd_id ='id=\"' + properties.OBJECTID + '\"';
            let toAdd = '<div class=\"routes-popup-style-static\" '+toAdd_id+' onclick=\"test('+properties.OBJECTID+')\"><div align=\"center\" style=\"display: inline-block;border-radius: 8px;color:white;padding: 0px 4px 0px 4px;';
            switch (properties.AUTOTIPAS) {
                case 4://troleibusas
                    toAdd += 'background: red;\">'+properties.MARSRUTONR+'</div> Kryptis:'+properties.KRYPTIS+'</div>';
                break;
                case 3://busas
                    toAdd += 'background: blue;\">'+properties.MARSRUTONR+'</div> Kryptis:'+properties.KRYPTIS+'</div>';
                break;
                case 2://greitasis busas
                    toAdd += 'background: green;\">'+properties.MARSRUTONR+'</div> Kryptis:'+properties.KRYPTIS+'</div>';
                break;
                case 1: //naktinis
                    toAdd += 'background: black;\">'+properties.MARSRUTONR+'</div> Kryptis:'+properties.KRYPTIS+'</div>';
                break;
                default:
                //toAdd += 'background: black;\"></div>';
                break;
            }
            html_string+=toAdd;
            
        });
        routes_popup.setLngLat(e.lngLat)
        .setHTML(html_string);

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(html_string)
            .addTo(map);
    });
    map.on('mouseenter', 'routes', function (e) {
        if(routes_hover_disable_flag)return false;
        if(routes_hover_flag){

            routes_popup.setLngLat(e.lngLat)
            .addTo(map);
        }
    });

    map.on('mouseleave', 'routes', function (e) {
        routes_popup.remove();
    });
    map.on('mousemove', 'routes', function (e) {
        if(routes_hover_disable_flag)return false;
        if(routes_hover_flag){
            let html_string ='';
            e.features.forEach(element => {
                
                let properties = element.properties;
                //MARSRUTONR
                //KRYPTIS
                let toAdd = '<div class=\"routes-popup-style\"><div align=\"center\" style=\"display: inline-block;border-radius: 8px;color:white;padding: 0px 4px 0px 4px;';
                switch (properties.AUTOTIPAS) {
                    case 4://troleibusas
                    toAdd += 'background: red;\">'+properties.MARSRUTONR+'</div> Kryptis:'+properties.KRYPTIS+'</div>';
                    break;
                    case 3://busas
                    toAdd += 'background: blue;\">'+properties.MARSRUTONR+'</div> Kryptis:'+properties.KRYPTIS+'</div>';
                    break;
                    case 2://greitasis busas
                    toAdd += 'background: green;\">'+properties.MARSRUTONR+'</div> Kryptis:'+properties.KRYPTIS+'</div>';
                    break;
                    case 1: //naktinis
                    toAdd += 'background: black;\">'+properties.MARSRUTONR+'</div> Kryptis:'+properties.KRYPTIS+'</div>';
                    break;
                    default:
                    toAdd += 'background: black;\"></div>';
                    break;
                }
                html_string+=toAdd;
                
            });
            routes_popup.setLngLat(e.lngLat)
            .setHTML(html_string);
        }
    });
    map.on('mouseenter', 'stops', function (e) {
        routes_hover_disable_flag = true;
        routes_popup.remove();
    });
    map.on('mouseleave', 'stops', function (e) {
        routes_hover_disable_flag = false;
    });
    map.on('click', 'stops', function (e) {
    let coordinates = e.features[0].geometry.coordinates.slice();
    let properties = e.features[0].properties;
    let html_string = '<div class=\"stops-popup-style\"><h3>'+properties.PAVADIN+'</h3>';

    html_string += '<div>'+properties.GATVE+', kryptis:'+properties.KRYPTIS+'</div>';
    if(properties.Autobusai != " ")
        html_string += '<div>Autobusai:</div><div style=\"color:blue\">'+properties.Autobusai+'</div>';
    if(properties.Troleibusai != " ")
        html_string += '<div>Troleibusai:</div><div style=\"color:red\">'+properties.Troleibusai+'</div>';
    if(properties.Naktiniai_autobusai != " ")
        html_string += '<div>Naktiniai autobusai: '+properties.Naktiniai_autobusai+'</div>';
    html_string += '<div>WiFi: '+properties.WiFi+'</div>';
    //'<a href='+properties.NUORODA+' target=\"_blank\">stops.lt</a>'
    html_string += '<a href='+properties.NUORODA+' target=\"_blank\">stops.lt</a>';
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(html_string+'</div>')
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'stops', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'stops', function () {
        map.getCanvas().style.cursor = '';
    });



    var url = 'https://m.stops.lt/vilnius/gps.txt';
    
    var geojson_transport_live = {
        "type": "FeatureCollection",
        "features": []
    };
    window.setInterval(function() {
       
        $.get( url, function( data ) {
            let text = data;
            let tranArr = text.split('\n');
            //console.log(tranArr);
            geojson_transport_live.features = [];
            tranArr.forEach(element => {
                if(element != "" ){
                    let paroperties = element.split(',');
                    let type = paroperties[0];
                    let name = paroperties[1];
                    let lat = paroperties[2];
                    let lon = paroperties[3];
                    let latReal = lat.slice(0,2) + '.' + lat.slice(2);
                    let lonReal = lon.slice(0,2) + '.' + lon.slice(2);
                    geojson_transport_live.features.push({"type": "Feature","geometry":{"type": "Point","coordinates": [latReal, lonReal]}, "properties": {"type":type, "name":name}});
                }
            });

          });

        map.getSource('liveTransport').setData(geojson_transport_live);
    }, 2000);
    map.addSource('liveTransport', { type: 'geojson', data: geojson_transport_live });


    map.addLayer({
        "id": "liveTransport",
        "type": "circle",
        "source": "liveTransport",
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 1.75,
                'stops': [[12, 2], [22, 500]]
            },
            'circle-stroke-width':  {
                'base': 2,
                'stops': [[12, 1], [22, 2]]
            },
            'circle-color': [
                'match',
                ['get', 'type'],
                '2','#0066ff',
                '1', '#ff6666',
                /* other */ '#ff00ff'
            ]
        }
    });
    var traffic_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    map.on('mouseenter', 'liveTransport', function (e) {
            traffic_popup.setLngLat(e.lngLat)
            .addTo(map);
            routes_hover_disable_flag = true;
            routes_popup.remove();
    });

    map.on('mouseleave', 'liveTransport', function (e) {
        traffic_popup.remove();
        routes_hover_disable_flag = false;
    });
    map.on('mousemove', 'liveTransport', function (e) {
            let html_string ='';
            let properties = e.features[0].properties;
            //MARSRUTONR
            //KRYPTIS
            let toAdd = '<div><div align=\"center\" style=\"display: inline-block;border-radius: 8px;color:white;padding: 0px 4px 0px 4px;';
            switch (properties.type) {
                case '1'://troleibusas
                toAdd += 'background: red;\">'+properties.name+'</div></div>';
                break;
                case '2'://busas
                if(properties.name.search('G') == -1){
                    toAdd += 'background: blue;\">'+properties.name+'</div></div>';
                }else{
                    toAdd += 'background: green;\">'+properties.name+'</div></div>';
                }
                break;
            }
            html_string+=toAdd;
            traffic_popup.setLngLat(e.lngLat)
            .setHTML(html_string);
    });
});
