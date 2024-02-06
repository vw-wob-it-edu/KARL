#!/bin/bash

# Funktion zum Ausführen von "ollama serve"
run_serve() {
    echo "Running 'ollama serve'..."
    gnome-terminal --title="serve" -- bash -c "ollama serve; exec bash"
}

# Funktion zum Starten des Node.js-Servers
start_node_server() {
    echo "Starting Node.js server..."
    cd /home/marvin/Desktop/server/KARL/Nodejs\ Server/
    gnome-terminal --title="Node.js Server" -- bash -c "node server.js; exec bash"
}

# Funktion zum Ausführen von "python3 python.py"
run_python_script() {
    echo "Running Python script..."
    cd /home/marvin/Desktop/server/KARL/Nodejs\ Server/public/python/
    gnome-terminal --title="Python Script" -- bash -c "python3 python.py; exec bash"
}

# Funktion zum Ausführen von "ollama run llama2"
run_llama2() {
    echo "Running 'ollama run llama2'..."
    gnome-terminal --title="Llama2" -- bash -c "ollama run llama2; exec bash"
}

# Befehle ausführen, wenn das Skript gestartet wird
run_serve
start_node_server
run_python_script
run_llama2
