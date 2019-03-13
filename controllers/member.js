const Book = require('../models/member');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Ajv = require('ajv');
const mongoose = require('mongoose');
const memberValidate = require('../scheme/member');
var Member = mongoose.model('Member'); 
var jwt = require('jsonwebtoken');
const memberSchema = require('../scheme/member.json');
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


// exports.bookUpdate = function (req, res, next) {
//     Buku.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, data) {
//         if (err) {
//             console.log(err)
//             return next(err);}
//         res.send('Book data is updated !!');
//     });
// };


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

exports.memberCreate = function(req, res, next){
    let member = new Member(
        {
           // name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        });

        var ajv = new Ajv();
        const valid = ajv.validate(memberSchema, member);

        if (valid){
            console.log('Member data is valid!');
            bcrypt.hash(member.password, saltRounds) .then(function(hash){
                member.password = hash
                member.save().then(function() {
                    const payload = {
                        id: member._id,
                        username: member.username
                    }
                    const token = jwt.sign(payload, 'jwtsecret', {
                        algorithm: 'HS256'
                    });
                    res.status(400).json({
                        token,
                        body: member,
                    })
                }).catch((err) => {
                    res.send({ message : 'Data Invalid', error : err});
                });
            });
        } else{
            console.log('Member data is invalid', validate.errors);
            res.status(400)
            res.send({ message : 'Data Invalid', error : validate.errors});

        }

}

exports.bookReturn = function (req, res, next){
    console.log(req.body)
    var data = new Book (
        {
            bookTitle : req.body.bookTitle,
            bookNumber : req.body.bookNumber,
            image : req.file ? req.file.filename : null
            // name : req.body.name,
            // username : req.body.username,
            // email : req.body.email,
            // password : req.body.password
        }
    );

    data.save(function(err){
        if (err){
            console.log(err)
            return next(err);
        }
        res.send ('Book data is uploaded' )
        fs.writeFile(`${req.body.bookTitle}.jpg`, function (err){
            if (err) throw err;
            console.log('New file is created !!');
        })
    })
};



exports.bookDetails = function (req, res,next) {
    Book.findById(req.params.id, function (err, data) {
        if (err) {
            console.log(err)
            return next(err);}
        res.send(data);
    })
};



exports.bookDelete = function (req, res,next) {
    Book.findByIdAndRemove(req.params.bookTitle, function (err) {
        if (err) {
            console.log(err)
            return next(err);
        }
        fs.unlinkSync(`public/${req.params.bookTitle}.jpg`);   
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
        const memberId = decoded.id;
        Member.findById(memberId, function(err, member) {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }

            return res.status(200).json({
                body: member
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