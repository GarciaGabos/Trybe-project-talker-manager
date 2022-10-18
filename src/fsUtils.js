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

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!email) {
    return res.status(400).json(
      { message: 'O campo "email" é obrigatório' },
    ); 
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json(
      { message: 'O "email" deve ter o formato "email@email.com"' },
    );
  }
  
    if (!password) {
      return res.status(400).json(
        { message: 'O campo "password" é obrigatório' },
      ); 
    }
  
    if (password.length < 6) {
      return res.status(400).json(
        { message: 'O "password" deve ter pelo menos 6 caracteres' },
      );
    }
  
    next();
  };

module.exports = {
  talkers,
  specificTalker,
  validateLogin,
};
