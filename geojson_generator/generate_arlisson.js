const fs = require('fs');
let date = '2020/11/17';
let team = 'Hopes';
let experimentalName = '20201117';
let startLat = 0;
let startLng = 0;
let subGoalNumber = 2;
let goalLat = 0;
let goalLng = 0;

let folderName = './log/' + experimentalName;
let gpsLog = fs.readFileSync(folderName + '/gps.csv', 'utf-8');
let nineaxisLog = fs.readFileSync(folderName + '/nineaxis.csv', 'utf-8');
let gpsLine = gpsLog.split('\n');
let nineaxisLine = nineaxisLog.split('\n');
let arlisson = '';
let i;
let startIdx = 1;

// Add contents
arlisson += '{\n';
arlisson += '\t"date": "' + date + '",\n';
arlisson += '\t"team": "' + team + '",\n';
arlisson += '\t"experimental_name": "' + experimentalName + '",\n';
arlisson += '\t"setting": {\n';
arlisson += '\t\t"start": {\n';
arlisson += '\t\t\t"latitude": ' + startLat + ',\n';
arlisson += '\t\t\t"longitude": ' + startLng + '\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"sub_goal": {\n';
arlisson += '\t\t\t"latitude": [\n';
for(i = 0; i < subGoalNumber; i++){
    arlisson += '\t\t\t\t' + 0;
    if(i != subGoalNumber - 1){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t],\n';
arlisson += '\t\t\t"longitude": [\n';
for(i = 0; i < subGoalNumber; i++){
    arlisson += '\t\t\t\t' + 0;
    if(i != subGoalNumber - 1){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t]\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"goal": {\n';
arlisson += '\t\t\t"latitude": ' + goalLat + ',\n';
arlisson += '\t\t\t"longitude": ' + goalLng + '\n';
arlisson += '\t\t}\n';
arlisson += '\t},\n';
arlisson += '\t"log": {\n';
arlisson += '\t\t"sub_goal": {\n';
arlisson += '\t\t\t"latitude": [\n';
for(i = 0; i < subGoalNumber; i++){
    arlisson += '\t\t\t\t' + 0;
    if(i != subGoalNumber - 1){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t],\n';
arlisson += '\t\t\t"longitude": [\n';
for(i = 0; i < subGoalNumber; i++){
    arlisson += '\t\t\t\t' + 0;
    if(i != subGoalNumber - 1){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t]\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"goal": {\n';
arlisson += '\t\t\t"latitude": ' + goalLat + ',\n';
arlisson += '\t\t\t"longitude": ' + goalLng + '\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"time": [\n';
for(i = 1; i < gpsLine.length - 1; i++){
    let contents = gpsLine[i].split(',');
    contents.splice(contents.indexOf('', 1));
    if(contents[2] == 'nan' || contents[3] == 'nan'){
        startIdx++;
    }else{
        arlisson += '\t\t\t"' + contents[0] + '"';
        if(i != gpsLine.length - 2){
            arlisson += ',\n';
        }else{
            arlisson += '\n';
        }
    }
}
arlisson += '\t\t],\n';
arlisson += '\t\t"gps": {\n';
arlisson += '\t\t\t"latitude": [\n';
for(i = startIdx; i < gpsLine.length - 1; i++){
    let contents = gpsLine[i].split(',');
    arlisson += '\t\t\t\t' + contents[2];
    if(i != gpsLine.length - 2){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t],\n';
arlisson += '\t\t\t"longitude": [\n';
for(i = startIdx; i < gpsLine.length - 1; i++){
    let contents = gpsLine[i].split(',');
    arlisson += '\t\t\t\t' + contents[3];
    if(i != gpsLine.length - 2){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t]\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"azimuth": [\n';
for(i = startIdx; i < nineaxisLine.length - 1; i++){
    let contents = nineaxisLine[i].split(',');
    arlisson += '\t\t\t' + contents[18];
    if(i != nineaxisLine.length - 2){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t]\n';
arlisson += '\t}\n';
arlisson += '}';

fs.writeFile(experimentalName + ".json", arlisson, "utf8", (err) => {
    if(err) console.log(err);
});