// ########################Ç±Ç±Ç©ÇÁîCà”ÇÃê›íË########################
// Ideal Coordinate
let startCoordinate = [35.6433167, 139.5236433];
let samplingCoordinate1 = [35.6432850, 139.5235217];
let samplingCoordinate2 = [35.6431950, 139.5235183];
let goalCoordinate = [35.6431617, 139.5233283];

// Estimated Coordinate
let estimatedSamplingCoordinate1 = [35.6432717, 139.5235500];
let estimatedSamplingCoordinate2 = [35.6432017, 139.5235450];
let estimatedGoalCoordinate = [35.6431467, 139.5233483];
// ########################Ç±Ç±Ç‹Ç≈îCà”ÇÃê›íË########################

let map;
// Japan map
let japanMap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>ínóùâ@É^ÉCÉã</a>",
    maxZoom: 30,
    maxNativeZoom: 18
});
// World map
let worldMap = L.tileLayer('http://{s}.tile.stamen.com/{variant}/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
    variant: 'toner-lite',
    maxZoom: 30,
    maxNativeZoom: 20
});

function makeMap(){
    $.getJSON('./geojson/real_path.geojson', (realPathData) => {
        $.getJSON("./geojson/arrow_point_azimuth.geojson", (azimuthData) => {
            $.getJSON("./geojson/arrow_point.geojson", (arrowPointData) => {
                let targetPoints, idealPath, realPath, realPoints, arrows;
                targetPoints = updateTargetPoints();
                idealPath = updateIdealPath();
                realPoints = updateRealPoints();
                realPath = updateRealPath(realPathData);
                arrows = updateArrows(arrowPointData, azimuthData);

                let baseMaps = {
                    "Japan": japanMap,
                    "World": worldMap
                }
                let overlayMaps = {
                    "Target points": targetPoints,
                    "Ideal path": idealPath,
                    "Real points": realPoints,
                    "Real path": realPath,
                    "Direction": arrows,
                }

                map = L.map('mapid', {
                    center: [35.658137599999996, 139.5392512],
                    zoom: 14,
                    layers: [
                        worldMap,
                        targetPoints,
                        idealPath,
                        realPoints,
                        realPath,
                        arrows
                    ]
                });

                L.control.layers(baseMaps, overlayMaps).addTo(map);

                // rotateArrows(arrows, azimuthData);
                // map.on('zoomstart', function(e){rotateArrows(arrows, azimuthData);});
                // map.on('zoomend', function(e){rotateArrows(arrows, azimuthData);});
                // map.on('zoom', function(e){rotateArrows(arrows, azimuthData);});
            });
        });
    });
}

function updateTargetPoints(){
    let start = L.circle(startCoordinate, {color: 'blue', radius: 0.1});
    let sample01 = L.circle(samplingCoordinate1, {color: 'yellow', radius: 0.1});
    let sample02 = L.circle(samplingCoordinate2, {color: 'green', radius: 0.1});
    let goal = L.circle(goalCoordinate, {color: 'red', radius: 0.1});
    return L.layerGroup([start, sample01, sample02, goal]);
}

function updateRealPoints(){
    let realSampling1 = L.circle(estimatedSamplingCoordinate1, {color: 'orange', radius: 0.1});
    let realSampling2 = L.circle(estimatedSamplingCoordinate2, {color: '#66cdaa', radius: 0.1});
    let realGoal = L.circle(estimatedGoalCoordinate, {color: '#000000', radius: 0.1});
    return L.layerGroup([realSampling1, realSampling2, realGoal]);
}

function updateIdealPath(){
    let path = L.polyline([
        startCoordinate,
        samplingCoordinate1,
        samplingCoordinate2,
        goalCoordinate
    ],{
        "color": "#0000FF",
        "weight": 1,
        "opacity": 1
    });
    return L.layerGroup([path]);
}

function updateRealPath(data){
    let path = L.geoJson(data,{
        style: function(feature){
            return {color: "#FF0000"};
        }
    });
    return L.layerGroup([path]);
}

function updateArrows(coordinate, azimuth){
    let i;
    let arrowLength = 0.00001;
    let latlng = coordinate.features[0].geometry.coordinates;
    let degree = azimuth.features[0].geometry.azimuth;
    let arrows = [];
    for(i = 0; i < latlng.length; i++){
        let rotatedLat = latlng[i][1] - arrowLength * Math.sin(Math.PI / 180 * (degree[i] + 90));
        let rotatedLng = latlng[i][0] + arrowLength * Math.cos(Math.PI / 180 * (degree[i] + 90));
        let vector = L.polyline([
            L.latLng(latlng[i][1], latlng[i][0]),
            L.latLng(rotatedLat, rotatedLng)
        ]);
        let root = L.circle(L.latLng(latlng[i][1], latlng[i][0]), {radius: 0.1});
        arrows.push(vector);
        arrows.push(root);
    }
    return L.layerGroup(arrows); 
}

function rotateArrows(arrows, data){
    let i;
    let azimuth = data.features[0].geometry.azimuth;
    for(i = 0; i < Object.keys(arrows._layers).length; i++){
        let arrow = document.getElementsByClassName('arrow-icon-' + i);
        let translated3d = arrow[0].style.transform;
        let angle = azimuth[i] + 180;
        arrow[0].style.transform = translated3d + " rotate("+ angle +"deg)";
        arrow[0].style.transformOrigin = "50% 50%";
    }
}