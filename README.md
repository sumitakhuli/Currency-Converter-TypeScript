# Currency-Converter-TypeScript

A TypeScript-based currency converter featuring real-time exchange rates and flag icons.

## Deployment to Vercel

This project is configured to be deployed easily to [Vercel](https://vercel.com).

### 1. Configure Environment Variables
Locally, copy `.env.example` to `.env` and add your API key:
```bash
cp .env.example .env
```
In Vercel, go to **Settings > Environment Variables** and add:
- **Key**: `VITE_API_KEY`
- **Value**: `your_exchangerate_api_key_here`

### 2. Connect to Vercel
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project in Vercel.
3. Vercel will automatically detect the **Vite** configuration.
4. Ensure the **Build Command** is `npm run build` and the **Output Directory** is `dist`.

### 3. Local Development
```bash
npm install
npm run dev
```
