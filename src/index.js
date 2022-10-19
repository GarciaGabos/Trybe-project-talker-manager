const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
// const readline = require('readline-sync');
const crypto = require('crypto');

const { 
  talkers, 
  // specificTalker, 
  validateLoginEmail, 
  validateLoginPassword,
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  talkValidationsWatchedAt,
  talkValidationsRate,
  writeNewTalkerData,
   } = require('./fsUtils.js');

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
  const talkerz = await talkers();
  const talkerId = await talkerz.find(({ id }) => id === Number(req.params.id));
  if (!talkerId) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(talkerId);
});

app.post('/login', validateLoginEmail, validateLoginPassword, (req, res) => {
  // const email = readline.question('What\'s your email?');
  // const password = readline.question('What\'s your password?');
  const tokenGenerator = () => crypto.randomBytes(8).toString('hex');
  const token = tokenGenerator();
  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', 
tokenValidation, 
nameValidation, 
ageValidation, 
talkValidation, 
talkValidationsWatchedAt,
talkValidationsRate,
  async (req, res) => {
  const newElement = await writeNewTalkerData(req.body);
  return res.status(201).json(newElement);
});

// app.put('/talker/:id', 
// tokenValidation, 
// nameValidation, 
// ageValidation, 
// talkValidation, 
// talkValidationsWatchedAt,
// talkValidationsRate,
//   async (req, res) => {
//     const talkerz = await talkers();
//     const wantedTalker = await talkerz.find(({ id }) => id === Number(req.params.id));
//     const editTalker = req.body;
// });

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  const { id } = req.params;
  const idNumber = (Number(id));
  const oldData = await talkers();
  const editedData = oldData.filter((currentTalker) => currentTalker.id !== idNumber);
  const deleteData = JSON.stringify(editedData);
  await fs.writeFile(path.resolve('src/talker.json'), deleteData);
  return res.status(204).end();
});