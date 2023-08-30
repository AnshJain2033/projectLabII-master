
import express from 'express'
import pg from 'pg'
import path from 'path'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import { fileURLToPath } from 'url';
const app = express();
const port = 3000;
const Pool = pg.Pool;

//for cross origin resource sharing

app.use(cors())
app.use(express.json())
// Create a PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  password: '9848',
  host: 'localhost',
  database: 'fundManagerdb',
  port: 5432 // Default PostgreSQL port
});
pool.connect()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define a basic route
app.get('/', (req, res) => {

  res.send('Connection Established')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//CREATED TABLES

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    user_email VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    balance_amount NUMERIC(10,2)
  );
`;
pool.query(createUserTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully');
  }
}
)
const createCategoryTableQuery = `
CREATE TABLE IF NOT EXISTS category (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  category_limit NUMERIC(7,2) NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES "user" (user_id)
  ON DELETE CASCADE
);

`;
pool.query(createCategoryTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully');
  }
}
)
const createExpenseTableQuery = `
  CREATE TABLE IF NOT EXISTS "expense" (
    expense_id SERIAL PRIMARY KEY,
    expense_name VARCHAR(100) NOT NULL,
    expense_amount NUMERIC(7,2) NOT NULL,
    date_time DATE,
   category_id INT,
   user_id INT,
   FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
  );
`;
pool.query(createExpenseTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully');
  }
}
)
const createContributorsTableQuery = `
  CREATE TABLE IF NOT EXISTS "contributors" (
    contribution_id SERIAL PRIMARY KEY,
    split_amount numeric(7,2),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
  );
`;
pool.query(createContributorsTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully');
  }
}
)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
// app.use('/api/v1/')