const express = require("express");
const app  = express();
const port = 3000;

app.use(express.static('public'));

// ルーティングの設定
app.get("/", (req, res) =>{
  res.sendFile(`${__dirname}/index.html`);
});

// HTTPサーバを起動する
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});