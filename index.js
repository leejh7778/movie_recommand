const express = require('express');
const cors = require('cors');
const spawn = require('child_process').spawn;
const path = require('path');
const port = 8080;
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

const pythonExePath = isDevelopment()
  ? path.join('C:', 'conda', 'envs', 'recom_env', 'python.exe')
  : path.join('/home/ubuntu/miniconda', 'envs', 'myenv', 'bin', 'python3');

app.get('/', (req, res) => {
  res.send('Hello from Node server!!!');
});

// 랜덤 영화 불러오기
app.get('/random/:count', (req, res) => {
  const scriptPath = path.join(__dirname, 'resolver.py');

  const count = req.params.count;
  const result = spawn(pythonExePath, [scriptPath, 'random', count]);

  let responseData = '';

  result.stdout.on('data', function (data) {
    responseData += data.toString();
  });

  result.on('close', (code) => {
    if (code === 0) {
      try {
        const jsonResponse = JSON.parse(responseData);
        res.status(200).json(jsonResponse);
      } catch (err) {
        res.status(500).json({ error: 'Failed to parse Python response.' });
      }
    } else {
      res.status(500).json({ error: `Child process exited with code ${code}` });
    }
  });

  result.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

// 최신작 랜덤 조회
app.get('/latest/:count', (req, res) => {
  const scriptPath = path.join(__dirname, 'resolver.py');

  const count = req.params.count;
  const result = spawn(pythonExePath, [scriptPath, 'latest', count]);

  let responseData = '';

  result.stdout.on('data', function (data) {
    responseData += data.toString();
  });

  result.on('close', (code) => {
    if (code === 0) {
      try {
        const jsonResponse = JSON.parse(responseData);
        res.status(200).json(jsonResponse);
      } catch (err) {
        res.status(500).json({ error: 'Failed to parse Python response.' });
      }
    } else {
      res.status(500).json({ error: `Child process exited with code ${code}` });
    }
  });

  result.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

// 장르별 랜덤 조회
app.get('/genres/:genre/:count', (req, res) => {
  const scriptPath = path.join(__dirname, 'resolver.py');

  const genre = req.params.genre;
  const count = req.params.count;
  const result = spawn(pythonExePath, [scriptPath, 'genres', genre, count]);

  let responseData = '';

  result.stdout.on('data', function (data) {
    responseData += data.toString();
  });

  result.on('close', (code) => {
    if (code === 0) {
      try {
        const jsonResponse = JSON.parse(responseData);
        res.status(200).json(jsonResponse);
      } catch (err) {
        res.status(500).json({ error: 'Failed to parse Python response.' });
      }
    } else {
      res.status(500).json({ error: `Child process exited with code ${code}` });
    }
  });

  result.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

app.get('/item-based/:item', (req, res) => {
  const scriptPath = path.join(__dirname, 'recommender.py');

  const item = req.params.item;
  const result = spawn(pythonExePath, [scriptPath, 'item-based', item]);

  let responseData = '';

  result.stdout.on('data', function (data) {
    responseData += data.toString();
  });

  result.on('close', (code) => {
    if (code === 0) {
      try {
        const jsonResponse = JSON.parse(responseData);
        res.status(200).json(jsonResponse);
      } catch (err) {
        res.status(500).json({ error: 'Failed to parse Python response.' });
      }
    } else {
      res.status(500).json({ error: `Child process exited with code ${code}` });
    }
  });

  result.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
