const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());  // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.json()); // Use body-parser to handle JSON payloads

// In-memory storage for demonstration
const spreadsheets = {};

// Example route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Save spreadsheet data
app.post('/save', (req, res) => {
  const { name, data } = req.body; // name and data fields
  spreadsheets[name] = data; // Store spreadsheet data in memory
  console.log(Spreadsheet saved: ${name});
  res.status(200).send({ message: 'Spreadsheet saved successfully!' });
});

// Load spreadsheet data
app.get('/load/:name', (req, res) => {
  const { name } = req.params;
  if (spreadsheets[name]) {
    console.log(Spreadsheet loaded: ${name});
    res.status(200).send(spreadsheets[name]); // Send the saved spreadsheet data
  } else {
    res.status(404).send({ message: 'Spreadsheet not found!' });
  }
});

// Delete spreadsheet data (optional)
app.delete('/delete/:name', (req, res) => {
  const { name } = req.params;
  if (spreadsheets[name]) {
    delete spreadsheets[name];
    console.log(Spreadsheet deleted: ${name});
    res.status(200).send({ message: 'Spreadsheet deleted successfully!' });
  } else {
    res.status(404).send({ message: 'Spreadsheet not found!' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});
