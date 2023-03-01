const Sauce = require('../models/Sauce'); 

// logique métier pour créer une sauce 
exports.createSauce = (req, res, next)=> {
    const sauce = new Sauce({
        userId: req.body.userId,
        name: req.body.name, 
        manufacturer:req.body.manufacturer, 
        description: req.body.description, 
        mainPepper: req.body.mainPepper, 
        imageUrl: req.body.imageUrl, 
        heat: req.body.heat, 
        likes: req.body.likes,
        dislikes: req.body.dislikes
    }); 
    sauce.save().then(()=>{
        res.status(201).json({
            message: 'Sauce enregistré !'
        }); 
    }).catch((error)=>{
        res.status(400).json({
            error : error
        }); 
    });
}; 

//logique métier pour voir une sauce 
exports.getOneSauce = (req, res, next)=>{
    Sauce.findOne({
        _id: req.params.id
    }).then((sauce)=> {
        res.status(200).json(sauce)
    }).catch((error)=>{
        res.status(404).json({
            error: error
        }); 
    }); 
}; 

//logique métier pour modifier une sauce
exports.modifySauce = (req, res, next)=> {
    const sauce = new Sauce ({
        userId: req.body.userId,
        name: req.body.name, 
        manufacturer:req.body.manufacturer, 
        description: req.body.description, 
        mainPepper: req.body.mainPepper, 
        imageUrl: req.body.imageUrl, 
        heat: req.body.heat, 
        likes: req.body.likes,
        dislikes: req.body.dislikes
    }); 
    Sauce.updateOne({_id: req.params.id}, sauce).then(()=>{
        res.status(201).json({
            message: 'Sauce modifiée !'
        }); 
    }).catch((error)=>{
        res.status(400).json({
            error: error
        }); 
    }); 
}; 

//logique métier pour supprimer une sauce 
exports.deleteSauce = (req, res, next)=> {
    Sauce.deleteOne({_id: req.params.id}).then(()=>{
        res.status(201).json({
            message: 'Sauce supprimée !'
        }); 
    }).catch((error)=>{
        res.status(400).json({
            error: error
        }); 
    }); 
};

// logique métier pour voir toutes les sauces 
exports.getAllSauce = (req, res, next)=>{
    Sauce.find().then((sauce)=>{
        res.status(200).json(sauce); 
    }).catch((error)=>{
        res.status(400).json({
            error: error
        });
    });
}; 