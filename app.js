const express = require('express'); 

const mongoose = require('mongoose'); 

const saucesRoutes = require ('./routes/sauces');

const userRoutes = require ('./routes/user'); 

const app = express(); 
 


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,  PATCH, OPTIONS');
  next();
});

app.post('/api/stuff', (req, res, next)=>{
  const sauce = new sauce({
    ...req.body
  }); 
  sauce.save()
  .then(()=> res.status(201).json({message: 'objet enregistré'}))
  .catch(error => res.status(400).json({error})); 
}); 

mongoose.connect('mongodb+srv://rickt9:wE1fyUwSumKweRV8@cluster0.4uwuvgj.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); //intercepte le content type json

app.use('/api/sauces', saucesRoutes); 
app.use('/api/auth', userRoutes); 

module.exports = app; 