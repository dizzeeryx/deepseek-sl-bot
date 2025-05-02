const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota para testar se o servidor está online
app.get('/', (req, res) => {
  res.send('✅ Servidor DeepSeek-SL está funcionando!');
});

// Rota que o Second Life vai acessar
app.post('/api/deepseek', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).send('❌ Por favor, envie uma pergunta.');
    }

    // Envia a pergunta para a API do DeepSeek
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions', // URL da API DeepSeek
      {
        model: "deepseek-chat", // Modelo do DeepSeek
        messages: [{ role: "user", content: question }],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Retorna a resposta para o Second Life
    res.status(200).send(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Erro na API:", error.response?.data || error.message);
    res.status(500).send("⚠️ Erro ao processar sua pergunta.");
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
