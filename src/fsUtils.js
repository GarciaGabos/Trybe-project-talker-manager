const fs = require('fs').promises;

async function talkers() {
  try {
    const data = await fs.readFile('./talker.json', 'utf-8');
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
