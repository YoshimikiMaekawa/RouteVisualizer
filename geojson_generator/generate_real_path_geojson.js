// require node.js
const fs = require('fs');

let gps = fs.readFileSync("20201117_2358_log_gps1.csv", "utf8");
let line = gps.split("\n");
let i = 0;

let geojson = '';
geojson += '{"type":"FeatureCollection",\n';
geojson += '"features":[\n';
geojson += '{"type":"Feature",\n';
geojson += '"properties":{"stroke": "red"},\n';
geojson += '"geometry":{\n';
geojson += '"type":"LineString",\n';
geojson += '"coordinates":[\n';

for(i = 1; i < line.length - 1; i++){
    data = line[i].split(',');
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

fs.writeFile("real_path.geojson", geojson, "utf8", (err) => {
    if(err) console.log(err);
});