const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
// const PORT = process.env.PORT || 4040;  ------->process.env.PORT is a environment veriable for production lvl(AWS,AZURE,etc)

const PORT = 4050;

//middlewares
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

//for fetching users
app.get('/users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;   //page=2,limit=10,startIdx= (2-1)*10 =10 start index

    try {
        const data = await fs.readFile(path.join(__dirname, 'users.json'));
        const users = JSON.parse(data);
        const total = users.length;
        const paginatedUsers = users.slice(startIndex, startIndex + limit); // 10,20
        res.json({ total, users: paginatedUsers });    //total = 1000, users = [Array of 10 users data]
    } catch (error) {
        res.status(500).json({ error: 'Failed to read user data' });
    }
});

// for adding a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = req.body;
        const data = await fs.readFile(path.join(__dirname, 'users.json'));
        const users = JSON.parse(data);
        users.push(newUser);
        await fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2)); //for formatting JSON data
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save user data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
