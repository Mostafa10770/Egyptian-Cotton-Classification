from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
import os
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
import numpy as np

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['UPLOAD_FOLDER'] = 'uploads'
model = load_model('./new_densenet121.h5')
target_size = (224, 224)
CLASS_NAMES = ['G86', 'G92', 'G94', 'G96', 'G97']

def preprocess_image(image, target_size):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize(target_size)
    image = keras_image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = image / 255.0 
    return image

@app.route('/', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        uploaded_file = request.files['file']

        if uploaded_file.filename != '':
            filename = secure_filename(uploaded_file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            uploaded_file.save(file_path)

            image = keras_image.load_img(file_path, target_size=(224, 224))
            processed_image = preprocess_image(image, target_size=(224, 224))

            result = model.predict(processed_image)
            predicted_class_index = np.argmax(result)
            confidence = result[0][predicted_class_index]

            # Set a threshold for confidence
            # threshold = 0.7039
            threshold = 0.9807
            # threshold = 0.9789
            if confidence >= threshold:
                classification_result = CLASS_NAMES[predicted_class_index]
            else:
                classification_result = "This image does not match any cotton fiber type."

            return jsonify({'classification': classification_result})

    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
