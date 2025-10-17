# Health Project

## Description
This is a web application related to health, likely built with Python Flask, serving dynamic content and static assets.

## Project Structure
- `app.py`: The main Flask application file.
- `requirements.txt`: Lists Python dependencies.
- `static/`: Contains static files like CSS, JavaScript, and images.
  - `static/styles.css`: Main stylesheet.
  - `static/*.js`: JavaScript files for client-side interactivity.
- `templates/`: Contains HTML templates rendered by Flask.
  - `templates/base.html`: Base template.
  - `templates/home.html`, `templates/index.html`, `templates/disease.html`, `templates/report.html`: Specific page templates.
- `.env`: Environment variables (e.g., API keys, configuration).
- `.gitignore`: Specifies intentionally untracked files to ignore.
- `check_models.py`: Likely a script to check or manage machine learning models.
- `test_gemini.py`: Tests related to Gemini integration or other functionalities.

## Installation
1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd health
    ```
2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Usage
1.  **Set up environment variables:**
    Create a `.env` file in the root directory and add any necessary environment variables (e.g., `FLASK_APP=app.py`, `FLASK_ENV=development`).
2.  **Run the application:**
    ```bash
    flask run
    ```
    The application should now be running at `http://127.0.0.1:5000/` (or another specified port).

## Technologies Used
- Python
- Flask (presumably)
- HTML, CSS, JavaScript
- Potentially machine learning models (given `check_models.py`)
