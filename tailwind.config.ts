import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tasuki: {
          primary: '#2D6A4F',
          secondary: '#52B788',
          accent: '#F4A261',
          light: '#F0F7F4',
        }
      }
    },
  },
  plugins: [],
}
export default config
