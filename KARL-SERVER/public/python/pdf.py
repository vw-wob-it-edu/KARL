from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import GPT4AllEmbeddings
from langchain.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chains import RetrievalQA
from langchain import hub


def handle_pdf(pdf_path, message):
    print(f"using PDF: {pdf_path}")

    # Load PDF
    loader = PyPDFLoader(pdf_path)
    data = loader.load()

    # Split into chunks 
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=100)
    all_splits = text_splitter.split_documents(data)
    print(f"Split into {len(all_splits)} chunks")

    vectorstore = Chroma.from_documents(documents=all_splits,
                                        embedding=GPT4AllEmbeddings())

    # LLM
    llm = Ollama(base_url='http://localhost:8080',
                model="llama2",
                verbose=True,
                callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]))
    print(f"Loaded LLM model {llm.model}")

    # RAG prompt
    QA_CHAIN_PROMPT = hub.pull("rlm/rag-prompt-llama")

    # QA chain
    qa_chain = RetrievalQA.from_chain_type(
        llm,
        retriever=vectorstore.as_retriever(),
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
    )

    # Ask a question
    question = f"{message} {pdf_path}"
    result = qa_chain({"query": question})

    print(type(result))

    result_value = result["result"]

    return result_value


if __name__ == "__main__":
    handle_pdf()
