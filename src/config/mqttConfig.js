const mqtt = require('mqtt');
const Device = require('../models/Device');
const SensorData = require('../models/SensorData');
const mongoose = require('mongoose');

// Mosquitto public broker details
const MQTT_BROKER_URL = 'mqtt://test.mosquitto.org';
const TOPIC_PATTERN = '/move/device/+/+';

function setupMQTTConnection() {
    // Create MQTT client
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
        //console.log('Connected to MQTT Broker');
        // Subscribe to the topic pattern
        client.subscribe(TOPIC_PATTERN, (err) => {
            if (err) {
                //console.error('MQTT Subscription error:', err);
            } else {
                //console.log(`Subscribed to topic: ${TOPIC_PATTERN}`);
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
                //console.log(`Skipping null value for device ${deviceId}, sensor ${sensorName}`);
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
                sensorData = new SensorData({
                    device: device._id,
                    sensorName: sensorName,
                    data: []
                });
            }

            // Add new data point
            sensorData.data.push({
                time: new Date(),
                value: sensorValue
            });

            // Limit data points to last 100 entries
            if (sensorData.data.length > 100) {
                sensorData.data = sensorData.data.slice(-100);
            }

            // Save sensor data
            await sensorData.save();

            //console.log(`Processed data for device ${deviceId}, sensor ${sensorName}: ${sensorValue}`);
        } catch (error) {
            //console.error('Error processing MQTT message:', error);
        }
    });

    client.on('error', (err) => {
        //console.error('MQTT Connection error:', err);
    });

    return client;
}

module.exports = setupMQTTConnection;