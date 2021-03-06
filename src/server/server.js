const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose');
// const url = 'mongodb://localhost:9999/blogDb';
const url = 'mongodb://localhost/blogDb';

const User = require('./user');
const Item = require('./item');
const Group = require('./group');

app.use(bodyParser.json({limit: '2mb'}))
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

//#region login

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

//#endregion

// #region users

app.get('/api/user/getAllUsers', (req, res) => {
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
});

app.post('/api/user/saveUser', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        if(err) throw err;
        User.create(req.body.user, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                user: resp
            });
        });
    });
});

app.post('/api/user/editUser', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        if(err) throw err;
        // User.findByIdAndUpdate(req.body.user._id, { 
        User.findOneAndUpdate({ _id: req.body.user._id }, {             
                name: req.body.user.name,
                username: req.body.user.username,
                password: req.body.user.password,
                role: req.body.user.role,
                image: req.body.user.image,
            }, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                // user: resp 
            });
        });
    });
});

app.post('/api/user/deleteUser', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        if(err) { //throw err;
            return res.status(500).json({ error: err });    
        }
        User.deleteOne({ username : req.body.user.username }, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                data: resp
            });
        })
        .catch((err) => {
            return res.status(500).json({ text: 'CATCH', error: err });    
        });
    });
});

// #endregion

// #region items

app.get('/api/item/getAllItems', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        if(err) throw err;

        Item.find(function(err, items) {
            if(err) throw err;
            Group.find(function (er, groups) {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    item.gruop = groups.filter((g) => g.id === item.groupId)[0];
                }
                return res.status(200).json({ 
                    status: 'success',
                    data: items
                });
            });
            // return res.status(200).json({ 
            //     status: 'success',
            //     data: items
            // });
        });
        // Item.find().forEach(
        //     function (_item) {
        //         _item.group = db.myGroup.findOne( { "_id": { $in: _item.groupId }  } );
        //         db.fullItems.insert(_item);
        //     }
        // );
        // db.fullItems.find(function(err, items) {
        //     if(err) throw err;
        //     return res.status(200).json({ 
        //         status: 'success',
        //         data: items
        //     });
        // });
    });
})

app.post('/api/item/saveItem', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        if(err) throw err;
        Item.create(req.body.item, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                item: resp
            });
        });
    });
});

app.post('/api/item/deleteItem', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err) {
        if(err) throw err;
        Item.deleteOne({ name: req.body.item.name }, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                data: resp
            });
        })
        .catch((err) => {
            return res.status(500).json({ text: 'CATCH', error: err });    
        });      
    });
});

app.post('/api/item/editItem', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err) {
        if(err) throw err;
        Item.findOneAndUpdate({ '_id': req.body.item._id }, {
            name: req.body.item.name,
            description: req.body.item.description,
            price: req.body.item.price,
            image: req.body.item.image,
            groupId: req.body.item.groupId,
            group: Group.findOne({ '_id': req.body.item.groupId }) 
        }, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                // user: resp 
            })
        });
    });
});

// #endregion

// #region groups

app.get('/api/group/getAllGroups', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        if(err) throw err;
        Group.find(function(err, groups) {
            if(err) throw err;
            return res.status(200).json({ 
                status: 'success',
                data: groups
            })
        })
    });
})

app.post('/api/group/saveGroup', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err){
        if(err) throw err;
        Group.create(req.body.group, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                group: resp
            });
        });
    });
});

app.post('/api/group/deleteGroup', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err) {
        if(err) throw err;
        Group.deleteOne({ name: req.body.group.name }, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                data: resp
            });
        })
        .catch((err) => {
            return res.status(500).json({ text: 'CATCH', error: err });    
        });      
    });
});

app.post('/api/group/editGroup', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, function(err) {
        if(err) throw err;
        Group.findOneAndUpdate({ '_id': req.body.group._id }, {
            name: req.body.group.name,
            description: req.body.group.description,
            // price: req.body.group.price,
            image: req.body.group.image,
        }, (err, resp) => {
            if (err) {
                return res.status(500).json({ error: err });    
            }
            return res.status(200).json({ 
                status: 'success',
                // user: resp 
            })
        });
    });
});

// #endregion

app.listen(3000, () => console.log('blog server running on port 3000!'));