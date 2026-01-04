import { config } from 'dotenv';
config({ path: '.env.mary' });

import { db } from './src/db/index';
import { users, articles } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test connection
    const result = await db.execute(sql`SELECT current_database(), current_user`);
    console.log('✅ Connected to database:', result.rows[0]);

    // Check tables exist
    const tables = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('\n📋 Tables in database:');
    tables.rows.forEach((row: any) => console.log('  -', row.table_name));

    // Check users table structure
    const usersColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log('\n👤 Users table columns:');
    usersColumns.rows.forEach((col: any) =>
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    );

    // Check articles table structure
    const articlesColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'articles'
      ORDER BY ordinal_position
    `);
    console.log('\n📝 Articles table columns:');
    articlesColumns.rows.forEach((col: any) =>
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    );

    // Check constraints
    const constraints = await db.execute(sql`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name IN ('users', 'articles')
      AND constraint_schema = 'public'
    `);
    console.log('\n🔒 Constraints:');
    constraints.rows.forEach((c: any) =>
      console.log(`  - ${c.constraint_name}: ${c.constraint_type}`)
    );

    console.log('\n✅ Database schema looks good!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
