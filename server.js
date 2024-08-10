const express = require('express');
const path = require('path');
const login = require('./backend/login');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await login.register(username, password);
        res.json({ message: 'Registro realizado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
