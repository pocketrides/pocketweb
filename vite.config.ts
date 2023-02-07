import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

const config: UserConfig = {
  plugins: [basicSsl(), sveltekit()],
  build: {
    chunkSizeWarningLimit: 1000
  }
};

export default config;
