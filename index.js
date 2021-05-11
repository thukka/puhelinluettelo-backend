const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Custom token for returning request body
morgan.token('bodydata', function (req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodydata'));

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

// Root page
app.get('/', (req, res) => {
    res.send('<h1>Phonebook backend wip </h1>');
});

// Get list of persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// Get specific person info
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

// Delete a person
app.delete('/api/persons/:id', (request, response) => {
    console.log('params sisalto on', request.params);
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

// Create a new person
app.post('/api/persons/', (request, response) => {
    const body = request.body;
    // Check if required information is missing
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        });
    };

    if (persons.find(n => n.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    };

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 100000)
    };
    persons = persons.concat(person);
    response.json(person);
});

// Get info page
app.get('/info', (req, res) => {
    const dateNow = new Date();
    res.send(`<p> The phonebook has ${persons.length} persons in it 
    <br>${dateNow} </p>`);
});

// Unknown endpoint middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'});
};

app.use(unknownEndpoint);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});