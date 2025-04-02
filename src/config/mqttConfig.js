const mqtt = require('mqtt');
const Device = require('../models/Device');
const SensorData = require('../models/SensorData');
const mongoose = require('mongoose');

// Mosquitto public broker details
const MQTT_BROKER_URL = 'mqtt://test.mosquitto.org';
const TOPIC_PATTERN = '/move/device/+/+';

// Default thresholds for different sensor types
const DEFAULT_THRESHOLDS = {
    temperature: { lower: 10, upper: 34 },
    humidity: { lower: 5, upper: 60 },
    light: { lower: 0, upper: 2999},
    sound: { lower: 0, upper: 70 },
    co2: { lower: 0, upper: 2100 }
};

function setupMQTTConnection() {
    // Create MQTT client
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
        console.log('Connected to MQTT Broker');
        // Subscribe to the topic pattern
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
            // Parse the topic to extract device ID and sensor name
            const topicParts = topic.split('/');
            const deviceId = topicParts[3];
            const sensorName = topicParts[4];
            
            // Handle null or non-numeric values
            let sensorValue = null;
            const messageStr = message.toString().trim();
            
            // Try to convert to number, handle 'null' string
            if (messageStr !== 'null') {
                const parsedValue = Number(messageStr);
                if (!isNaN(parsedValue)) {
                    sensorValue = parsedValue;
                }
            }

            // If no valid value, skip processing
            if (sensorValue === null) {
                console.log(`Skipping null value for device ${deviceId}, sensor ${sensorName}`);
                return;
            }

            // Find or create the device
            let device = await Device.findOne({ id: deviceId });
            if (!device) {
                device = new Device({
                    id: deviceId,
                    name: `Device ${deviceId}`
                });
                await device.save();
            }

            // Find or create sensor data record
            let sensorData = await SensorData.findOne({ 
                device: device._id, 
                sensorName: sensorName 
            });

            if (!sensorData) {
                // Get default thresholds based on sensor type
                const thresholds = DEFAULT_THRESHOLDS[sensorName] || DEFAULT_THRESHOLDS.default;
                
                sensorData = new SensorData({
                    device: device._id,
                    sensorName: sensorName,
                    thresholds: { lower: thresholds.lower, upper: thresholds.upper },
                    data: []
                });
            } else if (!sensorData.thresholds) {
                // Ensure thresholds are always set
                sensorData.thresholds = DEFAULT_THRESHOLDS[sensorName] || DEFAULT_THRESHOLDS.default;
            }

            // Add new data point
            sensorData.data.push({
                time: new Date(),
                value: sensorValue
            });

            // Save sensor data without limiting entries
            await sensorData.save();

            console.log(`Processed data for device ${deviceId}, sensor ${sensorName}: ${sensorValue}`);
        } catch (error) {
            console.error('Error processing MQTT message:', error);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT Connection error:', err);
    });

    return client;
}

module.exports = setupMQTTConnection;