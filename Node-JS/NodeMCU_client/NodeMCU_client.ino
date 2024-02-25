# include <ESP8266WiFi.h>
# include <WebSocketsClient.h>

WebSocketsClient wsc;

const char *ssid ="" ;
const char *pass = "";

# define SERVER  "192.168.1.5"
# define PORT    2024
# define URL     "/"

void websocketEvent(WStype_t type, uint8_t *data, size_t length){
  switch(type){
    case(WStype_CONNECTED):
      Serial.printf("connected to server\n");
      wsc.sendTXT(" Hello Servesr , I'm NodeM");
      break;
    case WStype_DISCONNECTED:
      Serial.printf("Disconnected!\n");
      break;
    case(WStype_TEXT):
      // if data == "on"
      if(!strcmp((char*)data,"on")){
        // Note that LED_BUILTIN is active LOW
        digitalWrite(LED_BUILTIN, LOW);
      }else if(!strcmp((char*)data,"off")){
        digitalWrite(LED_BUILTIN, HIGH);
      }
      Serial.printf("data: %s\n",data);
      break;
  }
}

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);

  WiFi.begin(ssid, pass);

  while(WiFi.status() != WL_CONNECTED){
    Serial.println(".");
    delay(500);
  }

  Serial.println(WiFi.SSID());
  Serial.println(WiFi.localIP());

  wsc.begin(SERVER, PORT, URL);
  wsc.onEvent(websocketEvent);
  // try ever 1000 again if connection has failed
  wsc.setReconnectInterval(1000);
}

void loop(){
  wsc.loop();
}

