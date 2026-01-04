import { defineConfig } from 'astro/config';
import aws from 'astro-sst';
import react from '@astrojs/react';

export default defineConfig({
  output: 'server',
  adapter: aws(),
  integrations: [react()]
});
