from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from tensorflow import keras

app = FastAPI()
 
MODEL = keras.models.load_model("C:/Users/HP/Desktop/DeepLearning_Projects/potato_disease_classification/models/potatoes_model/model_v1.keras")
CLASS_NAMES = ['Early Blight', 'Late Blight', 'Healthy']


@app.get("/ping")
async def ping():
    return "Hello World"


def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())

    img_batch = np.expand_dims(image, 0)
    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    return {
        "predicted_class": predicted_class,
        "confidenceiu": float(confidence)
    }



if __name__ == "__main__":
    uvicorn.run(app, host = 'localhost', port = 8000)
