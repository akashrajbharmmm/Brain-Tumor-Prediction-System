from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tensorflow.keras.models import load_model
import json
import os

from preprocess import prepare_image
from gradcam import make_gradcam_heatmap, save_overlay

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join('..', 'models', 'final_model.keras')
CLASSES_PATH = os.path.join('..', 'models', 'class_indices.json')
HEATMAP_DIR = 'heatmaps'

os.makedirs(HEATMAP_DIR, exist_ok=True)

model = load_model(MODEL_PATH)

with open(CLASSES_PATH, 'r') as f:
    idx_to_class = json.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'no image uploaded'}), 400

    file = request.files['image']
    temp_path = 'temp_upload.jpg'
    file.save(temp_path)

    img_array = prepare_image(temp_path)
    preds = model.predict(img_array)[0]

    class_idx = int(preds.argmax())
    predicted_class = idx_to_class[str(class_idx)]
    confidence = float(preds[class_idx])

    heatmap_filename = f'heatmap_{os.urandom(4).hex()}.jpg'
    heatmap_path = os.path.join(HEATMAP_DIR, heatmap_filename)

    heatmap = make_gradcam_heatmap(img_array, model)
    save_overlay(temp_path, heatmap, heatmap_path)

    os.remove(temp_path)

    if predicted_class == 'notumor':
        result = {
            'prediction': 'No Tumor',
            'tumorType': None,
            'confidence': confidence,
            'heatmapUrl': f'/heatmaps/{heatmap_filename}'
        }
    else:
        result = {
            'prediction': 'Tumor Detected',
            'tumorType': predicted_class,
            'confidence': confidence,
            'heatmapUrl': f'/heatmaps/{heatmap_filename}'
        }

    return jsonify(result)


@app.route('/heatmaps/<filename>')
def get_heatmap(filename):
    return send_from_directory(HEATMAP_DIR, filename)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)