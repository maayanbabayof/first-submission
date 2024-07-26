const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const opportunitiesRouter = require('./routes/opportunities');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/opportunities', opportunitiesRouter);

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the API.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
