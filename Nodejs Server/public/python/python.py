from flask import Flask, request, jsonify
from langchain_community.llms import Ollama
import requests
from flask_cors import CORS, cross_origin
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
python_port = 5000
CORS(app, supports_credentials=True)  # Enable CORS for all routes with credentials

def take_command_llama2(command):
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

def take_command_llava(image, message):

    bakllava = Ollama(base_url="http://localhost:8080", model="bakllava")


    #file_path = "/home/daniel/Downloads/apple.jpg"
    #pil_image = Image.open(file_path)
    #image_b64 = convert_to_base64(pil_image)
    image_b64 = image.split(',')[1]
    #plt_img_base64(image_b64)

    llm_with_image_context = bakllava.bind(images=[image_b64])
    response = llm_with_image_context.invoke(message)
    #print(image_b64)
    #print(response)

    return response

@app.route('/process_transcript', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://127.0.0.1:3000', supports_credentials=True)
def process_transcript():
    if request.method == 'OPTIONS':
        # Handle preflight request (ignore)
        response = jsonify({'message': 'Preflight request successful'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    data = request.json
    transcript = data['transcript']
    message = data['message']

    if transcript == None:
        response_from_ollama = take_command_llama2(transcript)

    else:
        response_from_ollama = take_command_llava(transcript, message)
    

    # Process the transcript (you can do more complex processing here)
    print(f"Received message: {message}")
   

    requests.post('http://localhost:3000/process_success', json={'message': response_from_ollama})

    return jsonify({'message': response_from_ollama, 'status': 'Transcript processed successfully'})

if __name__ == '__main__':
    app.run(port=python_port)
