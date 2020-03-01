const express = require('express');

const app = express();
const port = 4000

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('')
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
})