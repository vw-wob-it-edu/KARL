from langchain_community.llms import Ollama

#send message to llama2
def take_command_llama2(command):
    ollama = Ollama(base_url='http://localhost:8080', model='llama2', verbose = True)

    text_ollama = ""

    for char in ollama.stream(command):
        print(char)
        text_ollama += char

    return text_ollama

#send image and message to llava
def take_command_llava_image(image, message):
    bakllava = Ollama(base_url="http://localhost:8080", model="llava")

    image_b64 = image.split(',')[1]

    llm_with_image_context = bakllava.bind(images=[image_b64])
    response = llm_with_image_context.invoke(message)

    return response