import { db } from '../../src/db/index';
import { articles } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

  /**
   * Handler for PUT /articles/{id}
   * Updates an existing article in the database
   * 
   * Expected request body (all fields optional for partial updates):
   * {
   *   "title": "Updated Title",
   *   "content": "Updated content...",
   *   "published": false
   * }
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

      const body = JSON.parse(event.body || '{}');
      const { title, content, published } = body;

      if (title === undefined && content === undefined && published === undefined) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'At least one field (title, content, or published) must be provided',
          }),
        };
      }

      const [existingArticle] = await db
        .select({ id: articles.id })
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
      const updateData: Partial<typeof articles.$inferInsert> = {
        updatedAt: new Date(), 
      };

      if (title !== undefined) {
        updateData.title = title;
        updateData.slug = slugify(title, { lower: true, strict: true });
      }

      if (content !== undefined) {
        updateData.content = content;
      }

      if (published !== undefined) {
        updateData.published = published;
      }

      const [updatedArticle] = await db
        .update(articles)
        .set(updateData)
        .where(eq(articles.id, id))
        .returning();

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          article: updatedArticle,
        }),
      };
    } catch (error) {
      console.error('Error updating article:', error);

      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Failed to update article',
        }),
      };
    }
  }