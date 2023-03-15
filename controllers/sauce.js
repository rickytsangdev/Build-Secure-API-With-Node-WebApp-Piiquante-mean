const Sauce = require('../models/Sauce');
const fs = require('fs');  

// logique métier pour créer une sauce 
exports.createSauce = (req, res, next)=> {
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id; 
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject, 
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }); 
    
    sauce.save()
    .then(()=>{
        res.status(201).json({
            message: 'sauce enregistré !'
        }); 
    }).catch((error)=>{
        res.status(400).json({error})
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
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}; 

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce)=>{
        if(sauce.userId != req.auth.userId){
            res.status(401).json({
                message: 'Non autorisé'
            }); 
        } else {
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(()=> res.status(200).json({message : 'Objet modifié !'}))
            .catch(error => res.status(401).json({error})); 
        }
    })
    .catch((error)=>{
        res.status(400).json({error}); 
    })
}; 

//logique métier pour supprimer une sauce 
exports.deleteSauce = (req, res, next)=> {
   Sauce.findOne({_id: req.params.id})
   .then(sauce=> {
        if(sauce.userId != req.auth.userId) {
            res.status(401).json({
                message: 'Non autorisé'
            })
        } else {
            const filename = sauce.imageUrl.split('/images/')[1]; 
            fs.unlink(`images/${filename}`, ()=> {
                sauce.deleteOne({_id: req.params.id})
                .then(()=> {res.status(200).json({
                    message: 'objet supprimé !'
                })})
                .catch(error=> res.status(401).json({error}))
            }); 
        }
   })
   .catch(error=> {
    res.status(500).json({error}); 
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

exports.likeSauce = (req, res, next) => {
    // console.log("je suis dans controlleur !")

    // affichage du req.body 
    console.log("************** req.body - ctrl like");
    console.log(req.body);

    // // je recupère l'id dans l'url de la requête
    // console.log("************** req.params -ctrl like")
    // console.log(req.params); 

    // // je transforme le format id en _id
    // console.log('************** id en _id');
    // console.log({_id : req.params.id})

    // aller chercher la sauce dans la base de donnée
    Sauce.findOne({_id : req.params.id})
    .then((sauce) => {
        console.log("**************************resultat promise : objet")
        console.log(sauce)
        // -------CAS: LIKE (+1) : je like la sauce-------
        if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
            console.log("True car pas dans tableau et 1")
            Sauce.updateOne(
                {_id: req.params.id},
                {
                    $inc: {likes: 1},
                    $push: {usersLiked: req.body.userId}
                }
            )
            .then(()=> res.status(200).json(sauce))
            .catch(error => res.status(400).json({error}))
        }
         else {
            console.log("False car déjà dans tableau ou 0 ou -1")
        } // -----CAS: LIKE (0) : je ne like plus la sauce // Je retire mon dislike de la sauce------
        if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne(
                {_id: req.params.id},
                {
                    $inc: {likes: -1},
                    $pull: {usersLiked: req.body.userId}
                }
            )
            .then(()=> res.status(200).json(sauce))
            .catch(error => res.status(400).json({error}))
        } else {
            console.log("False car pas dans tableau ou 1 ou -1")
        }//----CAS: DISLIKES (-1) : Je dislike la sauce-----
        if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1 ) {
            console.log("True car pas dans tableau et -1")
            Sauce.updateOne(
                {_id: req.params.id},
                {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked: req.body.userId}
                }
            )
            .then(()=> res.status(200).json(sauce))
            .catch(error => res.status(400).json({error}))
        } else {
            console.log("False car déjà dans tableau ou 0 ou 1")
        } // ----CAS: DISLIKES (0) : Je retire mon dislike de la sauce-----
        if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
            console.log("True car déjà dans tableau et 0 ")
            Sauce.updateOne(
                {_id: req.params.id},
                {
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked: req.body.userId}
                }
            )
            .then(()=> res.status(200).json(sauce))
            .catch(error => res.status(400).json({error}))
        } else {
            console.log("False car pas dans tableau ou 1 ou -1")
        }
    })
    .catch((error)=> res.status(404).json({error}))
}; 