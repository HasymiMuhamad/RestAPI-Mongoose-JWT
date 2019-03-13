const borrowController = require('../controllers/user');
const express = require('express');
const apps = express(); 
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth')

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/')
    },
    filename: function (req, file, cb){
        cb(null, `${req.body.bookTitle}.jpg`)
    }
})

const upload = multer({storage : storage});

//------------- URL ---------------------------------------
//router.get('/connectionTest', borrowController.connectionTest);
router.put('/:id/update', borrowController.bookUpdate);
//router.delete('/bookNumber/someBooksDelete', borrowController.someBooksDelete);
//router.post('/upload', upload.single('image'), borrowController.bookUpload);

router.get('/test', auth.isAuthenticated, borrowController.Test);

router.post('/login', borrowController.authentication);

router.post('/register', borrowController.memberCreate);

router.post('/postData' , borrowController.bookReturn); //bookInput

router.get(':id',borrowController.bookDetails); //bookFind

router.delete('/borrow/:bookTitle', borrowController.bookDelete); //bookDelete



module.exports = router;
