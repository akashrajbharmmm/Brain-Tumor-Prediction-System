from PIL import Image
import numpy as np

IMG_SIZE = 224

def prepare_image(img_path):
    img = Image.open(img_path)
    img = img.convert('RGB')
    img = img.resize((IMG_SIZE, IMG_SIZE))

    arr = np.array(img)
    arr = arr / 255.0
    arr = np.expand_dims(arr, axis=0)

    return arr