const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3100;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const createTable = async () => {
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
};

const initDB = async () => {
  let retries = 5;

  while (retries) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Database connected');
      await createTable();
      return;
    } catch (err) {
      retries--;
      console.log(`⏳ Waiting for DB... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  throw new Error("Database connection failed");
};

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', port });
});

app.post('/register', async (req, res) => {
  try {
    const { parent_name, address, phone, child_name } = req.body;

    const result = await pool.query(
      `INSERT INTO registrations 
      (parent_name, address, phone, child_name) 
      VALUES ($1, $2, $3, $4) RETURNING id`,
      [parent_name, address, phone, child_name]
    );

    res.json({
      success: true,
      message: 'Registration successful!',
      id: result.rows[0].id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

app.get('/registrations', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM registrations ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START SERVER ONLY AFTER DB READY
initDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Backend running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });
