import { open, Database } from 'sqlite';
import { Database as SQLite3Database } from 'sqlite3';
import { TVisitor } from '../utils/types';

/**
 * Opens a connection to the SQLite database.
 * @returns {Promise<Database>} A promise that resolves with the database connection.
 */
async function openDatabase(): Promise<Database> {
    return open({
        filename: 'database.db',
        driver: SQLite3Database,
    });
}

/**
 * Initializes the database by creating necessary tables if they don't already exist.
 * Tables created: visitors, referrals.
 */
async function createDatabase(): Promise<void> {
    const db = await openDatabase();

    await db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY,
      telegram_id TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      username TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY,
      referee INTEGER NOT NULL,
      referral INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    await db.close();
}

/**
 * Counts the total and today's referrals for a given user.
 * @param {number} userId The ID of the user to count referrals for.
 * @returns {Promise<{ totalReferrals: number; todayReferrals: number }>} A promise that resolves with an object containing the total and today's referrals.
 */
export async function countReferrals(userId: number): Promise<{ totalReferrals: number; todayReferrals: number }> {
    const db = await openDatabase();

    try {
        const [totalRefResult, todayRefResult] = await Promise.all([
            db.get('SELECT COUNT(*) AS total FROM referrals WHERE referee = ?', userId),
            db.get(`
        SELECT COUNT(*) AS today
        FROM referrals
        WHERE referee = ? AND DATE(created_at) = DATE('now')
      `, userId),
        ]);

        return {
            totalReferrals: totalRefResult?.total ?? 0,
            todayReferrals: todayRefResult?.today ?? 0,
        };
    } finally {
        await db.close();
    }
}

/**
 * Adds a visitor to the database, if they don't already exist.
 * @param {TVisitor} visitor The visitor to add to the database.
 */
export async function addVisitor(visitor: TVisitor): Promise<void> {
    const db = await openDatabase();

    const visitorExists = await db.get('SELECT 1 FROM visitors WHERE telegram_id = ?', visitor.id);

    if (!visitorExists) {
        await db.run(
            'INSERT INTO visitors (telegram_id, first_name, last_name, username) VALUES (?, ?, ?, ?)',
            visitor.id,
            visitor.first_name,
            visitor.last_name,
            visitor.username,
        );
    }

    await db.close();
}

/**
 * Updates the address for a given visitor.
 * @param {number} id The Telegram ID of the visitor to update.
 * @param {string} address The new address of the visitor.
 */
export async function addVisitorAddress(id: number, address: string): Promise<void> {
    const db = await openDatabase();

    await db.run('UPDATE visitors SET address = ? WHERE telegram_id = ?', address, id);

    await db.close();
}

/**
 * Adds a referral relationship between two users.
 * @param {number} referee The user ID of the referee.
 * @param {number} referral The user ID of the referral.
 */
export async function addReferral(referee: number, referral: number): Promise<void> {
    const db = await openDatabase();

    await db.run('INSERT INTO referrals (referee, referral) VALUES (?, ?)', referee, referral);

    await db.close();
}

// Create the database and tables on script run.
createDatabase();
