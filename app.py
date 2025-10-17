import os
import json
import fitz # PyMuPDF
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure Gemini API
try:
    genai.configure(api_key=os.environ["API_KEY"])
    model = genai.GenerativeModel('gemini-flash-latest')
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/disease')
def disease_prediction():
    return render_template('disease.html')

@app.route('/report')
def report_analysis():
    return render_template('report.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Gemini API not configured"}), 500

    symptoms = request.json.get('symptoms', [])
    if not symptoms:
        return jsonify({"error": "Symptoms are required"}), 400

    json_structure = '{{"predictions": [{{"disease": "", "confidence": 0, "explanation": "Detailed explanation including common associated symptoms and why it\'s a likely candidate.", "prescription": "General advice or type of medication if applicable, not a specific drug.", "doctor": "Specialty of doctor to consult.", "diagnostic_tests": [""]}}]}}'
    prompt = f'''
As a highly experienced medical AI, analyze the following symptoms: {symptoms}.
Based on these symptoms, predict the top 5 most probable diseases. For each disease, provide:
1.  **disease**: The name of the disease.
2.  **confidence**: A confidence score (0-100) indicating the likelihood.
3.  **explanation**: A detailed explanation (3-5 sentences) including common associated symptoms, key differentiating factors, and why this disease is a likely candidate given the input symptoms.
4.  **prescription**: General advice or type of medication if applicable (e.g., "Pain relievers", "Antibiotics", "Rest and hydration"). DO NOT suggest specific drug names or dosages.
5.  **doctor**: The specialty of the doctor to consult for this condition (e.g., "General Practitioner", "Dermatologist", "Cardiologist").
6.  **diagnostic_tests**: A list of potential diagnostic tests that might be performed to confirm the diagnosis.

IMPORTANT: Respond with ONLY a single, valid JSON object. Do not include any text, markdown, or ```json formatting before or after the JSON.
The JSON structure MUST be: {json_structure}
Remember, this is for informational purposes only and not a substitute for professional medical advice.
'''

    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '')
        prediction_data = json.loads(cleaned_response)
        return jsonify(prediction_data)

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": "Failed to get prediction from AI model."}), 500

@app.route('/analyze_report', methods=['POST'])
def analyze_report():
    if not model:
        return jsonify({"error": "Gemini API not configured"}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.pdf'):
        try:
            pdf_document = fitz.open(stream=file.read(), filetype="pdf")
            text = ""
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                text += page.get_text()
            
            json_structure = '{{"summary": {{"patient_info": {{"name": "", "age": "", "gender": "", "date_of_report": ""}}, "diagnosis": [], "key_findings": [{{"finding": "", "severity": "", "implication": ""}}], "medications": [], "recommendations": "", "follow_up": ""}}}}'
            prompt = f'''
Analyze the following medical report text and provide a structured summary.
Extract all relevant information into the specified JSON format. If a field is not found in the report, leave its value as an empty string or empty array as appropriate.
The JSON structure MUST be: {json_structure}
Report Text: {text}
'''
            response = model.generate_content(prompt)
            cleaned_response = response.text.strip().replace('```json', '').replace('```', '')
            analysis_data = json.loads(cleaned_response)
            return jsonify(analysis_data)

        except Exception as e:
            print(f"Error during report analysis: {e}")
            return jsonify({"error": "Failed to analyze report."}), 500

    return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

if __name__ == '__main__':
    app.run(debug=True)
