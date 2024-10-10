const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173' 
}));
app.use(bodyParser.json());

app.post('/', (req, res) => {
    const { url } = req.body;

    const pythonProcess = spawn('python', ['model.py']);

    pythonProcess.stdin.write(JSON.stringify({ url: url }));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
        res.json({ response: data.toString() });
    });

    pythonProcess.stderr.on('data', (data) => {
        res.json({ error: data.toString() });
    });

    pythonProcess.on('close', (code) => {
        console.error(`Python process exited with code ${code}`);
    });
});

app.get("/", (req, res) =>{
    res.send("Server");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});