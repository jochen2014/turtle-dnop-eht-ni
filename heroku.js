const express = require('express');
const port = process.env.PORT || 3000;

const app = express()
app.use(express.static('./dist'));

app.listen(port)
console.log('server listening on http://localhost:' + port);