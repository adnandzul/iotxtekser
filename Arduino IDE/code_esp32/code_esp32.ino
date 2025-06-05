#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

// ===== WIFI & TELEGRAM =====
const char* ssid = "adnan";
const char* password = "12345678";
const char* telegramToken = "7842163848:AAHw3PeJoEQ0TF6b18IxBU7MSpjJGxY08ag";
const char* chatID = "-1002524635037";

// ===== PIN DEFINISI =====
#define TRIG_PIN 5
#define ECHO_PIN 18
#define DHTPIN 4
#define BUZZER_PIN 19
#define RAIN_SENSOR_PIN 34
#define DHTTYPE DHT22

// ===== OBJEK & VARIABEL =====
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

long duration;
int distance;
int rainValue;
float humidity;
float temperature;

String kondisi;
String lastMessageText = "";
unsigned long lastTelegramCheck = 0;
unsigned long lastAlertTime = 0;
bool banjirDetected = false;
unsigned long lastRainAlertTime = 0;  // Track time of last rain alert
int lastUpdateId = 0;
unsigned long lastHttpPostTime = 0;  // Track last HTTP POST time

// ======= SETUP =======
void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RAIN_SENSOR_PIN, INPUT);

  dht.begin();
  lcd.begin();
  lcd.backlight();
  digitalWrite(BUZZER_PIN, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

// ======= LOOP =======
void loop() {
  // ====== BACA SENSOR ======
  rainValue = analogRead(RAIN_SENSOR_PIN);
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2;

  // ======= TAMPIL LCD =======
  lcd.clear();
  lcd.setCursor(0, 0);

  if (rainValue > 3000) kondisi = "Cerah";
  else if (rainValue > 1500) kondisi = "Gerimis";
  else kondisi = "Hujan Deras";

  lcd.print(temperature);
  lcd.print(" C, ");
  lcd.print(humidity);
  lcd.print(" %");

  lcd.setCursor(0, 1);
  lcd.print("Jarak: ");
  lcd.print(distance);
  lcd.print("cm");

  // ======= LOGIKA BANJIR =======
  if (distance < 10) {
    digitalWrite(BUZZER_PIN, HIGH);

    if (!banjirDetected || millis() - lastAlertTime >= 3000) {
      sendTelegramMessage("🚨 Banjir terdeteksi!\nJarak air ke permukaan " + String(distance) + " cm.", chatID);
      lastAlertTime = millis();
      banjirDetected = true;
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    banjirDetected = false;
  }

  // ======= LOGIKA HUJAN DERAS =======
  if (rainValue < 1500 && !banjirDetected && millis() - lastRainAlertTime >= 30000) {
    sendTelegramMessage("⚠ Peringatan: Hujan deras terdeteksi!", chatID);
    lastRainAlertTime = millis();
  }

  // ======= CEK PESAN TELEGRAM =======
  if (millis() - lastTelegramCheck > 10000) {
    checkTelegramCommand();
    lastTelegramCheck = millis();
  }

  // ======= HTTP POST =======
  if (millis() - lastHttpPostTime >= 10000) {  // Kirim data setiap 10 detik
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      String serverURL = "http://8.222.224.3:2002/weather";  // Ganti dengan IP dan port server Node.js
      String payload = "temperature=" + String(temperature) + "&humidity=" + String(humidity) +
                       "&distance=" + String(distance) + "&rainValue=" + String(rainValue) +
                       "&kondisi=" + kondisi;

      http.begin(serverURL);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      int httpCode = http.POST(payload);
      String response = http.getString();

      Serial.println("HTTP Code: " + String(httpCode));
      Serial.println("Response: " + response);
      http.end();

      lastHttpPostTime = millis();  // Update last HTTP POST time
    } else {
      Serial.println("WiFi tidak terkoneksi!");
    }
  }

  delay(500);  // Delay ringan untuk memberikan waktu bagi sensor dan LCD
}

// ======= FUNGSI ENCODE =======
String urlencode(String str) {
  String encoded = "";
  char c;
  char code0;
  char code1;
  for (int i = 0; i < str.length(); i++) {
    c = str.charAt(i);
    if (isalnum(c)) {
      encoded += c;
    } else {
      encoded += '%';
      code0 = (c >> 4) & 0xF;
      code1 = c & 0xF;
      encoded += char(code0 < 10 ? code0 + '0' : code0 - 10 + 'A');
      encoded += char(code1 < 10 ? code1 + '0' : code1 - 10 + 'A');
    }
  }
  return encoded;
}

// ======= FUNGSI KIRIM TELEGRAM =======
void sendTelegramMessage(String message, String chatId) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Encode message untuk URL
    String encodedMessage = urlencode(message);

    String url = "https://api.telegram.org/bot" + String(telegramToken) +
                 "/sendMessage?chat_id=" + chatId + 
                 "&text=" + encodedMessage;

    Serial.println("URL: " + url);
    http.begin(url);
    int httpCode = http.GET();
    String response = http.getString();

    Serial.println("HTTP Code: " + String(httpCode));
    Serial.println("Telegram Response: " + response);

    if (httpCode == HTTP_CODE_OK) {
      Serial.println("Pesan berhasil dikirim ke Telegram!");
    } else {
      Serial.println("Gagal kirim pesan!");
    }

    http.end();
  } else {
    Serial.println("WiFi tidak terkoneksi!");
  }
}

// ======= FUNGSI CEK PERINTAH =======
void checkTelegramCommand() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "https://api.telegram.org/bot" + String(telegramToken) + "/getUpdates?offset=" + String(lastUpdateId + 1);
    http.begin(url);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println("Payload: " + payload); // Debug output

      // Ambil update_id untuk next offset
      int updateIdPos = payload.lastIndexOf("\"update_id\":");
      if (updateIdPos != -1) {
        int idStart = updateIdPos + 12;
        int idEnd = payload.indexOf(",", idStart);
        if (idEnd != -1) {
          lastUpdateId = payload.substring(idStart, idEnd).toInt();
        }
      }

      // Ambil isi pesan
      int textPos = payload.lastIndexOf("\"text\":\"");
      if (textPos != -1) {
        int start = textPos + 8;
        int end = payload.indexOf("\"", start);
        String messageText = payload.substring(start, end);

        // Ambil chat_id dari pesan
        int chatIdPos = payload.lastIndexOf("\"chat\":{\"id\":");
        String chatId = "";
        if (chatIdPos != -1) {
          int chatIdStart = chatIdPos + 13;
          int chatIdEnd = payload.indexOf(",", chatIdStart);
          if (chatIdEnd != -1) {
            chatId = payload.substring(chatIdStart, chatIdEnd);
          }
        }

        if (messageText.equalsIgnoreCase("/tampilkan")) {
          String response = "📡 Status saat ini:\n";
          response += "☁ Cuaca: " + kondisi + "\n";
          response += "📏 Jarak ke air: " + String(distance) + " cm\n";
          response += "🌡 Suhu: " + String(temperature) + " C\n";
          response += "💧 Kelembaban: " + String(humidity) + " %\n";  // Menambahkan kelembaban
          sendTelegramMessage(response, chatId);
        }
      }
    } else {
      Serial.println("Gagal ambil perintah Telegram.");
    }
    http.end();
  }
}