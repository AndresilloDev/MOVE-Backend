const express = require('express');

const app = express();
app.disable('x-powered-by');

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Hola mundo!'});
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, ()  => {
    console.log(`Server listening on port http://localhost:${PORT}`);
})