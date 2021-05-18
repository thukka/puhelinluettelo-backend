require('dotenv').config();
const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person')

// MIDDLEWARES
// Custom token for returning request body
morgan.token('bodydata', function (req, res) {
    return JSON.stringify(req.body);
});

// Unknown endpoint middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

// Error handling
const errorHandler = (error, request, response, next) => {
    console.log(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    next(error);
}

// USE
app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodydata'));

// Root page
app.get('/', (req, res) => {
    res.send('<h1>Phonebook backend wip </h1>');
});

// Get list of persons
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});

// Get specific person info
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            };
        }).catch(error => {
            next(error)
        });
});

// Delete a person
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

// Create a new person
app.post('/api/persons/', (request, response) => {
    const body = request.body;
    // Check if required information is missing
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    };

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

// Update existing info
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(modifiedPerson => {
            response.json(modifiedPerson);
        }).catch(error => next(error));
});

// Get info page
app.get('/info', (req, res) => {
    const dateNow = new Date();
    res.send(`<p> The phonebook has ${persons.length} persons in it 
    <br>${dateNow} </p>`);
});

app.use(unknownEndpoint);
app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});