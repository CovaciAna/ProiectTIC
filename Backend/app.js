//server app
const express = require('express');
const httpLogger = require('morgan');
const cors = require('cors');

const app = express();

const port = 3000;

app.use(httpLogger('dev'));
app.use(cors()) 
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) 

app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  
  app.post('/data', (req, res) => {
    let data = req.body
    console.log('trying to post the following data: ', data)
    res.send('Succes')
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  });