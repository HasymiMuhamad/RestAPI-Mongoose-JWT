const userController = require('../controllers/user');
const express = require('express');
const apps = express(); 
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth')



router.get('/test', auth.isAuthenticated, userController.Test);

router.post('/login', auth.isAuthenticated, userController.authentication);

router.post('/register', userController.userCreate);

router.post('/dataPost' , auth.isAuthenticated, userController.dataPost); 

router.put('/:id/update', auth.isAuthenticated, userController.dataUpdate);

router.get(':id',auth.isAuthenticated, userController.dataDetails); 

router.delete('/delete/:foodMenu', auth.isAuthenticated, userController.dataDelete); 



module.exports = router;
