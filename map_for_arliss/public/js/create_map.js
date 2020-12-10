// ########################��������C�ӂ̐ݒ�########################
// Ideal Coordinate
let startCoordinate = [35.6433167, 139.5236433];
let samplingCoordinate1 = [35.6432850, 139.5235217];
let samplingCoordinate2 = [35.6431950, 139.5235183];
let goalCoordinate = [35.6431617, 139.5233283];

// Estimated Coordinate
let estimatedSamplingCoordinate1 = [35.6432717, 139.5235500];
let estimatedSamplingCoordinate2 = [35.6432017, 139.5235450];
let estimatedGoalCoordinate = [35.6431467, 139.5233483];
// ########################�����܂ŔC�ӂ̐ݒ�########################

let map;
// Japan map
let japanMap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>�n���@�^�C��</a>",
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
    $.getJSON('./json/20201210_01.json', (log) => {
        let targetPoints, idealPath, realPath, realPoints, arrows;
        targetPoints = updateTargetPoints(log);
        idealPath = updateIdealPath(log);
        realPoints = updateRealPoints();
        realPath = updateRealPath(log);
        arrows = updateArrows(log);

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
    });
}

function updateTargetPoints(data){
    let start = L.circle(L.latLng(data.log.start.latitude, data.log.start.longitude), {color: 'blue', radius: 0.1});
    let sample01 = L.circle(samplingCoordinate1, {color: 'yellow', radius: 0.1});
    let sample02 = L.circle(samplingCoordinate2, {color: 'green', radius: 0.1});
    let goal = L.circle(L.latLng(data.log.goal.latitude, data.log.goal.longitude), {color: 'red', radius: 0.1});
    return L.layerGroup([start, sample01, sample02, goal]);
}

function updateIdealPath(data){
    let path = L.polyline([
        L.latLng(data.log.start.latitude, data.log.start.longitude),
        samplingCoordinate1,
        samplingCoordinate2,
        L.latLng(data.log.goal.latitude, data.log.goal.longitude)
    ],{
        "color": "#0000FF",
        "weight": 1,
        "opacity": 1
    });
    return L.layerGroup([path]);
}

function updateRealPoints(){
    let realSampling1 = L.circle(estimatedSamplingCoordinate1, {color: 'orange', radius: 0.1});
    let realSampling2 = L.circle(estimatedSamplingCoordinate2, {color: '#66cdaa', radius: 0.1});
    let realGoal = L.circle(estimatedGoalCoordinate, {color: '#000000', radius: 0.1});
    return L.layerGroup([realSampling1, realSampling2, realGoal]);
}

function updateRealPath(data){
    let i;
    let coordinates = [];
    for(i = 0; i < data.log.gps.latitude.length; i++){
        coordinates.push(L.latLng(data.log.gps.latitude[i], data.log.gps.longitude[i]));
    }
    let path = L.polyline(
        coordinates,
        {
            "color": "#FF0000",
            "weight": 2,
            "opacity": 1
        }
    );
    return L.layerGroup([path]);
}

function updateArrows(data){
    let i;
    let interval = 200;
    let arrowLength = 0.00001;
    let arrows = [];
    for(i = 0; i < data.log.azimuth.length; i += interval){
        let coordinates = L.latLng(data.log.gps.latitude[i], data.log.gps.longitude[i]);
        let rotatedCoordinates = L.latLng(
            data.log.gps.latitude[i] + arrowLength * Math.sin(Math.PI / 180 * (data.log.azimuth[i])),
            data.log.gps.longitude[i] + arrowLength * Math.sin(Math.PI / 180 * (data.log.azimuth[i]))
        );
        let arrow = L.polyline(
            [coordinates, rotatedCoordinates]
        );
        let root = L.circle(coordinates, {radius: 0.1});
        arrows.push(arrow);
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