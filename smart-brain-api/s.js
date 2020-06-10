const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
const database = {
    users: [
    {
        id: '123',
        name: 'albaraa',
        email: 'albaraa@gmail.com',
        password: '12345',
        entries: 0,
        joined: new Date()
    },
    {
        id: '1234',
        name: 'john',
        email: 'john@gmail.com',
        password: '123',
        entries: 0,
        joined: new Date()
    }
  ]
}

app.get('/', (req, res)=> {
    res.send('this is working');
})

app.post('/signin', (req, res)=> {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('IT WORKS!!!!!');
    } else {
        res.status(400).json('error logging in');
    }
})

app.listen(3000, ()=> {
    console.log('app is running testing!!');
})