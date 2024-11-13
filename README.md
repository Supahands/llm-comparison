# LLM Model Comparison App

This is a [Next.js](https://nextjs.org) project for comparing different LLM model responses.

## Project Structure

This project consists of two main parts:
- Frontend: Next.js application for the UI
- `backend/`: Backend service for handling LLM API calls (linked as a submodule)

## Database Structure

The application uses Supabase with the following tables:

### available_models
Stores the configuration for available LLM models:
- `id`: Unique identifier
- `provider`: The AI provider (e.g., OpenAI, Anthropic)
- `model_name`: Name of the model (e.g., GPT-4, Claude)
- `disabled`: Boolean flag to enable/disable models

### responses
Collects statistics and responses from model comparisons:
- Stores user choices and model performance metrics
- Used for analyzing model comparison results

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
