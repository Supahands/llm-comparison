<h1 align="center" style="font-weight: bold;">LLM Comparison Frontend    💻</h1>

<p align="center">
<a href="#tech">Technologies</a>
<a href="#started">Getting Started</a>
<a href="#database">Database Structure</a>
<a href="#colab">Collaborators</a>
<a href="#contribute">Contribute</a> 
</p>

<p align="center">About
This is an opensource project allowing you to compare two LLM's head to head with a given prompt, it has a wide range of supported models, from opensource ollama ones to the likes of openai and claude
</p>

<p align="center">
<a href="https://github.com/Supahands/llm-comparison-frontend">📱 Visit this Project</a>
</p>
 
<h2 id="layout">🎨 Layout</h2>

<p align="center">

<!-- <video width="400" controls>
    <source src="https://cdn.prod.website-files.com/63024b20439fa61d4aee344c%2F6731bc611af67635a98649df_llm-comparison-video_1-transcode.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video> -->
<p align="center">
<img src="https://cdn.prod.website-files.com/63024b20439fa61d4aee344c/6729815170f000c58463873c_select%20models-p-800.jpg" alt="LLM Comparison Layout" width="800"/>
</p>

</p>
 
<h2 id="technologies">💻 Technologies</h2>

- React
- Typescript
- TailwindCss

<h2 id="started">🚀 Getting started</h2>
 
<h3>Prerequisites</h3>

Here you list all prerequisites necessary for running your project. For example:

- [NodeJS](https://github.com/)
- [Git](https://github.com)
- [NPM]

<h3>Cloning</h3>

How to clone your project

```bash
git clone https://github.com/Supahands/llm-comparison-frontend
```

<h3>Starting</h3>

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

<h2 id="database">💽 Database Structure </h2>

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

<h2 id="disclaimer">⚠️ Disclaimer</h2>

<p>
Currently, we do not have Anthropic models (Claude) supported on the official site due to API costs. We are actively seeking sponsors to help integrate these models. If you have suggestions for including Anthropic models or would like to sponsor API access, please open an issue on our GitHub repository!
</p>

<p>
Want to help? Here's what you can do:
- Open an issue with suggestions for Anthropic model integration
- Reach out about sponsorship opportunities
- Share alternative solutions for accessing Anthropic's API
</p>

<h2 id="colab">🤝 Collaborators</h2>

<p>Special thank you for all people that contributed for this project.</p>
<table>
<tr>

<td align="center">
<a href="https://github.com/hank-supahands">
<img src="https://avatars.githubusercontent.com/hank-supahands" width="100px;" alt="Hank Profile Picture"/><br>
<sub>
<b>Hank</b>
</sub>
</a>
</td>

<td align="center">
<a href="https://github.com/wmthor">
<img src="https://avatars.githubusercontent.com/wmthor" width="100px;" alt="Wei Ming Thor Profile Picture"/><br>
<sub>
<b>Wei Ming Thor</b>
</sub>
</a>
</td>

<td align="center">
<a href="https://github.com/EvanZJ">
<img src="https://avatars.githubusercontent.com/EvanZJ" width="100px;" alt="Evanz Profile Picture"/><br>
<sub>
<b>Evanz</b>
</sub>
</a>
</td>

<td align="center">
<a href="https://github.com/OriginalByteMe">
<img src="https://avatars.githubusercontent.com/OriginalByteMe" width="100px;" alt="Noah Profile Picture"/><br>
<sub>
<b>Noah Rijkaard</b>
</sub>
</a>
</td>

</tr>
</table>
 
<h2 id="contribute">📫 Contribute</h2>

Here you will explain how other developers can contribute to your project. For example, explaining how can create their branches, which patterns to follow and how to open an pull request

1. `git clone https://github.com/Supahands/llm-comparison-frontend`
2. `git checkout -b feature/NAME`
3. Follow commit patterns
4. Open a Pull Request explaining the problem solved or feature made, if exists, append screenshot of visual modifications and wait for the review!

<h3>Documentations that might help</h3>

[📝 How to create a Pull Request](https://www.atlassian.com/git/tutorials/making-a-pull-request)

[💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
