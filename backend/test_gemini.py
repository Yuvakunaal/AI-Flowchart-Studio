import asyncio
from google import genai
import os

async def main():
    client = genai.Client(api_key="invalid_dummy_key_123")
    print("Sending request with invalid key...")
    try:
        res = await asyncio.wait_for(client.aio.models.generate_content(
            model='gemini-3-flash-preview',
            contents='test'
        ), timeout=10)
        print("Done:", res.text)
    except Exception as e:
        print("Exception:", str(e))

asyncio.run(main())
