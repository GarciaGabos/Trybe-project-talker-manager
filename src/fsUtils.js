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

const validateLoginEmail = (req, res, next) => {
  const { email } = req.body;
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
  next();
};

  const validateLoginPassword = (req, res, next) => {
    const { password } = req.body;
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

  const nameValidation = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json(
      { message: 'O campo "name" é obrigatório' },
    ); 
  }

  if (name.length < 6) {
    return res.status(400).json(
      { message: 'O "name" deve ter pelo menos 3 caracteres' },
    );
  }
  next();
  };
  
  const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json(
      { message: 'Token não encontrado' },
    ); 
  }

  if (authorization.length !== 16) {
    return res.status(401).json(
      { message: 'Token inválido' },
    );
  }
  next(); 
};

  const ageValidation = (req, res, next) => {
    const { age } = req.body;
    if (!age) {
      return res.status(400).json(
        { message: 'O campo "age" é obrigatório' },
      ); 
    }
  
    if (Number(age) < 18) {
      return res.status(400).json(
        { message: 'A pessoa palestrante deve ser maior de idade' },
      );
    }
    next();
    };

    const talkValidation = (req, res, next) => {
      const { talk } = req.body;
      if (!talk) {
        return res.status(400).json(
          { message: 'O campo "talk" é obrigatório' },
        );
      }

      if (!talk.watchedAt) {
        return res.status(400).json(
          { message: 'O campo "watchedAt" é obrigatório' },
        );
      }
      if (!talk.rate) {
        return res.status(400).json(
          { message: 'O campo "rate" é obrigatório' },
        );
      }
    next();
    };

    const talkValidationsWatchedAt = (req, res, next) => {
      const { talk } = req.body;
      const dataRegx = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
      const testResult = dataRegx.test(talk.watchedAt);
      if (!testResult) {
        return res.status(400)
            .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
      next();
    };

    const talkValidationsRate = (req, res, next) => {
      const { talk } = req.body;
      if (Number(talk.rate) < 1 || Number(talk.rate > 5)) {
        return res.status(400).json(
          { message: 'O campo "rate" deve ser um inteiro de 1 à 5' },
        );
      }
    next();
    };

    async function writeNewTalkerData(newTalker) {
      try {
          const oldData = await talkers();
    const newTalkerWithId = { id: oldData.length + 1, ...newTalker };
    const allData = JSON.stringify([...oldData, newTalkerWithId]);
    await fs.writeFile(path.resolve('src/talker.json'), allData);
    return newTalkerWithId;
} catch (error) {
    console.error(`Erro na escrita do arquivo: ${error}`);
}
    }

module.exports = {
  talkers,
  specificTalker,
  validateLoginEmail,
  validateLoginPassword,
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  talkValidationsWatchedAt,
  talkValidationsRate,
  writeNewTalkerData,
};
