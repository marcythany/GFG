import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#4d498c',
        'background-color': '#363175',
        'accent-color': '#bdc586',
        'highlight-color': '#aba8ce',
        'secondary-color': '#6965a1',
        'overlay-color': '#303136bd',
        'text-color': '#fff',
        'alt-text-color': '#aaa',
        'danger-color': '#dc3545',
        'warning-color': '#ffc107',
      },
    },
  },
  plugins: [],
};
export default config;
