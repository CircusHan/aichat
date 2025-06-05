# ChatBot Demo

Simple browser-based AI chat built with React and FastAPI.

## Development

```bash
# install front-end deps and start Vite dev server
cd frontend && pnpm install && pnpm dev
```

```bash
# in another terminal run backend
uvicorn backend.main:app --reload
```

Both servers use default ports (5173 and 8000).
See docs/MULTIMODAL_GEMINI.md for instructions on building a multimodal chatbot with voice and gesture support using Gemini.
