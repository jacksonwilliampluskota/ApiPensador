const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const timeout = require('connect-timeout');
const app = express();

const server = require('http').Server(app);

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
);
app.use(cors());
app.use(timeout(900000));

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://127.0.0.1/pensador',
  {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
  },
);


const frasesModel = require('./frases');



app.post('/api', async (req, res) => {

  const frase = await frasesModel.aggregate(
    [{ $sample: { size: 1 } }]
  )
  console.log(frase[0]);
  res.json(frase[0]);
});

server.listen(9354, '0.0.0.0', () => {
  console.log('Server start: ', 9354);
});