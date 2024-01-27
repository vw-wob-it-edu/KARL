from flask import Flask, request, jsonify
import requests
from langchain.llms import Ollama

app = Flask(__name__)
python_port = 5000

def take_command(command):
    # send command to AI (e.g., llama2)
    ollama = Ollama(base_url='http://localhost:8080', model='llama2') #change model as needed
    text_ollama = ollama.invoke(command)
    print (text_ollama)


@app.route('/process_transcript', methods=['POST'])
def process_transcript():
    data = request.json
    transcript = data['transcript']

    # Process the transcript (you can do more complex processing here)
    print(f"Received transcript: {transcript}")

    take_command(transcript)

    # Send success response back to the JavaScript app
    requests.post('http://localhost:3000/process_success', json={'message': 'Success'})

    return jsonify({'message': 'Transcript processed successfully'})

if __name__ == '__main__':
    app.run(port=python_port)

