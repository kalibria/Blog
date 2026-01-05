import { db } from '../../src/db/index';
  import { articles } from '../../src/db/schema';
  import { eq } from 'drizzle-orm';
  import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'


  export async function handler(event: APIGatewayProxyEventV2) {
    try {
      const slug = event.pathParameters?.slug;

      if (!slug) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'Slug parameter is required',
          }),
        };
      }

      const [article] = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          content: articles.content,
          createdAt: articles.createdAt,
          updatedAt: articles.updatedAt,
        })
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

      if (!article) {
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'Article not found',
          }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          article,
        }),
      };
    } catch (error) {
      console.error('Error fetching article:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Failed to fetch article',
        }),
      };
    }
  }
