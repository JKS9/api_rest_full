const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const routes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

routes(app);

mongoose.connect('mongodb+srv://test:11981997@cluster0-dk66t.gcp.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(result => {
    app.listen(port);
    console.log('Your first node api is running on port: ' + port);
}).catch(err => console.log(err));

module.exports = app;
