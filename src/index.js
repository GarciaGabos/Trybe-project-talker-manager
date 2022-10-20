const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
// const readline = require('readline-sync');
const crypto = require('crypto');

const { 
  talkers, 
  validateLoginEmail, 
  validateLoginPassword,
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  talkValidationsWatchedAt,
  talkValidationsRate,
  writeNewTalkerData,
  writeFile,
   } = require('./fsUtils.js');

const app = express();
app.use(express.json());
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

app.put('/talker/:id', 
tokenValidation, 
nameValidation, 
ageValidation, 
talkValidation, 
talkValidationsWatchedAt,
talkValidationsRate,
  async (req, res) => {
    const { id } = req.params;
    const newTalker = req.body;
    const currentTalkers = await talkers();
    const removeTalker = currentTalkers.filter((talker) => talker.id !== Number(id));
    newTalker.id = Number(id);
    const updatedTalkers = [...removeTalker, newTalker];
    await writeFile(updatedTalkers);
    res.status(200).json(newTalker);
});

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  const { id } = req.params;
  const idNumber = (Number(id));
  const oldData = await talkers();
  const editedData = oldData.filter((currentTalker) => currentTalker.id !== idNumber);
  const deleteData = JSON.stringify(editedData);
  await fs.writeFile(path.resolve('src/talker.json'), deleteData);
  return res.status(204).end();
});

app.get('/talker/search', tokenValidation, async (req, res) => {
  const { q } = req.query;
  const data = await talkers();
  const searchedData = data.filter((el) => el.name.includes(q));
  if (q === undefined) {
    return res.status(200).json(data);
} 
  if (!searchedData) {
    return res.status(200).json([]);
}
    res.status(200).json(searchedData);
});
