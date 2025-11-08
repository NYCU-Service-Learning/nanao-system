from vosk import Model, KaldiRecognizer
import wave


def getFrameRate(path: str):
    with wave.open(path, "rb") as f:
        return f.getframerate()


def stt(audio_file, model_name):
# "https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip"
    model = Model("/app/" + model_name)

    frameRate = getFrameRate(audio_file)

    # Initialize the recognizer with the model
    recognizer = KaldiRecognizer(model, frameRate)

    # Open the audio file
    with open(audio_file, "rb") as audio:
        while True:
            # Read a chunk of the audio file
            data = audio.read(4000)
            if len(data) == 0:
                break
            # Recognize the speech in the chunk
            recognizer.AcceptWaveform(data)

    # Get the final recognized result
    result = recognizer.FinalResult()
    
    return result