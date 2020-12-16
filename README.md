# RouteVisualizer
## 実行手順
1. Node.jsを用意する

https://nodejs.org/ja/download/

2. データを用意する

ローバーのログとして出てくるものに対応しているので，基本的に`./geojson_generator/log`のなかに`gps.csv`と`nineaxis.csv`が入ったフォルダ(ここではフォルダ名`hogehoge`を想定)を保存しましょう．

一応，対応しているカラム構造は以下の通りです．
+ `gps.csv`

|time(h：m：s)|Satellites|Latitude|Longitude|Altitude|Time|Course|Speed|
|----|----|----|----|----|----|----|----|

+ `nineaxis.csv`

|time(h:m:s)|ax|ay|az|anorm|rx|ry|rz|mx(raw)|my(raw)|mz(raw)|mx(calib)|my(calib)|mz(calib)|mx(calib&flt)|my(calib&flt)|mz(calib&flt)|azimuth(calib)|azimuth(calib&flt)|
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|

保存した後のフォルダ構造は以下のようになっているはずです．
```
geojson_generator
┣ generate_arlisson.js
┗ log
  ┗ hogehoge
    ┣ gps.csv
    ┗ nineaxis.csv
```

3. `generate_arlisson.js`の中身をチョイ変

実験実施日，チーム名，実験名(ここでは`hogehoge`)，スタートとゴールの座標，サブゴール数を指定しましょう．
```js
let date = 'Experimental Date';
let team = 'Your Team Name';
let experimentalName = 'hogehoge';
let startLat = 0;
let startLng = 0;
let subGoalNumber = 2;
let goalLat = 0;
let goalLng = 0;
```

分からなかったら，手順4.の後でJSONの中身を編集しましょう．

4. 以下のコマンドを実行

```
$ node generate_arlisson.js
```

実行したら，`hogehoge.json`が出力されます．フォルダ構造はこんな感じ．

```
geojson_generator
┣ generate_arlisson.js
┣ hogehoge.json
┗ log
  ┗ hogehoge
    ┣ gps.csv
    ┗ nineaxis.csv
```

5. `hogehoge.json`を`./map_for_arliss/public/json/`の中にコピー

フォルダ構造は以下のようになります．

```
map_for_arliss
┣ public
│ ┣ css
│ ┣ js
│   ┗ create_map.js
│ ┗ json
│   ┗ hogehoge.json
┗ server.js
```

6. `create_map.js`の中身をチョイ変

AjaxでとってくるJSONファイル名を`hogehoge.json`に変更

```js
function makeMap(){
    $.getJSON('./json/hogehoge.json', (log) => {
```

7. 以下のコマンドでサーバを起動

```
$ node server.js
```

8. 以下のページにアクセス
http://localhost:3000
