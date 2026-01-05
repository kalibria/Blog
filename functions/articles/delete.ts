import { db } from '../../src/db/index';
import { articles } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

/**
 * Handler for DELETE /articles/{id}
 * Deletes an article from the database
 * 
 * Example: DELETE /articles/123e4567-e89b-12d3-a456-426614174000
 */
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Article ID is required',
        }),
      };
    }

    const [existingArticle] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);

    if (!existingArticle) {
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

    const [deletedArticle] = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Article deleted successfully',
        article: deletedArticle,
      }),
    };
  } catch (error) {
    console.error('Error deleting article:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to delete article',
      }),
    };
  }
}