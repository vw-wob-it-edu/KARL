from flask import Flask, request, jsonify
from langchain_community.llms import Ollama
import requests
from flask_cors import CORS, cross_origin
import base64
from io import BytesIO
from PIL import Image
from website import scan_website_llama2
from pdf import handle_pdf
import re

app = Flask(__name__)
python_port = 5000
CORS(app, supports_credentials=True)  # Enable CORS for all routes with credentials

def take_command_llama2(command):
    # send command to AI (e.g., llama2)
    ollama = Ollama(base_url='http://localhost:8080', model='llama2', verbose = True)  # change model as needed

    text_ollama = ""

    for char in ollama.stream(command):
        # Send success response back to the JavaScript app with the response from take_command
        print(char)
        text_ollama += char

    return text_ollama

def take_command_llava_image(image, message):
    bakllava = Ollama(base_url="http://localhost:8080", model="llava")

    image_b64 = image.split(',')[1]

    llm_with_image_context = bakllava.bind(images=[image_b64])
    response = llm_with_image_context.invoke(message)

    return response

def take_command_llama2_website(transcript, message):
    # Implement the logic for processing website URL here
    pass

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
    fileName = data['fileName']

    if fileName is not None: 

        base64_to_pdf(transcript, fileName)

        requests.post('http://localhost:3000/process_success', json={'message': "PDF saved"})

        return jsonify({'message': "PDF saved", 'status': 'Transcript processed successfully'})

    else:

        # Process the transcript (you can do more complex processing here)
        print(f"Received message: {message}")

        if transcript is not None:
            if transcript.endswith(".pdf"):
                print("Received PDF")
                response_from_ollama = handle_pdf(f"saved_pdfs/{transcript}", message)
            elif transcript.startswith("data:image"):
                print("Received Image")
                response_from_ollama = take_command_llava_image(transcript, message)

        elif is_url(message):
            print("Received URL")
            response_from_ollama = scan_website_llama2(message)

        else:
            print("Received Plain Text")
            response_from_ollama = take_command_llama2(message)
    
        requests.post('http://localhost:3000/process_success', json={'message': response_from_ollama})

        return jsonify({'message': response_from_ollama, 'status': 'Transcript processed successfully'})




def base64_to_pdf(base64_string, filename):
    try:
        # Decode the base64 string
        pdf_bytes = base64.b64decode(base64_string)
        
        # Write the decoded bytes to a PDF file with the provided filename
        with open(f"saved_pdfs/{filename}", 'wb') as f:
            f.write(pdf_bytes)
        
        print("PDF saved successfully.")
    except Exception as e:
        print("Error:", e)


import re

def is_url(message):
    # Define the URL pattern
    url_pattern = re.compile(r'https?://\S+|www\.\S+')

    # Find all matches in the text
    found_links = re.findall(url_pattern, message)

    # Return True if any links are found, False otherwise
    return bool(found_links)


if __name__ == '__main__':
    app.run(port=python_port)