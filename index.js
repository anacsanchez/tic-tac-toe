const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const PORT = 8080;

app.use(morgan('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', require('./api.js'))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

