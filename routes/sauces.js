const express = require('express'); 
const auth = require('../middleware/auth'); 
const router = express.Router();
const multer = require('../middleware/multer-config'); 

const sauceCtrl = require('../controllers/sauce')

// routing pour créer une sauce 
router.post ('/', auth, multer, sauceCtrl.createSauce);  

// routing pour voir une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); 

// routing pour modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); 

// routing pour supprimer une sauce
router.delete('/:id',auth,  sauceCtrl.deleteSauce); 

// voir toutes les sauces 
router.get('/',auth,  sauceCtrl.getAllSauce);

// liker une sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce); 

module.exports = router; 