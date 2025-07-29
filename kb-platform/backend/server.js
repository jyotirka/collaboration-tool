const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));

const documentRoutes = require('./routes/document');
app.use('/api/documents', documentRoutes);

const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);


app.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});



