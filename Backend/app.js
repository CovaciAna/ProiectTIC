//server app
const express = require('express');
const httpLogger = require('morgan');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(httpLogger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// import rute
const patientsRoute = require('./routes/patients');
const mealsRoute = require('./routes/meals');


// adaugare rute
app.use('/patients', patientsRoute);
app.use('/meals', mealsRoute);
app.use('/api/patients', patientsRoute);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
