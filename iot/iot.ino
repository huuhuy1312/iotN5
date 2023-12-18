#include <WiFi.h>
#include <PubSubClient.h>
#include <DHTesp.h>
#include "cJSON.h"
const int DHT_PIN = 15;
const int PUMP_PIN = 18;  

DHTesp dht; 

const char* ssid = "Galaxy A10s9610";
const char* password = "vwmk6404";

#define MQTT_SERVER "broker.mqttdashboard.com"
#define MQTT_PORT 1883
#define MQTT_USER "flslayder1312@gmail.com"
#define MQTT_PASSWORD "Huuhuy1312@"
#define MQTT_TEMP_TOPIC "ESP32/DHT11/Temp"
#define MQTT_HUM_TOPIC "ESP32/DHT11/Hum"
#define MQTT_SOIL_TOPIC "ESP32/DHT11/Soil"
#define MQTT_LIGHT_TOPIC "ESP32/DHT11/Light"
#define MQTT_UPLOAD_TOPIC  "ESP32/IdealTemp"
int value;
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;

unsigned long previousMillis = 0;
const long interval = 5000;
float tempFromTheWeb;
float humFromTheWeb;
float soilFromTheWeb;
void setup_wifi() { 
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA); 
  WiFi.begin(ssid, password); 

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

#include <ArduinoJson.h>

void callback(char* topic, byte* payload, unsigned int length) {
  String tempString; 
  for (int i = 0; i < length; i++) {
    tempString += (char)payload[i];
  }
  Serial.println(tempString);
  const char *jsonString = tempString.c_str();
  cJSON *jsonObject = cJSON_Parse(jsonString);
  if (jsonObject == NULL) {
    Serial.println("Lỗi trong quá trình phân tích cú pháp JSON.");
    return;
  }
  cJSON *temp = cJSON_GetObjectItemCaseSensitive(jsonObject, "temp");
  cJSON *hum = cJSON_GetObjectItemCaseSensitive(jsonObject, "hum");
  cJSON *soil = cJSON_GetObjectItemCaseSensitive(jsonObject, "soil");
  Serial.print("Nhiệt độ: ");
  tempFromTheWeb=temp->valuedouble;
  Serial.println(tempFromTheWeb);

  Serial.print("Độ ẩm: ");
  humFromTheWeb =hum->valuedouble;
  Serial.println(humFromTheWeb);

  Serial.print("Độ ẩm đất: ");
  soilFromTheWeb =soil->valuedouble;
  Serial.println(soilFromTheWeb);
  cJSON_Delete(jsonObject);
}


void reconnect() { 

  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "clientId-ROSEidIZnj";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("Connected to " + clientId);
      client.subscribe(MQTT_UPLOAD_TOPIC);    
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      
      delay(2000);
    }
  }
}

void setup() {
   
  Serial.begin(115200);
  setup_wifi(); 
  client.setServer(MQTT_SERVER, MQTT_PORT); 
  client.setCallback(callback); 
  dht.setup(DHT_PIN, DHTesp::DHT22);
  pinMode(PUMP_PIN, OUTPUT);  
  digitalWrite(PUMP_PIN, LOW);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  unsigned long now = millis();
  if (now - lastMsg > 2000) { 
    lastMsg = now;
    
    TempAndHumidity  data = dht.getTempAndHumidity();
    float temp = data.temperature; 
    float hum = data.humidity; 
    // Đọc giá trị từ cảm biến ánh sáng
    int lightValue = analogRead(34);
    int percentLight = map(lightValue,0,4095,0,100);
    percentLight = 100-percentLight;  
    // Đọc giá trị từ cảm biến độ ẩm đất
    value = analogRead(35);
    int percentSoil= map(value,2000,4095,0,100);
    percentSoil= 100-percentSoil;
    if (percentSoil < soilFromTheWeb) {
      // Độ ẩm đất dưới 48%: Bật máy bơm
      digitalWrite(PUMP_PIN, HIGH);
    } else if (percentSoil >= soilFromTheWeb) {
      // Độ ẩm đất đạt 80% trở lên: Tắt máy bơm
      digitalWrite(PUMP_PIN, LOW);
    }

    // Bật/Tắt máy bơm dựa trên độ ẩm đất


    // Serial.print("Temperature: ");
    // Serial.println(temp);
    // Serial.print("Humidity: ");
    // Serial.println(hum);
    // //In analog anh sang
    // Serial.print("Light AnaLog: ");
    // Serial.println(lightValue);
    // //In phan tram anh sang
    // Serial.print("Light: ");
    // Serial.print(percentLight);
    // Serial.println("%");
    //In Analog do am dat
    Serial.print("Soil Moisture AnaLog: ");
    Serial.println(value);
    // //In Phan tram do am dat
    Serial.print("Soil Moisture: ");
    Serial.print(percentSoil);
    // Serial.println("%");
    client.publish(MQTT_TEMP_TOPIC,String(temp).c_str());
    client.publish(MQTT_HUM_TOPIC, String(hum).c_str());
    client.publish(MQTT_SOIL_TOPIC,String(percentSoil).c_str());
    client.publish(MQTT_LIGHT_TOPIC, String(percentLight).c_str());
  }
}
