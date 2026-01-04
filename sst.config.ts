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
    new sst.aws.Astro("MyWeb", {
      dev: {
        command: "astro dev"
      }
    });
  }
});
