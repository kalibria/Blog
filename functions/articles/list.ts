import { db } from '../../src/db/index';
import { articles } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export async function handler() {
  try {
    // Fetch all published articles, ordered by creation date (newest first)
    const publishedArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        content: articles.content,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(articles.createdAt);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        articles: publishedArticles,
      }),
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to fetch articles',
      }),
    };
  }
}