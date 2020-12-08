// require node.js
const fs = require('fs');

let interval = 600; // Set this parapeter
let gps = fs.readFileSync("gpsWithAzimuth.csv", "utf8");
let line = gps.split("\n");
let i = 0;

// Arrow point
let geojson = '';
geojson += '{"type":"FeatureCollection",\n';
geojson += '"features":[\n';
geojson += '{"type":"Feature",\n';
geojson += '"properties":{"marker-color": "red"},\n';
geojson += '"geometry":{\n';
geojson += '"type":"MultiPoint",\n';
geojson += '"coordinates":[\n';

for(i = 1; i < line.length - 1; i+=interval){
    var data = line[i].split(',');
    geojson += '[' + data[3] + ',' + data[2] + ']'; //経度・緯度の順番
    if(i != line.length - 2){
        geojson += ',\n';
    }else{
        geojson += '\n';
    }
}

geojson += ']\n';
geojson += '}\n';
geojson += '}\n';
geojson += ']\n';
geojson += '}';

// Azimuth geojson
let azimuth = '';
azimuth += '{"type":"FeatureCollection",\n';
azimuth += '"features":[\n';
azimuth += '{"type":"Feature",\n';
azimuth += '"properties":{"marker-color": "red"},\n';
azimuth += '"geometry":{\n';
azimuth += '"type":"MultiPoint",\n';
azimuth += '"azimuth":[\n';

for(i = 1; i < line.length - 1; i+=interval){
    var data = line[i].split(',');
    azimuth += data[8]; //方角
    if(i != line.length - 2){
        azimuth += ',\n';
    }else{
        azimuth += '\n';
    }
}

azimuth += ']\n';
azimuth += '}\n';
azimuth += '}\n';
azimuth += ']\n';
azimuth += '}';

fs.writeFile("arrow_point.geojson", geojson, "utf8", (err) => {
    if(err) console.log(err);
});

fs.writeFile("arrow_point_azimuth.geojson", azimuth, "utf8", (err) => {
    if(err) console.log(err);
});