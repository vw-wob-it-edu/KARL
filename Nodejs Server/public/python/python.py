from flask import Flask, request, jsonify
from langchain.llms import Ollama
import requests
from flask_cors import CORS, cross_origin

app = Flask(__name__)
python_port = 5000
CORS(app, supports_credentials=True)  # Enable CORS for all routes with credentials

def take_command(command):
    # send command to AI (e.g., llama2)
    ollama = Ollama(base_url='http://localhost:8080', model='llama2')  # change model as needed
    #text_ollama = ollama.invoke(command)
    #print(text_ollama)

    text_ollama = ""

    for char in ollama.stream(command):
        # Send success response back to the JavaScript app with the response from take_command
        print(char)
        text_ollama += char

    return text_ollama

@app.route('/process_transcript', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://127.0.0.1:3000', supports_credentials=True)
def process_transcript():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'message': 'Preflight request successful'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    data = request.json
    transcript = data['transcript']

    # Process the transcript (you can do more complex processing here)
    print(f"Received transcript: {transcript}")

    response_from_ollama = take_command(transcript)

    requests.post('http://localhost:3000/process_success', json={'message': response_from_ollama})

    return jsonify({'message': response_from_ollama, 'status': 'Transcript processed successfully'})

if __name__ == '__main__':
    app.run(port=python_port)
