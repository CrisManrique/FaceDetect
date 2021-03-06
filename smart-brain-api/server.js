const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Spartan117',
    database : 'postgres'
  }
});

const app = express();

const database = {
	users: [
		{
			id: '123',
			name: 'john',
			email: 'j@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()

		},
		{
			id: '222',
			name: 'sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'j@gmail.com'

		}

	]

}

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send(database.users);

})

app.get('/signin', (req, res) => {
	res.send("signin");

})



app.post('/signin', (req,res) => {
	if(req.body.email === database.users[0].email &&  
			req.body.password === database.users[0].password){
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
	
})

app.post('/register', (req, res) => {
	const {email,  name, password } = req.body;
		db('users')
			.returning('*')
			.insert({
			name: name,
			email: email,
			entries: 0,
			joined: new Date()
	}).then(user => { 
		res.json(user[0]);
	})
	.catch(err => {
		console.log("Unable to register")
		res.status(400).json('Unable to register');
	})

})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	let found = false;
	db.select('*').from('users').where({
		id: id
	}).then(user => {
		console.log(user);
	})

	if(!found){
		res.status(400).json('not found');
	}
})

app.put('/image', (req, res) => {
	const {id} = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user);
		} 
	})

	if(!found){
		res.status(400).json('not found');
	}
})

app.listen(3001, () => {
	console.log("hitting");
})


