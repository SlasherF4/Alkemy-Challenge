const express = require('express');
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const { url } = require('inspector');
const { table } = require('console');
const fsPromises = require('fs').promises;
const ejs = require('ejs');

const characters = require('./characters');
const movies = require('./movies');
const sql = require('./sql');

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

//const http = require('http');
//const bodyParser = require('body-parser')
app.use(express.json());
//app.use(express.urlencoded({extended: true}));
//app.use(bodyParser.json());

app.listen(port, () => {
    console.log('server is listening on', port)
});

//test database
 
sql.test();

//routes

const routerCharacters = express.Router();
app.use('/characters', routerCharacters);

//home
app.get('/', (req, res) => {
    res.render('home')
    console.log('solicitud recibida')
});

//registro

async function uniqueValue(table, value1, value2) {
    const unique = await table.findOne({ where: { [value1]: [value2] } });
    if (unique === null) {
        return true;  
    } else{
        return false;
    }
}

async function registerUser(user, res){
    const unique = await uniqueValue(User, "userEmail", user.email);
    if(unique) {
        const registerUser = await User.create({
            userEmail: user.email,
            userPassword: user.password
        });
        res.send('usuario registrado');
        console.log('usuario registrado');
    } else{
        res.status(500).send('email repetido o valor invalido');
        console.log('email repetido o valor invalido');
    }
}

app.get('/auth/register', (req, res) => {
    res.render('register')
})

app.post('/auth/register', (req, res) => {
    const user = req.body;
    const register = registerUser(user, res);
}); 

//login

async function validUser(table, value1, value2, value3, value4) {
    const valid = await table.findOne({ where: { 
        [value1]: [value2], 
        [value3]: [value4]
    } });
    if (valid === null) {
        return false;  
    } else{
        return true;
    }
}

async function loginUser(user, res) {
    const valid = await validUser(User, 'userEmail', user.email, 'userPassword', user.password);
    if(valid) {
        res.send('login exitoso')
    } else{
        res.status(500).send('login fallido')
    }
};

app.get('/auth/login', (req, res) => {
    res.render('login')
})

app.post('/auth/login', (req, res) => {
    const user = req.body;
    const login = loginUser(user, res);
    //console.log(req.body);
    //jwt.sign(user, 'userKey', (err, token) => {
    //    res.json(token)
    //});
});

//list de personajes

app.get('/characters', (req, res) => {
    const queryParams = req.query;
    const character = characters.characterList(res, queryParams);
    console.log(queryParams);
})

//detalles personaje

async function characterDetails(character, res) {
    const details = await Character.findAll({
        where: {
            ['character_name']: [character]
        }
    });
    if(details.length === 0) {
        res.status(404).send('no se encontro info del personaje: ' + character)
    } else{
        res.send(details)
    }
}

app.get('/characters/:character', (req, res) => {
    const character = req.params.character
    const details = characterDetails(character, res);
    console.log(character)
})

//movies

app.get('/movies', (req, res) => {
    const queryParams = req.query;
    const media = movies.mediaList(res, queryParams);
})

//details movies

async function mediaDetails(media, res) {
    const details = await Media.findAll({
        where: {
            ['media_title']: [media]
        }
    });
    if(details.length === 0) {
        res.status(404).send('no se encontro info de la pelicula: ' + media)
    } else{
        res.send(details)
    }
}

app.get('/movies/:media', (req, res) => {
    const media = req.params.media
    const details = mediaDetails(media, res);
    console.log(media)
})

//error

/*fsPromises.readFile('./one.txt')
    .then(data => res.send(data))
    .catch(err => { // error handling logic 1
        console.error(err) // logging error
        res.status(500).send(err)
    })*/

//movies

/*app.get('/movies', verifyToken(), (req, res) => {
    const movies = moviesxd;
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error) {
            res.sendStatus(403);
            
        } else{
            res.json('movies fue creado');
        };
    });
});*/

//veficar token

function verifyToken(req, res ,next) {
    const bearerHeader =  req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token  = bearerToken;
        next();
    } else{
        res.sendStatus(403);
    }
};

//Data bases

sql.synchronize();

//exports

module.exports.app = app;