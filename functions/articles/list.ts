import { db } from '../../src/db/index';
import { articles } from '../../src/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const showAll = event.queryStringParameters?.all === 'true';

    const articlesList = showAll
        ? await db
            .select({
              id: articles.id,
              title: articles.title,
              slug: articles.slug,
              content: articles.content,
              published: articles.published,
              createdAt: articles.createdAt,
              updatedAt: articles.updatedAt,
            })
            .from(articles)
            .orderBy(desc(articles.createdAt))
        : await db
            .select({
              id: articles.id,
              title: articles.title,
              slug: articles.slug,
              content: articles.content,
              published: articles.published,
              createdAt: articles.createdAt,
              updatedAt: articles.updatedAt,
            })
            .from(articles)
            .where(eq(articles.published, true))
            .orderBy(desc(articles.createdAt));

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          articles: articlesList,
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