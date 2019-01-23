const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose');
// const url = 'mongodb://localhost:9999/blogDb';
const url = 'mongodb://localhost/blogDb';

const User = require('./user');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// from https://stackoverflow.com/questions/51916630/mongodb-mongoose-collection-find-options-deprecation-warning#answer-51918795
mongoose.set('useCreateIndex', true);

app.post('/api/user/login', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        // console.log(req.body.username + ',' + req.body.password);
        if(err) throw err;
        User.find({
            username : req.body.username, password : req.body.password
        }, function(err, user){
            if(err) throw err;
            if(user.length === 1){  
                return res.status(200).json({ 
                    status: 'success',
                    data: user
                })
            } else {
                return res.status(200).json({
                    status: 'fail',
                    message: 'Login Failed'
                })
            }
             
        })
    });
});

app.get('/api/user/getAll', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        if(err) throw err;
        User.find(function(err, users) {
            if(err) throw err;
            return res.status(200).json({ 
                status: 'success',
                data: users
            })
        })
    });
})

app.listen(3000, () => console.log('blog server running on port 3000!'));