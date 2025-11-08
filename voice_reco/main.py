from flask import Flask, request
from transformers import pipeline
from random import randint
import os

pipe = pipeline(
    task="automatic-speech-recognition",
    model="openai/whisper-small",
    generate_kwargs={"language": "zh", "task": "transcribe"}
)

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
    if 'file' not in request.files:
        return 'No file uploaded', 400
    
    x = randint(1, 1000)
    file = request.files['file']
    file.save(f"./audio{x}.wav")
    result = pipe(f"/app/audio{x}.wav")
    os.remove(f"/app/audio{x}.wav")
    
    response = {
        "text": result["text"]
    }
    
    return response, 200

if __name__ == '__main__':
    app.run(debug=True)