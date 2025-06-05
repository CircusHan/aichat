# FastAPI server providing /chat endpoint
# Requires OPENAI_API_KEY environment variable
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict
import openai
import os

# Set API key from env
openai.api_key = os.getenv('OPENAI_API_KEY')

app = FastAPI()

# Allow local frontend to talk to API
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_methods=['*'],
    allow_headers=['*'],
)

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    model: str

@app.post('/chat')
async def chat(req: ChatRequest):
    """Stream assistant replies from OpenAI"""
    # openai API call with streaming

    async def generator():
        response = await openai.ChatCompletion.acreate(
            model=req.model,
            messages=req.messages,
            stream=True,
        )
        async for chunk in response:
            delta = chunk.choices[0].delta
            content = delta.get('content')
            if content:
                yield content
    # Stream chunks back to the client as plain text

    return StreamingResponse(generator(), media_type='text/plain')
