import json
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import paho.mqtt.client as mqtt
import schedule
from datetime import datetime,timedelta
import paho.mqtt.publish as publish
from pytz import timezone
import time
app = Flask(__name__)
CORS(app, supports_credentials=False, methods=["GET", "POST", "PUT", "DELETE"])

# Import userDAO and MQTT constants
from dal import userDAO
from dal import plantDAO
MQTT_SERVER = "broker.mqttdashboard.com"
MQTT_PORT = 1883
MQTT_USER = "flslayder1312@gmail.com"
MQTT_PASSWORD = "Huuhuy1312@"
MQTT_TEMP_TOPIC = "ESP32/DHT11/Temp"
MQTT_HUM_TOPIC = "ESP32/DHT11/Hum"
MQTT_SOIL_TOPIC = "ESP32/DHT11/Soil"
MQTT_LIGHT_TOPIC = "ESP32/DHT11/Light"
MQTT_UPLOAD_TOPIC = "ESP32/IdealTemp"
MQTT_TEST_TOPIC = "test2"
temp_arr = []
hum_arr = []
soil = []
light = []
client = mqtt.Client()
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe(MQTT_TEMP_TOPIC)
        client.subscribe(MQTT_HUM_TOPIC)
        client.subscribe(MQTT_SOIL_TOPIC)
        client.subscribe(MQTT_LIGHT_TOPIC)
    else:
        print(f"Failed to connect, return code: {rc}")

def on_message(client, userdata, message):
    decoded_data = message.payload.decode()
    temp_arr.append(decoded_data)

def on_message2(client, userdata, message):
    decoded_data = message.payload.decode()
    hum_arr.append(decoded_data)
def on_message3(client, userdata, message):
    decoded_data = message.payload.decode()
    soil.append(decoded_data)
def on_message4(client, userdata, message):
    decoded_data = message.payload.decode()
    light.append(decoded_data)
def start_mqtt_listener():
    
    client.on_connect = on_connect
    client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
    client.message_callback_add(MQTT_TEMP_TOPIC, on_message)
    client.message_callback_add(MQTT_HUM_TOPIC, on_message2)
    client.message_callback_add(MQTT_SOIL_TOPIC, on_message3)
    client.message_callback_add(MQTT_LIGHT_TOPIC, on_message4)
    client.connect(MQTT_SERVER, MQTT_PORT)
    client.loop_start()
dateCurrent = None
@app.route('/api', methods=["GET"])
def return_data():
    if temp_arr and hum_arr:
        return jsonify({"Temp": temp_arr[-1], "Hum": hum_arr[-1],"Soil":soil[-1],"Light":light[-1]})
    else:
        return jsonify({"Temp": None, "Hum": None,"Soil":None,"Light":None})
@app.route('/mqtt', methods=["POST"])
def post_ideal_numbers():
    try:
        data = request.json
        print(data["temp"])
        if client.is_connected():
            publish.single(MQTT_UPLOAD_TOPIC, json.dumps(data), hostname=MQTT_SERVER, port=MQTT_PORT, auth={'username': MQTT_USER, 'password': MQTT_PASSWORD})
        else:
            print("Not connected to MQTT broker, will retry in 5 seconds")
    
        return jsonify("Success")
    except Exception as e:
        return jsonify({"error": str(e)})
@app.route('/getallusers', methods=['GET'])
def get_all_users():
    try:
        users = userDAO.getAllUsers()
        users = [user.to_dict() for user in users]
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/saveUser', methods=['POST'])
def save_user():
    try:
        data = request.json
        userDAO.saveUser(data)
        return jsonify("Success")
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        result = userDAO.checkUserExist(username, password)
        if result:
            return jsonify({"message": "success"})
        else:
            return jsonify({"error": "Đăng nhập không thành công. Tên người dùng hoặc mật khẩu không đúng."})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/insertuser', methods=['POST'])
def insert_user():
    try:
        data = request.json
        userDAO.insertUser((data['username'], data['password'], data['email']))
        return jsonify("Success")
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/getUserByEmail/<email>', methods=["GET"])
def get_user_by_email(email):
    try:
        user = userDAO.getUserByEmail(email)
        if user:
            return jsonify(user.to_dict())
        else:
            return jsonify(None)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/getPlantByName/<name>', methods=["GET"])
def get_plant_by_name(name):
    try:
        plants = plantDAO.getPlantByName(name)
        if not plants:
            return jsonify({"error": "Plant not found"}), 404
        return jsonify(plants), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
@app.route('/getPlantByTempAndHum', methods=["POST"])
def get_plant_by_temp_hum():
    try:
        data = request.json
        plants = plantDAO.getPlantByIdealTempAndIdealHum(data["temp"],data["hum"])
        plants = [user.to_dict() for user in plants]
        return jsonify(plants)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#import moudule cần thiết

    
if __name__ == "__main__":
    start_mqtt_listener()
    app.run(debug=True, port=5001)
    
