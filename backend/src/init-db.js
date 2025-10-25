const pool = require('./db');

async function initDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table created ✅');

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'todo',
        completed BOOLEAN DEFAULT false,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tasks table created ✅');

    // Update tasks table to include user_id if it doesn't exist (for existing tables)
    await pool.query(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='tasks' AND column_name='user_id') THEN
            ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id);
          END IF;
        END IF;
      END $$;
    `);
    console.log('Tasks table checked for user_id ✅');

    // Update tasks table to include description and status columns
    await pool.query(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='tasks' AND column_name='description') THEN
            ALTER TABLE tasks ADD COLUMN description TEXT;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='tasks' AND column_name='status') THEN
            ALTER TABLE tasks ADD COLUMN status VARCHAR(50) DEFAULT 'todo';
          END IF;
        END IF;
      END $$;
    `);
    console.log('Tasks table updated with description and status ✅');

    console.log('Database initialization complete! ✅');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDatabase();
