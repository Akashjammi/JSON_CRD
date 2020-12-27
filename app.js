const { Router } = require('express');
const express = require('express');
const app = express();
    
require('./routes/index')(app);

const server = app.listen(8000, function () {

    const host = server.address().address
    const port = server.address().port
  
    console.log("App listening at http://%s:%s", host, port)
  
  })