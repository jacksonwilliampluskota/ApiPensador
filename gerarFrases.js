const Nightmare = require('nightmare');
const mongoose = require('mongoose');

//https://www.pensador.com/dedicatoria_fitas_academicas_sucesso/
//https://www.pensador.com/frases_de_motivacao/
//https://www.pensador.com/mensagens_lute_por_seus_sonhos/
//https://www.pensador.com/frases_de_determinacao/
//https://www.pensador.com/superacao_e_forca/
//https://www.pensador.com/frases_sucesso/
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

const n = Nightmare({
  show: false,
  webPreferences: {
    partition: `persist: PENSADOR`
  },
});


function abre(url) {
  return n.goto(url).wait('body');
}

function getTotal() {
  return n.evaluate(() => {
    let element = document.querySelector('.total');
    /* if (!element) {
      element = document.querySelector('.total strong:nth-child(2)');
    }

    if (!element) {
      element = document.querySelector('.autorTotal strong:nth-child(1)');
    }

    if (!element) {
      element = document.querySelector('.total strong:nth-child(1)');
    }

    if (!element) {
      element = document.querySelector('.autorTotal strong:nth-child(2)');
    } */

    const total = element.innerText.match(/\d+/g);

    return parseInt(total[0]);
  });
}

async function getFrases(url) {
  await abre(url);

  return n.evaluate(() => {
    const frases = document.querySelectorAll('.frase');
    const frasesParsed = [];
    for (let i = 0; i < frases.length; i++) {
      const f = frases[i];
      if (f.innerText && f.innerText.length <= 300) {
        frasesParsed.push(f.innerText);
      }
    }

    return frasesParsed;
  });
}

/* async function getLetras() {
  await abre('https://www.pensador.com/autores');

  return n.evaluate(() => {
    const letras = document.querySelectorAll('.alfa a');
    const letrasParsed = [];
    for (let i = 0; i < letras.length; i++) {
      const f = letras[i];
      if (f.href) {
        letrasParsed.push(f.href);
      }
    }

    return letrasParsed;
  });
}

async function getAutores(url) {
  await abre(url);

  return n.evaluate(() => {
    const autores = document.querySelectorAll('.custom li a');
    const autoresParsed = [];
    for (let i = 0; i < autores.length; i++) {
      const f = autores[i];
      if (f.href) {
        autoresParsed.push(f.href);
      }
    }

    return autoresParsed;
  });
} */

async function start() {

  console.log('inicio');

  var arrayLinks = [
    'https://www.pensador.com/frases_de_motivacao/',
    'https://www.pensador.com/frases_de_determinacao/',
    'https://www.pensador.com/mensagens_lute_por_seus_sonhos/',
    'https://www.pensador.com/superacao_e_forca/',
    'https://www.pensador.com/frases_sucesso/',
    'https://www.pensador.com/dedicatoria_fitas_academicas_sucesso/',
  ];

  for (let j = 0; j < arrayLinks.length; j++) {
    const url = arrayLinks[j];
    console.log(url);

    await abre(url);
    let total = await getTotal();
    if (total > 1000) {
      total = 1000;
    }
    const totalPages = Math.ceil(total / 20);
    console.log(total);

    for (let i = 1; i <= totalPages; i++) {
      const urlToParse = `${url}${i}`;
      const frases = await getFrases(urlToParse);

      for (let k = 0; k < frases.length; k++) {
        const frase = frases[k];
        await frasesModel.update({ frase },
          { frase },
          { upsert: true }
        );
      }
    }
  }

  console.log('Acabou!');



  /* const letras = await getLetras();
  for (let k = 0; k < letras.length; k++) {
    const letra = letras[k];
    const autores = await getAutores(letra);

    for (let j = 0; j < autores.length; j++) {
      const url = autores[j];
      await abre(url);
      const total = await getTotal();
      const totalPages = Math.ceil(total / 25);

      for (let i = 1; i <= totalPages; i++) {
        const urlToParse = `${url}${i}`;
        const frases = await getFrases(urlToParse);
        console.log(frases);
      }
    } */
}

start();