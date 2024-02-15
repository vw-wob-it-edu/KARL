
from langchain.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Embed and store
from langchain.vectorstores import Chroma
from langchain.embeddings import GPT4AllEmbeddings
from langchain.embeddings import OllamaEmbeddings

from langchain.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

import re

def scan_website_llama2(message):

    # Regular expression to match URLs
    url_pattern = re.compile(r'https?://\S+|www\.\S+')

    # Find all matches in the text
    found_link = re.findall(url_pattern, message)

    # Remove URLs from the original text
    filtered_text = re.sub(url_pattern, '', message)

    # Print the filtered text
    message = filtered_text

    # Print the found links
    url = found_link

    print(f"using URL: {url}")

    loader = WebBaseLoader(url)
    data = loader.load()

    # Split into chunks 
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=100)
    all_splits = text_splitter.split_documents(data)
    print(f"Split into {len(all_splits)} chunks")

    vectorstore = Chroma.from_documents(documents=all_splits,
                                        embedding=GPT4AllEmbeddings())

    # Retrieve
    # question = "What are the latest headlines on {url}?"
    # docs = vectorstore.similarity_search(question)

    print(f"Loaded {len(data)} documents")
    # print(f"Retrieved {len(docs)} documents")

    # RAG prompt
    from langchain import hub
    QA_CHAIN_PROMPT = hub.pull("rlm/rag-prompt-llama")


    # LLM
    llm = Ollama(base_url='http://localhost:8080',
                model="llama2",
                verbose=True,
                callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]))
    print(f"Loaded LLM model {llm.model}")

    # QA chain
    from langchain.chains import RetrievalQA
    qa_chain = RetrievalQA.from_chain_type(
        llm,
        retriever=vectorstore.as_retriever(),
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},

    )

    # Ask a question
    question = f"{message} {url}?"
    result = qa_chain({"query": question})


    result_value = result["result"]

    return result_value
    


if __name__ == "__main__":
    scan_website_llama2()







