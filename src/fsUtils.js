const fs = require('fs').promises;
const path = require('path');

async function talkers() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, './talker.json'), 'utf-8');
    const readableData = await JSON.parse(data);
    return readableData;
  } catch (err) {
    console.log(`Erro ao ler o arquivo: ${err}`);
    return [];
  }
}

module.exports = {
  talkers,
};
