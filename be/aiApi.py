#import moudule cần thiết
import tensorflow as tf
loaded_model = tf.keras.models.load_model('be\love_stage_m3.h5')
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings
import os
import tqdm
import random
from keras.preprocessing.image import load_img
warnings.filterwarnings('ignore')
from flask_restful import Api, Resource, reqparse
from tensorflow.keras.preprocessing.image import load_img
import numpy as np
from werkzeug.datastructures import FileStorage

from flask import Flask

app = Flask(__name__)
api = Api(app)

class PredictAPI(Resource):
    def get(self):
        # parser = reqparse.RequestParser()
        # parser.add_argument('file', type=FileStorage, location='files', required=True, help='No image file provided')
        # args = parser.parse_args()

        # # Nhận ảnh từ request
        # uploaded_file = args['file']

        # # Lưu ảnh vào thư mục tạm thời (có thể cần xử lý bảo mật)
        # uploaded_file.save('be\cây táo.jpg')

        # Thực hiện dự đoán với mô hình
        image_path = 'be\cây táo.jpg'
        img = load_img(image_path, target_size=(128, 128))
        img = np.array(img)
        img = img / 255.0
        img = img.reshape(1, 128, 128, 3)

        # Giả sử loaded_model đã được định nghĩa ở nơi khác trong mã của bạn
        predictions = loaded_model.predict(img)
        predicted_class_indices = np.argmax(predictions, axis=1)
        label_to_class = {0:'CayCaChua', 1: 'CayChuoi', 2: 'CayNhan', 3:'CayOi', 4:'CayTao', 5:'Khoai', 6:'KhoaiLang', 7:'RauBi',8:'CaiThao', 9: 'RauMuong', 10:'SupLo'}
        predicted_class = label_to_class[int(predicted_class_indices)]
        confidence = np.max(predictions) * 100

        # Trả về kết quả
        result = {
            'predicted_class': predicted_class,
            'confidence': confidence
        }

        return result

# Gắn tài nguyên với đường dẫn URL '/predict'
api.add_resource(PredictAPI, '/predict')

if __name__ == '__main__':
    app.run(debug=True)
    