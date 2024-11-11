#include <WiFi.h>
#include <PubSubClient.h>
#include "time.h"
#include <esp_mac.h> 
char uid[13];

char *ssid = "";
char *pwd = "";

char *mqttServer = "test.mosquitto.org";

char *ntpServer = "br.pool.ntp.org";
long gmtOffset = -3;
int daylight = 0;
time_t now;
struct tm timeinfo;

uint32_t hora = 3;
uint32_t ultimaHora = 1;

WiFiClient wclient;
PubSubClient mqttClient(wclient);

void connectWiFi()
{
  Serial.print("Conectando ");
  while(WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Conectado com sucesso, com o IP ");
  Serial.println(WiFi.localIP());
}

void connectMqtt()
{
  if (!mqttClient.connected())
  {
    if (mqttClient.connect(uid))
    {
      Serial.println("Conectou no MQTT");
    }
    else
    {
      Serial.println("MQTT offline");
      delay(500);
    }
  }
}

void setup() {
  Serial.begin(115200);
  uint8_t mac[6];
  esp_read_mac(mac, ESP_MAC_WIFI_STA);
  snprintf(uid, sizeof(uid), "%02X%02X%02X%02X%02X%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);

  Serial.print("Datalogger ");
  Serial.println(uid);

  WiFi.begin(ssid, pwd);
  connectWiFi();
  configTime(gmtOffset, daylight, ntpServer);
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Erro ao acessar o servidor NTP"); 
  }
  else
  {
    Serial.print("A hora agora eh ");
    Serial.println(time(&now));
  }
  mqttClient.setServer(mqttServer, 1883);
}

void sincronizaTempo(void)
{
  //Configurando o tempo
  configTime(gmtOffset, daylight, ntpServer);
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Erro ao acessar o servidor NTP"); 
  }
  else
  {
    Serial.print("Configurado Data/Hora ");
    Serial.println(time(&now));
  }
}

float t = 20.0;
float u = 70.0;
float p = 30.0;

void loop() {
  if (!mqttClient.connected())
  {
    connectMqtt(); 
  }
  
  hora = time(&now);
  if (((hora % 30) == 0) && (hora != ultimaHora))
  {
    ultimaHora = hora;
    sincronizaTempo();
    Serial.println("Enviar dados pelo MQTT");
    
    String pay = "{\"uid\":\"" + String(uid) + "\",\"uxt\":" + time(&now) + ",\"plu\":" + p + ",\"tem\":" + t + ",\"umi\":" + u + "}";
    Serial.println(pay);
    mqttClient.publish("fatec/api/4dsm/codeLand/",pay.c_str());

    t = 20.15 + random(-3, 3);
    u = 70.55 + random(-10, 10);
    p = 30.12 + random(-20, 20);
  }
  
  mqttClient.loop();
}
