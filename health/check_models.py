import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])

print("Supported Gemini Models:")
for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(f"- {m.display_name} ({m.name})")
