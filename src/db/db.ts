import { open, Database } from 'sqlite';
import { Database as SQLite3Database } from 'sqlite3';
import { TVisitor } from '../utils/types';

async function createDatabase() {
    const db: Database = await open({
        filename: 'database.db',
        driver: SQLite3Database
    });

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

export async function countReferrals(userId: number): Promise<{ totalReferrals: number, todayReferrals: number }> {
    const db: Database = await open({
        filename: 'database.db',
        driver: SQLite3Database
    });

    try {
        const totalReferralsQuery = 'SELECT COUNT(*) AS total FROM referrals WHERE referee = ?';
        const totalRefResult = await db.get(totalReferralsQuery, [userId]);
        const totalReferrals = totalRefResult ? totalRefResult.total : 0;

        const todayReferralsQuery = `
            SELECT COUNT(*) AS today 
            FROM referrals 
            WHERE referee = ? AND DATE(created_at) = DATE('now')`;
        const todayRefResult = await db.get(todayReferralsQuery, [userId]);
        const todayReferrals = todayRefResult ? todayRefResult.today : 0;

        return { totalReferrals, todayReferrals };
    } catch (error) {
        console.error("Error in countReferrals:", error);
        throw error;
    } finally {
        await db.close();
    }
}

export async function addVisitor(visitor: TVisitor) {
    const db: Database = await open({
        filename: 'database.db',
        driver: SQLite3Database
    });

    const visitorExists = await db.get('SELECT * FROM visitors WHERE telegram_id = ?', [visitor.id]);

    if (!visitorExists) {
        await db.run('INSERT INTO visitors (telegram_id, first_name, last_name, username) VALUES (?, ?, ?, ?)', [
            visitor.id,
            visitor.first_name,
            visitor.last_name,
            visitor.username
        ]);
    }

    await db.close();
}

export async function addVisitorAddress(id: number, address: string) {
    const db: Database = await open({
        filename: 'database.db',
        driver: SQLite3Database
    });

    await db.run('UPDATE visitors SET address = ? WHERE telegram_id = ?', [address, id]);

    await db.close();
}

export async function addReferral(referee: number, referral: number) {
    const db: Database = await open({
        filename: 'database.db',
        driver: SQLite3Database
    });

    await db.run('INSERT INTO referrals (referee, referral) VALUES (?, ?)', [
        referee,
        referral
    ]);

    await db.close();
}

createDatabase()