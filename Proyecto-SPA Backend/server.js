const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const errorHandler = require('./middleware/errorHandler');
const validateSpaces = require('./middleware/validateSpace');

// Middleware
app.use(cors());
app.use(express.json());


app.use(validateSpaces);


app.use('/api/categoria', require('./routes/categoria'));
app.use('/api/cliente', require('./routes/cliente'));
app.use('/api/cita', require('./routes/cita'));
app.use('/api/tratamiento', require('./routes/tratamiento'));
app.use('/api/paquete', require('./routes/paquete'));
app.use('/api/paquetevendido', require('./routes/paquetevendido'));
app.use('/api/paq_trat', require('./routes/paq_trat'));
app.use('/api/users', require('./routes/users'));


app.get('/', (req, res) => {
  res.json({ 
    message: 'API del SPA funcionando correctamente',
    endpoints: ["/api/categoria","/api/cliente","/api/cita","/api/tratamiento","/api/paquete","/api/paquetevendido","/api/paq_trat","/api/users"]
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto ' + PORT);
  console.log('Endpoints disponibles:');
  console.log('  http://localhost:' + PORT + '/api/categoria');
  console.log('  http://localhost:' + PORT + '/api/cliente');
  console.log('  http://localhost:' + PORT + '/api/cita');
  console.log('  http://localhost:' + PORT + '/api/tratamiento');
  console.log('  http://localhost:' + PORT + '/api/paquete');
  console.log('  http://localhost:' + PORT + '/api/paquetevendido');
  console.log('  http://localhost:' + PORT + '/api/paq_trat');
  console.log('  http://localhost:' + PORT + '/api/users');
});
