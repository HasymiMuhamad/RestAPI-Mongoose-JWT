const Food = require('../models/user');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Ajv = require('ajv');
const mongoose = require('mongoose');
const memberValidate = require('../scheme/user');
var User = mongoose.model('User'); 
var jwt = require('jsonwebtoken');
const userSchema = require('../scheme/user.json');
require('dotenv').config()

// exports.connectionTest = function (req, res, next){
//     res.send('Connection success !!');
// }


// exports.bookCreate = function (req, res, next) {
//     var data = new Book (
//         {
//             bookTitle : req.body.bookTitle,
//             bookNumber : req.body.bookNumber
//         }
//     );

//     data.save(function (err) {
//         if (err) {
//             console.log(err)
//             return next(err);
//         }
//         res.send('Book Data is created succesfully !!')
        
//     })
// };


exports.dataUpdate = function (req, res, next) {
    Food.findByIdAndUpdate(req.params.id, {$set: req.body.foodName}, function (err, data) {
        if (err) {
            console.log(err)
            return next(err);}
        res.send('Data is updated !!');
    });
};


// exports.someBooksDelete = function (req, res,next) {
//     Buku.deleteMany({bookNumber : {$e : req.params.bookNumber }}, function (err) {
//         if (err) {
//             console.log(err)
//             return next(err);}
//         res.send('Some books data is deleted !! ');
//     })
// };

exports.Test = function(req, res, next){
    res.json({message : req.decoded});
    next();
}

// exports.register = function(req, res, next){
//     let member = new Member(
//         {
//             username : req.body.username,
//             password : req.body.password,
//             email : req.body.email
//         }
//     ) 

//     member.save(function(err){
//         if (err){
//             console.log(err)
//             return next(err);
//         }
//         res.send ('New Member Account is created' )
       
//     })
// }

exports.userCreate = function(req, res, next){
    console.log(req.body);
    let user = new User(
        {
           // name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        });

        var ajv = new Ajv();
        const valid = ajv.validate(userSchema, user);

        if (valid){
            console.log('User is valid!');
            bcrypt.hash(user.password, saltRounds) .then(function(hash){
                user.password = hash
                user.save()
                .then(function() {
                    const payload = {
                        id: user._id,
                        username: user.username
                    }
                    const token = jwt.sign(payload, 'jwtsecret', {
                        algorithm: 'HS256'
                    });
                    res.status(400).json({
                        token : token,
                        body: user,
                    })
                })
                .catch((err) => {
                    res.send({ message : 'Data Invalid', error : err});
                });
            });
        } else{
            console.log('User data is invalid', validate.errors);
            res.status(400)
            res.send({ message : 'Data Invalid', error : validate.errors});

        }

}

exports.dataPost = function (req, res, next){
    console.log(req.body)
    var data = new Food (
        {
            foodName : req.body.foodName,
            foodNumber : req.body.foodNumber,
            image : req.file ? req.file.filename : null
        
        }
    );

    data.save(function(err){
        if (err){
            console.log(err)
            return next(err);
        }
        res.send ('Data is uploaded' )
        fs.writeFile(`${req.body.foodName}.jpg`, function (err){
            if (err) throw err;
            console.log('New file is created !!');
        })
    })
};



exports.dataDetails = function (req, res,next) {
    Food.findById(req.params.id, function (err, data) {
        if (err) {
            console.log(err)
            return next(err);}
        res.send(data);
    })
};



exports.dataDelete = function (req, res,next) {
    Food.findByIdAndRemove(req.params.foodName, function (err) {
        if (err) {
            console.log(err)
            return next(err);
        }
        fs.unlinkSync(`public/${req.params.foodName}.jpg`);   
        res.send('Book data is deleted !! ');
        
    })
};



exports.authentication = (req, res) =>{
    const token = req.headers.authorization;
    jwt.verify(token, 'jwtsecret', function(err, decoded) {
        if (err) {
            return res.status(400).json({
                message: err
            })
        }

        console.log(decoded);
        const userId = decoded.id;
        User.findById(userId, function(err, user) {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }

            return res.status(200).json({
                body: user
            })
        })
    });
//     let member = Member.findOne({
//         username : req.body.username
//     }, function(err, obj){
//         if (!err){
//             res.status(400).json({
//                 body: obj
//             })
//         } else {
//             res.status(200).json({
//                 message: err
//             })
//         }
//     });

// member.then((member) => {
//     console.log(member)
//     console.log(req.body)
//     bcrypt.compare(req.body.password, member.password).then (function (result){
//         if (result){
//             var token = jwt.sign(member.toJSON(), 'jwtsecret', {
//                 algorithm: 'HS256'
//             });
//         } else {
//             res.status(401)
//             res.send({Message : 'Incorrect Password'})
//         }
//     }).catch((err)=>{console.log(err)})
// })
}