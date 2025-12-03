/**
 * Test MQTT Publisher - Simulates device sending sensor data
 * Run this to test if the backend can receive MQTT messages
 * 
 * Usage: node test-mqtt-publisher.js
 */

import mqtt from 'mqtt';
import { mqttConfig } from './config.js';

const client = mqtt.connect(mqttConfig.brokerUrl, {
  clientId: 'test-device-publisher',
  clean: true
});

client.on('connect', () => {
  console.log('Test publisher connected to MQTT broker');
  console.log(`Publishing test data to: ${mqttConfig.topics.data}`);
  
  // Send test data every 3 seconds
  const interval = setInterval(() => {
    const testData = {
      temp: Math.round(20 + Math.random() * 10),      // 20-30°C
      hum: Math.round(50 + Math.random() * 30),        // 50-80%
      soil: Math.round(30 + Math.random() * 40),      // 30-70%
      level: Math.round(40 + Math.random() * 40),    // 40-80%
      flow: Math.round(Math.random() * 100)           // 0-100 L/min
    };
    
    const message = JSON.stringify(testData);
    client.publish(mqttConfig.topics.data, message, (err) => {
      if (err) {
        console.error('Failed to publish:', err);
      } else {
        console.log('Published:', testData);
      }
    });
  }, 3000);
  
  // Stop after 30 seconds (10 messages)
  setTimeout(() => {
    clearInterval(interval);
    client.end();
    console.log('Test completed. Exiting...');
    process.exit(0);
  }, 30000);
});

client.on('error', (error) => {
  console.error('MQTT error:', error);
  process.exit(1);
});

