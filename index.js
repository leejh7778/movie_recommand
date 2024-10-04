const express = require('express');
const cors = require('cors');
const spawn = require('child_process').spawn;
const path = require('path');
const port = 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Node server!!!');
});

// 랜덤 영화 불러오기
app.get('/random/:count', (req, res) => {
  const scriptPath = path.join(__dirname, 'resolver.py');
  // const pythonPath = path.join(
  //   'C:',
  //   'conda',
  //   'envs',
  //   'recom_env',
  //   'python.exe'
  // );

  const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3');

  const count = req.params.count;
  const result = spawn(pythonPath, [scriptPath, 'random', count]);

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
  // const pythonPath = path.join(
  //   'C:',
  //   'conda',
  //   'envs',
  //   'recom_env',
  //   'python.exe'
  // );

  const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3');

  const count = req.params.count;
  const result = spawn(pythonPath, [scriptPath, 'latest', count]);

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
  // const pythonPath = path.join(
  //   'C:',
  //   'conda',
  //   'envs',
  //   'recom_env',
  //   'python.exe'
  // );

  const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3');

  const genre = req.params.genre;
  const count = req.params.count;
  const result = spawn(pythonPath, [scriptPath, 'genres', genre, count]);

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
  // const pythonPath = path.join(
  //   'C:',
  //   'conda',
  //   'envs',
  //   'recom_env',
  //   'python.exe'
  // );

  const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3');

  const item = req.params.item;
  const result = spawn(pythonPath, [scriptPath, 'item-based', item]);

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
