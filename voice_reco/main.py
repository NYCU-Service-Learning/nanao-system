from flask import Flask, request
from transformers import pipeline
from google import genai
from google.genai import types
from random import randint
import os

prompt1 = "Please analyze the following symptom description: "
prompt2 = " and reply two elements in the given format.\n"
prompt3 = "The format: body_part, pain_level (e.g. left_ear, 7)\n"
prompt4 = "Additional constraints: \n"
prompt5 = "1. The first element should be one of the string in this list:\n"
prompt6 = "2. The second element should be an integer between 1 to 10.\n"

body_part_list = ['head', 'back_head', 'right_ear', 'left_ear', 'right_eye', 'left_eye', 
                  'nose', 'mouth', 'upper_body', 'neck', 'back_neck', 'right_shoulder', 
                  'left_shoulder', 'right_upper_arm', 'left_upper_arm', 'right_lower_arm', 
                  'left_lower_arm', 'right_hand', 'left_hand', 'right_elbow', 'left_elbow', 
                  'abdomen', 'back', 'lower_back', 'butt', 'lower_body', 'right_upper_leg', 
                  'left_upper_leg', 'right_knee', 'left_knee', 'right_lower_leg', 
                  'left_lower_leg', 'right_ankle', 'left_ankle', 'right_feet', 'left_feet']

client = genai.Client()

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

    prompt = prompt1 + result["text"] + prompt2 \
        + prompt3 + prompt4 + prompt5 \
        + str(body_part_list) + prompt6

    keyword = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt,
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0)
        ),
    ).text.split(',')

    print(keyword)

    url = '/interact?current_part=' + keyword[0] + '&&pain_level=' + keyword[1]
    
    response = {
        "text": url,
        "voice_reco_success": 1
    }
    
    return response, 200

if __name__ == '__main__':
    app.run(debug=True)