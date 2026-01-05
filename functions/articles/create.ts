import { db } from '../../src/db/index';
  import { articles, users } from '../../src/db/schema';
  import { eq } from 'drizzle-orm';
  import slugify from 'slugify';
  import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

  /**
   * Handler for POST /articles
   * Creates a new article in the database
   * 
   * Expected request body:
   * {
   *   "title": "My Article Title",
   *   "content": "Article content here...",
   *   "published": true,
   *   "authorEmail": "admin@example.com"
   * }
   */
  export async function handler(
    event: APIGatewayProxyEventV2
  ): Promise<APIGatewayProxyResultV2> {
    try {
      const body = JSON.parse(event.body || '{}');
      const { title, content, published, authorEmail } = body;

      if (!title || !content || !authorEmail) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'Missing required fields: title, content, authorEmail',
          }),
        };
      }

      const [author] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, authorEmail))
        .limit(1);


      if (!author) {
        return {
          statusCode: 404, 
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'Author not found',
          }),
        };
      }

      const slug = slugify(title, { lower: true, strict: true });

    
      const [newArticle] = await db
        .insert(articles)
        .values({
          title,
          slug,
          content,
          published: published ?? false,
          authorId: author.id, 
          createdAt: new Date(), 
          updatedAt: new Date(), 
        })
        .returning();

      
      return {
        statusCode: 201, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          article: newArticle,
        }),
      };
    } catch (error) {
      console.error('Error creating article:', error);

      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Failed to create article',
        }),
      };
    }
  }