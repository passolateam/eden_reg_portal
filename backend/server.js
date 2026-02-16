const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3100; // Using port within 3100-3111 range

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Create table function
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        parent_name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(50) NOT NULL,
        child_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table ready');
  } catch (err) {
    console.error('❌ Table error:', err.message);
  }
};

// Wait for DB and create table
const initDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Database connected');
      await createTable();
      return;
    } catch (err) {
      retries -= 1;
      console.log(`⏳ Waiting for DB... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  console.error('❌ Could not connect to database');
};

initDB();

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', port: port });
});

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { parent_name, address, phone, child_name } = req.body;
    
    const result = await pool.query(
      'INSERT INTO registrations (parent_name, address, phone, child_name) VALUES ($1, $2, $3, $4) RETURNING id',
      [parent_name, address, phone, child_name]
    );
    
    res.json({ 
      success: true, 
      message: '✅ Registration successful!',
      id: result.rows[0].id 
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed' 
    });
  }
});

// Get all registrations
app.get('/registrations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
});