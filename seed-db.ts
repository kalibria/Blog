import { config } from 'dotenv';
config({ path: '.env.mary' });

import { db } from './src/db/index';
import { users, articles } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.delete(articles);
    await db.delete(users);
    console.log('✅ Existing data cleared\n');

    // Create test users
    console.log('👤 Creating test users...');
    const testUsers = await db.insert(users).values([
      {
        email: 'admin@example.com',
        passwordHash: '$2b$10$rKjHvEOExGcZqKm0zQ0fT.vN2XJz5tYxKxWJYQZKxGxQZXzXxQZXy', // password: "password123"
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'editor@example.com',
        passwordHash: '$2b$10$rKjHvEOExGcZqKm0zQ0fT.vN2XJz5tYxKxWJYQZKxGxQZXzXxQZXy', // password: "password123"
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]).returning();

    console.log(`✅ Created ${testUsers.length} users:`);
    testUsers.forEach(user => console.log(`   - ${user.email} (password: password123)`));
    console.log();

    // Use the first user as the author for all articles
    const authorId = testUsers[0].id;

    // Create test articles
    console.log('📝 Creating test articles...');
    const testArticles = await db.insert(articles).values([
      {
        title: 'Getting Started with Astro',
        slug: 'getting-started-with-astro',
        content: `# Getting Started with Astro

Astro is a modern web framework for building fast, content-focused websites. It allows you to use your favorite JavaScript framework while shipping zero JavaScript by default.

## Key Features

- **Islands Architecture**: Only hydrate interactive components
- **Framework Agnostic**: Use React, Vue, Svelte, or plain HTML
- **Fast by Default**: Ship less JavaScript to the browser

## Installation

\`\`\`bash
npm create astro@latest
\`\`\`

This is just the beginning of your Astro journey!`,
        published: true,
        authorId,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        title: 'Building Serverless Applications with SST',
        slug: 'building-serverless-applications-with-sst',
        content: `# Building Serverless Applications with SST

SST (Serverless Stack) is a framework that makes it easy to build serverless applications on AWS. It provides a great developer experience with live Lambda development.

## Why SST?

1. **Live Lambda Development**: Test your functions locally
2. **Type Safety**: Full TypeScript support
3. **Modern DX**: Hot reloading and instant feedback

## Quick Start

\`\`\`typescript
import { Api } from 'sst/constructs';

new Api(stack, 'api', {
  routes: {
    'GET /': 'functions/lambda.handler',
  },
});
\`\`\`

Start building today!`,
        published: true,
        authorId,
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02'),
      },
      {
        title: 'Understanding Drizzle ORM',
        slug: 'understanding-drizzle-orm',
        content: `# Understanding Drizzle ORM

Drizzle is a TypeScript ORM that prioritizes developer experience and type safety. Unlike traditional ORMs, Drizzle is lightweight and SQL-like.

## Key Benefits

- **Type-safe queries**: Catch errors at compile time
- **SQL-like syntax**: Write queries that feel like SQL
- **No magic**: Transparent and predictable behavior
- **Great performance**: Minimal overhead

## Example Query

\`\`\`typescript
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.email, 'admin@example.com'));
\`\`\`

Simple and powerful!`,
        published: true,
        authorId,
        createdAt: new Date('2025-01-03'),
        updatedAt: new Date('2025-01-03'),
      },
      {
        title: 'Draft: PostgreSQL Best Practices',
        slug: 'draft-postgresql-best-practices',
        content: `# PostgreSQL Best Practices

This article is a work in progress...

## Topics to Cover

- Indexing strategies
- Query optimization
- Connection pooling
- Backup strategies

More content coming soon!`,
        published: false,
        authorId,
        createdAt: new Date('2025-01-04'),
        updatedAt: new Date('2025-01-04'),
      },
      {
        title: 'Draft: React Performance Tips',
        slug: 'draft-react-performance-tips',
        content: `# React Performance Tips

Draft article about optimizing React applications.

## Outline

1. Use React.memo
2. useMemo and useCallback
3. Code splitting
4. Virtual scrolling

To be expanded...`,
        published: false,
        authorId,
        createdAt: new Date('2025-01-04'),
        updatedAt: new Date('2025-01-04'),
      },
    ]).returning();

    console.log(`✅ Created ${testArticles.length} articles:`);
    testArticles.forEach(article => {
      const status = article.published ? '✓ Published' : '○ Draft';
      console.log(`   ${status} - ${article.title}`);
    });
    console.log();

    // Summary
    console.log('📊 Seed Summary:');
    console.log(`   Users: ${testUsers.length}`);
    console.log(`   Articles: ${testArticles.length}`);
    console.log(`   Published: ${testArticles.filter(a => a.published).length}`);
    console.log(`   Drafts: ${testArticles.filter(a => !a.published).length}`);
    console.log();

    console.log('✅ Database seeded successfully!\n');
    console.log('💡 Tips:');
    console.log('   - View data in Drizzle Studio: npm run db:studio');
    console.log('   - Login credentials: admin@example.com / password123');
    console.log('   - Test the API with these articles!');
    console.log();

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
