import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_gemini_api():
    try:
        genai.configure(api_key=os.environ["API_KEY"])
        model = genai.GenerativeModel('gemini-flash-latest')
        
        symptoms = ["fever", "cough", "headache"]
        prompt = f'''
You are a medical assistant AI. Based on the given symptoms: {symptoms}, predict the top 5 possible diseases with confidence %, short explanation, prescription, and type of doctor to consult. 
Return only a valid JSON in this format:
{{
  "predictions": [
    {{"disease": "", "confidence": 0, "explanation": "", "prescription": "", "doctor": ""}}
  ]
}}
'''

        print("--- Sending Prompt to Gemini ---")
        print(prompt)

        response = model.generate_content(prompt)

        print("--- Received Response from Gemini ---")
        print(response.text)

        print("--- Attempting to Parse JSON ---")
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '')
        prediction_data = json.loads(cleaned_response)
        print("--- JSON Parsed Successfully ---")
        print(prediction_data)

    except Exception as e:
        print(f"--- An Error Occurred ---")
        print(e)

if __name__ == '__main__':
    test_gemini_api()
