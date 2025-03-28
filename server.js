const { server, io, mqttClient } = require('./src/app');
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Optional: Handle graceful shutdown
process.on('SIGINT', () => {
    mqttClient.end();
    server.close(() => {
        console.log('Server and MQTT connection closed');
        process.exit(0);
    });
});