
let lan_data_lt = {
    
    "lan-abuot-text": "Magistro studentas studijuojantis Vilniaus kolegijos programų sistemas. Aš\
    matau save kaip socialų žmogų, kuris gali lengvai susikalbėti su žmonėmis. Aš ieškau praktikops\
     ir vietos kurioje galėčiau pradėti savo karjerą.",
    "lan-traits": "Bruožai",
    "lan-teamworking": "Komandinis darbas",
    "lan-punctual": "Punktualus",
    "lan-self": "Motyvuotas",
    "lan-perf": "Perfekcionistas",
    "lan-resp": "Atsakingas",
    "lan-contacts": "Kontaktai",
    "lan-skills": "Įgūdžiai ir Sąvybės",
    "lan-projects":"Projektai",
    "lan-game-intro":"Žaidimas sukurtas per pora dienų olimpiadai nuo nulio naudojant c++11.",
    "lan-search":"Paieškos algoritmas realizuojant c++ ir naudojant UI",
    "lan-tree":"UI parašytas nuo nulio naudojant tik c++.",
    "lan-puzzle":"Puzzle žaidimas parašytas JavaScript.",
    "lan-evolution":"Besimokinantis genetinis algoritmas parašytas JavaScript.",
    "lan-inf":"Infinity ženklas suprogramuotas c++"

};
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split(/&(?=(?:(?:[^"]*"){2})*[^"]*$)/),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split(/=(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
var lan = getUrlParameter("lan") == undefined ? "en" : getUrlParameter("lan");

    if (lan != undefined && lan == "lt") {
        for (var id in lan_data_lt) {
            let elm = document.getElementById(id)
                    if(elm != undefined){
                elm.innerText = lan_data_lt[id];
            }
        }
    }