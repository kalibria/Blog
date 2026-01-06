import { defineConfig } from 'astro/config';
import aws from 'astro-sst';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  adapter: aws(),
  integrations: [react()]
});
