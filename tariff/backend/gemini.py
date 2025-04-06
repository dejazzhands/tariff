from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
import json
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Initialize the Gemini AI client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Load tariff data from tariff.json
with open(os.path.join(os.path.dirname(__file__), "tariff.json"), "r") as f:
    tariff_data = json.load(f)

def calculate_import_price(query):
    """
    Calculate the total price for importing goods based on user input.
    """
    prompt = f"""
    Based on the following input: "{query}", calculate the total price for importing goods following reciprocal tariffs.
    Use the following tariff data for accurate calculations:
    {json.dumps(tariff_data, indent=4)}
    Use this JSON schema for the output:
    {{
        "query1": {{
            "food": str,
            "units in kilogram": int,
            "country of origin": str,
            "tariff percentage from country of origin": float,
            "market price in origin country per kilogram (USD)": float,
            "total price of importing(USD)": float
        }}
    }}
    The total price is calculated as:
    (market price per kilogram * units in kilogram) + (tariff percentage * market price per unit * units / 100).
    Return the result in JSON format.
    """
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt,
    )
    return response.text

# / = hello world
@app.route('/')
def hello_world():
    return 'Hello, World!'

# API endpoint for the frontend
@app.route('/gemini', methods=['POST'])
def gemini_endpoint():
    data = request.json
    if not data or "query" not in data:
        return jsonify({"error": "Query is required"}), 400
    query = data["query"]
    result = calculate_import_price(query)
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)