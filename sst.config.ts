/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app() {
    return {
      name: "blog",
      home: "aws",
      region: "eu-west-1",
      providers: {
        aws: {
          profile: "blog"
        }
      }
    };
  },
  async run() {
    const { config } = await import('dotenv');
      config({ path: '.env.mary' });

    // Create the API
    const api = new sst.aws.ApiGatewayV2("BlogApi", {
      transform: {
        route: {
          handler: (args) => {
            args.environment = {
              DATABASE_URL: process.env.DATABASE_URL!
            };
          }
        }
      }
    });

    // Add routes
    api.route("GET /articles", "functions/articles/list.handler");
    api.route("GET /articles/{slug}", "functions/articles/get.handler");
    api.route("POST /articles", "functions/articles/create.handler");
    api.route("PUT /articles/{id}", "functions/articles/update.handler");
    api.route("DELETE /articles/{id}", "functions/articles/delete.handler");

    // Create the Astro site
    new sst.aws.Astro("Blog", {
      dev: {
        command: "astro dev"
      },
      link: [api],
      environment: {
        API_URL: api.url
      }
    });

    return {
      api: api.url
    };
  }
});
