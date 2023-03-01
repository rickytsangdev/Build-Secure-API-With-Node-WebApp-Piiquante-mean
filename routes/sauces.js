const express = require('express'); 
const router = express.Router(); 


const sauceCtrl = require('../controllers/sauce')

// routing pour créer une sauce 
router.post ('/', sauceCtrl.createSauce);  

// routing pour voir une sauce
router.get('/:id', sauceCtrl.getOneSauce); 

// routing pour modifier une sauce
router.put('/:id', sauceCtrl.modifySauce); 

// routing pour supprimer une sauce
router.delete('/:id', sauceCtrl.deleteSauce); 

// voir toutes les sauces 
router.get('/', sauceCtrl.getAllSauce);

module.exports = router; 