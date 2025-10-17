document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const pdfUpload = document.getElementById('pdf-upload');
    const resultsArea = document.getElementById('analysis-results');

    analyzeBtn.addEventListener('click', () => {
        const file = pdfUpload.files[0];
        if (!file) {
            alert('Please select a PDF file.');
            return;
        }

        resultsArea.innerHTML = '<div class="loader"></div>';

        const formData = new FormData();
        formData.append('file', file);

        fetch('/analyze_report', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            resultsArea.innerHTML = '';
            if (data.summary) {
                const card = document.createElement('div');
                card.className = 'analysis-card';
                
                let patientInfoHtml = '';
                if (data.summary.patient_info) {
                    for (const key in data.summary.patient_info) {
                        if (data.summary.patient_info[key]) {
                            patientInfoHtml += `<p><strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> ${data.summary.patient_info[key]}</p>`;
                        }
                    }
                }

                let diagnosisList = '';
                if (data.summary.diagnosis && data.summary.diagnosis.length > 0) {
                    diagnosisList = '<ul>' + data.summary.diagnosis.map(diag => `<li>${diag}</li>`).join('') + '</ul>';
                }

                let findingsList = '';
                if (data.summary.key_findings && data.summary.key_findings.length > 0) {
                    findingsList = '<ul>' + data.summary.key_findings.map(finding => `
                        <li>
                            <strong>Finding:</strong> ${finding.finding || 'N/A'}<br>
                            <strong>Severity:</strong> ${finding.severity || 'N/A'}<br>
                            <strong>Implication:</strong> ${finding.implication || 'N/A'}
                        </li>
                    `).join('') + '</ul>';
                }

                let medicationsList = '';
                if (data.summary.medications && data.summary.medications.length > 0) {
                    medicationsList = '<ul>' + data.summary.medications.map(med => `<li>${med}</li>`).join('') + '</ul>';
                }

                card.innerHTML = `
                    <h3>Medical Report Analysis Summary</h3>
                    <div class="section">
                        <h4>Patient Information</h4>
                        ${patientInfoHtml || '<p>No patient information found.</p>'}
                    </div>
                    <div class="section">
                        <h4>Diagnosis</h4>
                        ${diagnosisList || '<p>No diagnosis found.</p>'}
                    </div>
                    <div class="section">
                        <h4>Key Findings</h4>
                        ${findingsList || '<p>No key findings found.</p>'}
                    </div>
                    <div class="section">
                        <h4>Medications</h4>
                        ${medicationsList || '<p>No medications found.</p>'}
                    </div>
                    <div class="section">
                        <h4>Recommendations</h4>
                        <p>${data.summary.recommendations || 'No recommendations provided.'}</p>
                    </div>
                    <div class="section">
                        <h4>Follow-up</h4>
                        <p>${data.summary.follow_up || 'No follow-up information provided.'}</p>
                    </div>
                `;
                resultsArea.appendChild(card);
            } else {
                resultsArea.innerHTML = `<p>${data.error || 'No summary found.'}</p>`;
            }
        })
        .catch(error => {
            resultsArea.innerHTML = '';
            console.error('Error:', error);
            resultsArea.innerHTML = '<p>An error occurred during analysis.</p>';
        });
    });
});