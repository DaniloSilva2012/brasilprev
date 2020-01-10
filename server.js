import express from 'express'
import bodyParser from 'body-parser'

const { home, pokemon, pokemons } = require('./server/routes.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/dist', express.static(__dirname + '/dist'));

app.get('/', home);
app.get('/pokemon/:id', pokemon);
app.post('/pokemons', pokemons);

app.listen(8080);