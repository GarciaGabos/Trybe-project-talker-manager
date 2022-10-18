const fs = require('fs').promises;
const path = require('path');

async function talkers() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, './talker.json'), 'utf-8');
    const readableData = await JSON.parse(data);
    return readableData;
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err}`);
  }
}

async function specificTalker(idTalker) {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'), 'utf-8');
    const talker = JSON.parse(data);
    return talker.find((eachTalker) => idTalker === eachTalker.id);
  } catch (err) {
    console.error(`Erro na leitura do arquivo: ${err}`);
  }
}

module.exports = {
  talkers,
  specificTalker,
};
