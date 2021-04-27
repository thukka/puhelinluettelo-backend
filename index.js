const express = require('express');
const app = express();

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '050-123-456'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '555-555-123'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '999-999-999'
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Phonebook backend wip </h1>');
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});