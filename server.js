const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Set up Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Define your models
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Add more fields as needed
});

// Sync the models to the MySQL database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((error) => console.error('Error syncing database:', error));

app.use(express.json());

// Set up your API routes
app.get('/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:\${port}`);
});
