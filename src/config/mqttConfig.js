const mqtt = require('mqtt');
const Device = require('../models/Device');
const SensorData = require('../models/SensorData');
const Notification = require("../models/Notification"); 

const MQTT_BROKER_URL = 'mqtt://test.mosquitto.org';
const TOPIC_PATTERN = '/move/device/+/+';

const DEFAULT_THRESHOLDS = {
    temperature: { lower: 10, upper: 34 },
    humidity: { lower: 5, upper: 60 },
    light: { lower: 0, upper: 2999 },
    sound: { lower: 0, upper: 70 },
    co2: { lower: 0, upper: 2100 }
};

const SENSOR_TRANSLATIONS = {
    light: "luz",
    sound: "sonido",
    temperature: "temperatura",
    humidity: "humedad",
    co2: "dióxido de carbono"
};

function setupMQTTConnection() {
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
        console.log('Connected to MQTT Broker');
        client.subscribe(TOPIC_PATTERN, (err) => {
            if (err) {
                console.error('MQTT Subscription error:', err);
            } else {
                console.log(`Subscribed to topic: ${TOPIC_PATTERN}`);
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const topicParts = topic.split('/');
            const deviceId = topicParts[3];
            const sensorName = topicParts[4];

            let sensorValue = null;
            const messageStr = message.toString().trim();
            if (messageStr !== 'null') {
                const parsedValue = Number(messageStr);
                if (!isNaN(parsedValue)) {
                    sensorValue = parsedValue;
                }
            }

            if (sensorValue === null) {
                // console.log(`Skipping null value for device ${deviceId}, sensor ${sensorName}`);
                return;
            }

            // Verificar si el dispositivo existe (no crearlo aquí)
            const device = await Device.findOne({ id: deviceId });
            if (!device) {
                // console.log(`Dispositivo ${deviceId} no registrado. Datos ignorados.`);
                return;
            }

            // Buscar o crear datos del sensor
            let sensorData = await SensorData.findOne({
                device: device._id,
                sensorName: sensorName
            });

            if (!sensorData) {
                const thresholds = DEFAULT_THRESHOLDS[sensorName] || { lower: 0, upper: 100 };
                sensorData = new SensorData({
                    device: device._id,
                    sensorName: sensorName,
                    thresholds: { lower: thresholds.lower, upper: thresholds.upper },
                    data: []
                });
            } else if (!sensorData.thresholds) {
                sensorData.thresholds = DEFAULT_THRESHOLDS[sensorName] || { lower: 0, upper: 100 };
            }

            // Agregar nuevo dato
            sensorData.data.push({
                time: new Date(),
                value: sensorValue
            });

            await sensorData.save();

            // Verificar umbrales
            const { lower, upper } = sensorData.thresholds || {};
            const exceedsUpper = upper !== undefined && sensorValue > upper;
            const belowLower = lower !== undefined && sensorValue < lower;
            const thresholdBreached = exceedsUpper || belowLower;

            if (thresholdBreached) {
                const translatedSensorName = SENSOR_TRANSLATIONS[sensorName] || sensorName;
                // console.log(`Notificación para el sensor ${translatedSensorName} con valor ${sensorValue}`);

                const newNotification = new Notification({
                    name: `Alerta de ${translatedSensorName}`,
                    date: new Date().toISOString(),
                    sensor: translatedSensorName,
                    device: device._id,
                    value: sensorValue.toString(),
                    building: device.building || "Desconocido",
                    space: device.space || "Desconocido",
                    status: true
                });

                const savedNotification = await newNotification.save();

                // Enviar notificación por MQTT
                const alertClient = mqtt.connect(MQTT_BROKER_URL);
                alertClient.on('connect', () => {
                    const alertTopic = `/move/alerts/${deviceId}`;
                    alertClient.publish(alertTopic, savedNotification._id.toString(), () => {
                        alertClient.end();
                    });
                    // console.log(`Notificación enviada al ESP32: ${savedNotification._id}`);
                });
            }

            // console.log(`Datos procesados para dispositivo ${deviceId}, sensor ${sensorName}: ${sensorValue}`);
        } catch (error) {
            console.error('Error procesando mensaje MQTT:', error);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT Connection error:', err);
    });

    client.on('close', () => {
        console.log('MQTT connection closed');
    });

    return client;
}

module.exports = setupMQTTConnection;