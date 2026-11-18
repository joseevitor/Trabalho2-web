// Servidor do trabalho: só serve os arquivos da pasta "public"
// (o jogo roda todo no navegador, com Vue)
const express = require('express');
const path = require('path');

const app = express();
const PORTA = 3000;

// tudo que estiver na pasta public fica disponível pro navegador
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORTA, () => {
  console.log('Servidor rodando em http://localhost:' + PORTA);
});
