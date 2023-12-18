import mysql.connector
from dal.DBContext import host,username,passwd,database
    
class Plant:
    def __init__(self, id,ten_cay,min_ideal_temp,max_ideal_temp,min_ideal_humidity,max_ideal_humidity,min_ideal_sunlight,max_ideal_sunlight,min_ideal_soil_moisture,max_ideal_soil_moisture):
        self.id=id
        self.ten_cay=ten_cay
        self.min_ideal_temp=min_ideal_temp
        self.max_ideal_temp=max_ideal_temp
        self.min_ideal_humidity=min_ideal_humidity
        self.max_ideal_humidity=max_ideal_humidity
        self.min_ideal_sunlight=min_ideal_sunlight
        self.max_ideal_sunlight=max_ideal_sunlight
        self.min_ideal_soil_moisture=min_ideal_soil_moisture
        self.max_ideal_soil_moisture=max_ideal_soil_moisture
    def to_dict(self):
        return {
            "id": self.id,
            "ten_cay": self.ten_cay,
            "min_ideal_temp": self.min_ideal_temp,
            "max_ideal_temp": self.max_ideal_temp,
            "min_ideal_humidity": self.min_ideal_humidity,
            "max_ideal_humidity": self.max_ideal_humidity,
            "min_ideal_sunlight": self.min_ideal_sunlight,
            "max_ideal_sunlight": self.max_ideal_sunlight,
            "min_ideal_soil_moisture": self.min_ideal_soil_moisture,
            "max_ideal_soil_moisture": self.max_ideal_soil_moisture
        }

def getAllPlants():
    db=mysql.connector.connect(
        host=host,
        user=username,
        passwd=passwd,
        database=database
    )
    myCursor=db.cursor()
    myCursor.execute("SELECT * FROM iot.cay")
    records=[]
    for item in myCursor:
        records.append(Plant(item[0],item[1],item[2],item[3],item[4],item[5],item[6],item[7],item[8],item[9]))
    return records
def getPlantByIdealTempAndIdealHum(temp,hum):
    db=mysql.connector.connect(
        host=host,
        user=username,
        passwd=passwd,
        database=database
    )
    myCursor=db.cursor()
    query = "SELECT * FROM cay WHERE min_ideal_temp <= %s AND max_ideal_temp >= %s AND min_ideal_humidity<=%s AND max_ideal_humidity>=%s"
    myCursor.execute(query,(temp,temp,hum,hum,))
    records = []
    for item in myCursor:
        records.append(Plant(item[0],item[1],item[2],item[3],item[4],item[5],item[6],item[7],item[8],item[9]))
    print(records)
    return records

def getPlantByName(plant_name):
    db = mysql.connector.connect(
        host=host,
        user=username,
        passwd=passwd,
        database=database
    )
    myCursor = db.cursor()
    query = "SELECT * FROM iot.cay WHERE ten_cay = %s"
    myCursor.execute(query, (plant_name,))

    record = None
    for item in myCursor:
        record = Plant(item[0],item[1],item[2],item[3],item[4],item[5],item[6],item[7],item[8],item[9]).to_dict()
        break  # Only take the first record

    print(record)
    return record

# import paho.mqtt.client as mqtt
# import paho.mqtt.publish as publish
# import time 

# MQTT_SERVER = "broker.mqttdashboard.com"
# MQTT_PORT = 1883
# MQTT_USER = "flslayder1312@gmail.com"
# MQTT_PASSWORD = "Huuhuy1312@"
# MQTT_TEMP_TOPIC = "ESP32/DHT11/Temp"
# MQTT_HUM_TOPIC = "ESP32/DHT11/Hum"
# MQTT_LED_TOPIC = "ESP32/Led"
# MQTT_TEST_TOPIC = "test1" 

# def on_connect(client, userdata, flags, rc):
#     if rc == 0:
#         print("Connected to MQTT broker")
#         client.subscribe(MQTT_LED_TOPIC)
#     else:
#         print(f"Failed to connect, return code: {rc}")

# client = mqtt.Client()
# client.on_connect = on_connect

# client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
# client.connect(MQTT_SERVER, MQTT_PORT)

# client.loop_start()

 
#         if client.is_connected():
#             message = "Hello from Python MQTT"
#             publish.single(MQTT_TEST_TOPIC, message, hostname=MQTT_SERVER, port=MQTT_PORT, auth={'username': MQTT_USER, 'password': MQTT_PASSWORD})
#         else:
#             print("Not connected to MQTT broker, will retry in 5 seconds")
        
#         time.sleep(5)
        

