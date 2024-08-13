const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const User = require('./models/User');
const cors = require('cors');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Import the routes
const userRoutes = require('./routes/userRoutes');
const notesRoutes = require('./routes/notesRoutes');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST',
    allowedHeaders: 'Content-Type, Authorization'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for PDFs
app.use('/notes/pdf', express.static(path.join(__dirname, 'pdfs')));

// Use the user routes
app.use('/', userRoutes);
app.use('/', notesRoutes);

async function main() {
    try {
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");

        await sequelize.authenticate();
        console.log('Connection to the Sequelize database has been established successfully.');

        app.listen(port, () => {
            console.log(`app listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the Sequelize database:', error);
    }
}

main();
