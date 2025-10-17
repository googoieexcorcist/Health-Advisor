document.addEventListener('DOMContentLoaded', () => {
    const predictBtn = document.getElementById('predict-btn');
    const resetBtn = document.getElementById('reset-btn');
    const symptomsInput = document.getElementById('symptoms');
    const resultsArea = document.getElementById('results');
    const suggestionsContainer = document.getElementById('suggestions-container');

    const allSymptoms = [
        'fever', 'cough', 'headache', 'sore throat', 'runny nose', 'body ache', 'fatigue', 'nausea',
        'vomiting', 'diarrhea', 'chills', 'shortness of breath', 'rash', 'dizziness', 'abdominal pain',
        'joint pain', 'muscle pain', 'loss of appetite', 'weight loss', 'swelling', 'redness',
        'itching', 'blurred vision', 'chest pain', 'confusion', 'anxiety', 'depression', 'insomnia'
    ];

    // Predict Button Logic
    predictBtn.addEventListener('click', () => {
        const symptoms = symptomsInput.value.trim();
        if (!symptoms) {
            alert('Please enter symptoms.');
            return;
        }

        resultsArea.innerHTML = '<div class="loader"></div>'; // Create loader

        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms: symptoms.split(',').map(s => s.trim()) }),
        })
        .then(response => response.json())
        .then(data => {
            resultsArea.innerHTML = ''; // Clear loader
            if (data.predictions && data.predictions.length > 0) {
                data.predictions.forEach(p => {
                    const card = document.createElement('div');
                    card.className = 'prediction-card';
                    card.innerHTML = `
                        <h3>${p.disease} (${p.confidence}%)</h3>
                        <p><strong>Explanation:</strong> ${p.explanation}</p>
                        <p><strong>Prescription:</strong> ${p.prescription}</p>
                        <p><strong>Doctor:</strong> ${p.doctor}</p>
                        ${p.diagnostic_tests && p.diagnostic_tests.length > 0 ? 
                            `<p><strong>Diagnostic Tests:</strong></p><ul>${p.diagnostic_tests.map(test => `<li>${test}</li>`).join('')}</ul>` : ''}
                    `;
                    resultsArea.appendChild(card);
                });
            } else {
                resultsArea.innerHTML = '<p>No results found. Please try again with different symptoms.</p>';
            }
        })
        .catch(error => {
            resultsArea.innerHTML = ''; // Clear loader
            console.error('Error:', error);
            resultsArea.innerHTML = '<p>An error occurred. Please try again later.</p>';
        });
    });

    // Reset Button Logic
    resetBtn.addEventListener('click', () => {
        symptomsInput.value = '';
        resultsArea.innerHTML = '';
        suggestionsContainer.innerHTML = '';
    });

    // Symptom Suggestion Logic
    symptomsInput.addEventListener('input', () => {
        const inputText = symptomsInput.value.split(',').pop().trim().toLowerCase();
        suggestionsContainer.innerHTML = '';

        if (inputText.length === 0) {
            return;
        }

        const suggestions = allSymptoms.filter(symptom => symptom.toLowerCase().startsWith(inputText));

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                const currentSymptoms = symptomsInput.value.split(',').map(s => s.trim());
                currentSymptoms.pop(); // Remove the partially typed symptom
                currentSymptoms.push(suggestion);
                symptomsInput.value = currentSymptoms.join(', ') + ', ';
                suggestionsContainer.innerHTML = '';
                symptomsInput.focus();
            });
            suggestionsContainer.appendChild(item);
        });
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (event) => {
        if (!suggestionsContainer.contains(event.target) && event.target !== symptomsInput) {
            suggestionsContainer.innerHTML = '';
        }
    });
});