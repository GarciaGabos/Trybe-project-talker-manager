const express = require('express');
const bodyParser = require('body-parser');

const { talkers, specificTalker } = require('./fsUtils.js');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const talkersList = await talkers();
  res.status(HTTP_OK_STATUS).json(talkersList);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const wantedTalker = await specificTalker(Number(id));
  if (!wantedTalker) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(HTTP_OK_STATUS).json(wantedTalker);
});
