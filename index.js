const { response } = require('express');
const express = require('express');
const app = express();

app.use(express.json());

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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    console.log('params sisalto on', request.params);
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons/', (request, response) => {
    const person = request.body;
    console.log(person);

    person.id = Math.floor(Math.random() * 10000);
    persons = persons.concat(person);
    response.json(person);
});

app.get('/info', (req, res) => {
    const dateNow = new Date();
    res.send(`<p> The phonebook has ${persons.length} persons in it 
    <br>${dateNow} </p>`);
});



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});