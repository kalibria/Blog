import { db } from '../../src/db/index';
  import { articles } from '../../src/db/schema';
  import { eq } from 'drizzle-orm';
  import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'


  export async function handler(event: APIGatewayProxyEventV2) {
    console.log('=== GET ARTICLE HANDLER CALLED ===');
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
      const id = event.pathParameters?.id;
      console.log('Article ID:', id);

      if (!id) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'ID parameter is required',
          }),
        };
      }

      console.log('About to query database for article...');

      const [article] = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          content: articles.content,
          published: articles.published,
          authorId: articles.authorId,
          createdAt: articles.createdAt,
          updatedAt: articles.updatedAt

        })
        .from(articles)
        .where(eq(articles.id, id))
        .limit(1);

      console.log('Query result:', article);

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
      console.error('!!! ERROR FETCHING ARTICLE !!!');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
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
