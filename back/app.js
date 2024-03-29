const cors = require('cors');
const express = require('express');
const path = require('path');

const productRoutes = require('./routes/product');

const app = express();
app.use(cors({
  origin: 'https://kanap-y7q1.onrender.com', // Remplacez avec l'origine de votre front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
}))
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   next();
// });

app.use(express.static(path.join(__dirname, '..')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/products', productRoutes);

module.exports = app;
