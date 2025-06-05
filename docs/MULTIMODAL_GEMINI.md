# Building a Multi-Modal Chatbot with Gemini

This guide describes how to extend the demo React/FastAPI chatbot to handle audio and gesture input while generating responses using Google's Gemini model.

## Overview

The final system will allow a user to speak, perform gestures, or type text. The backend processes these signals and forwards them to Gemini. Responses are streamed back to the client and can optionally be spoken using the Web Speech API.

## 1. Frontend Setup

1. Install the dependencies and start the Vite dev server:
   ```bash
   cd frontend && pnpm install && pnpm dev
   ```
   Ensure the browser supports WebRTC/Web Speech APIs.

2. **Voice Input**
   - Use `navigator.mediaDevices.getUserMedia` to capture microphone audio.
   - Run speech recognition with the Web Speech API or a third-party library such as `speech-recognition-polyfill`.
   - Send the transcribed text to the backend via the existing chat endpoint.

3. **Gesture Recognition**
   - Capture webcam video using `getUserMedia`.
   - Integrate a gesture recognition library like [MediaPipe](https://mediapipe.dev/) or [TensorFlow.js Handpose](https://www.tensorflow.org/js/models). These libraries run in the browser and return gesture labels or keypoints.
   - Convert recognized gestures into text commands (e.g., "thumbs up" -> "yes"). Send this text to the backend.

4. **Display and Voice Output**
   - Show model responses in the chat UI.
   - Optionally use the Web Speech API's `speechSynthesis` to vocalize the text.

## 2. Backend Setup

The backend remains a FastAPI application. Add new routes to handle voice and gesture data if needed. Typically, the frontend will send text derived from audio or gestures, so reuse the chat endpoint.

Example route that forwards user messages to Gemini:

```python
# backend/main.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
import httpx

app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText"

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    payload = {
        "contents": [{"parts": [{"text": req.message}]}]
    }
    params = {"key": GEMINI_API_KEY}
    async with httpx.AsyncClient() as client:
        r = await client.post(GEMINI_URL, params=params, json=payload)
        r.raise_for_status()
        result = r.json()
        reply = result["candidates"][0]["content"]["parts"][0]["text"]
    return {"reply": reply}
```

Ensure the `GEMINI_API_KEY` environment variable is set before starting Uvicorn:

```bash
export GEMINI_API_KEY=your-key
uvicorn backend.main:app --reload
```

## 3. Connecting the Pieces

1. The frontend collects user input (text, speech transcription, or gesture-derived text).
2. Input is posted to `/chat` on the FastAPI backend.
3. The backend calls Gemini's API and returns the model's response.
4. The frontend displays or speaks the response.

This architecture allows the chatbot to interact using multiple modalities while leveraging Gemini's language understanding and generation capabilities.
