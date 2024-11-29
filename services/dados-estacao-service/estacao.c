#include <WiFi.h>
#include <PubSubClient.h>
#include "time.h"
#include <esp_mac.h>
#include "DHT.h"

// Definindo pinos e tipos para o sensor DHT
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

char uid[13];

// Configurações de rede Wi-Fi e MQTT
char *ssid = "";
char *pwd = "";
char *mqttServer = "test.mosquitto.org";

// Configurações de NTP (servidor de hora)
char *ntpServer = "br.pool.ntp.org";
long gmtOffset = -3;
int daylight = 0;
time_t now;
struct tm timeinfo;

uint32_t hora = 3;
uint32_t ultimaHora = 1;

// Objetos para conexão Wi-Fi e MQTT
WiFiClient wclient;
PubSubClient mqttClient(wclient);

// Função para conectar ao Wi-Fi
void connectWiFi() {
  Serial.print("Conectando ");
  WiFi.begin(ssid, pwd);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Conectado com sucesso, IP: ");
  Serial.println(WiFi.localIP());
}

// Função para conectar ao MQTT
void connectMqtt() {
  if (!mqttClient.connected()) {
    if (mqttClient.connect(uid)) {
      Serial.println("Conectado ao servidor MQTT");
    } else {
      Serial.println("Falha ao conectar no MQTT");
      delay(500);
    }
  }
}

// Função para sincronizar o tempo com o servidor NTP
void sincronizaTempo() {
  configTime(gmtOffset, daylight, ntpServer);
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Erro ao acessar o servidor NTP");
  } else {
    Serial.print("Hora configurada: ");
    Serial.println(time(&now));
  }
}

void setup() {
  Serial.begin(115200);

  // Obter endereço MAC e criar UID
  uint8_t mac[6];
  esp_read_mac(mac, ESP_MAC_WIFI_STA);
  snprintf(uid, sizeof(uid), "%02X%02X%02X%02X%02X%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);

  Serial.print("Datalogger UID: ");
  Serial.println(uid);

  // Conectar ao Wi-Fi e configurar NTP
  connectWiFi();
  sincronizaTempo();

  // Configurar MQTT
  mqttClient.setServer(mqttServer, 1883);

  // Inicializar sensor DHT
  dht.begin();
}

void loop() {
  // Verificar conexão MQTT
  if (!mqttClient.connected()) {
    connectMqtt();
  }

  // Atualizar hora
  hora = time(&now);

  // Enviar dados a cada 30 segundos
  if (((hora % 30) == 0) && (hora != ultimaHora)) {
    ultimaHora = hora;
    sincronizaTempo();

    // Ler dados reais do sensor DHT
    float u = dht.readHumidity();
    float t = dht.readTemperature();
    
    // Checar se as leituras falharam
    if (isnan(u) || isnan(t)) {
      Serial.println("Falha na leitura do sensor DHT");
      return;
    }

    // Montar o payload JSON
    String pay = "{\"uid\":\"" + String(uid) + "\",\"uxt\":" + String(now) + ",\"tem\":" + String(t) + ",\"umi\":" + String(u) + "}";
    
    Serial.println("Enviando dados pelo MQTT:");
    Serial.println(pay);
    
    // Publicar os dados no tópico MQTT
    mqttClient.publish("fatec/api/4dsm/codeLand/", pay.c_str());
  }

  mqttClient.loop();
}
