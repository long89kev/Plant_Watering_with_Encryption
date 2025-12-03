/**
 * Test MQTT Subscriber - Listens for commands sent to device
 * Run this to verify that commands are being published correctly
 * 
 * Usage: node test-mqtt-subscriber.js
 */

import mqtt from 'mqtt';
import { mqttConfig } from './config.js';

console.log('Test MQTT Command Subscriber');
console.log('='.repeat(50));
console.log(`Connecting to: ${mqttConfig.brokerUrl}`);
console.log(`Listening on topic: ${mqttConfig.topics.command}`);
console.log('Waiting for commands...\n');

const client = mqtt.connect(mqttConfig.brokerUrl, {
  clientId: 'test-command-subscriber',
  clean: true
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  console.log(`Subscribing to: ${mqttConfig.topics.command}\n`);
  
  client.subscribe(mqttConfig.topics.command, (err) => {
    if (err) {
      console.error('Failed to subscribe:', err.message);
      process.exit(1);
    } else {
      console.log('Successfully subscribed. Waiting for commands...\n');
      console.log('You can now test the API endpoints to see commands here.\n');
    }
  });
});

client.on('message', (topic, message) => {
  if (topic === mqttConfig.topics.command) {
    try {
      const command = JSON.parse(message.toString());
      const timestamp = new Date(command.timestamp).toLocaleTimeString();
      
      console.log('─'.repeat(50));
      console.log(`[${timestamp}] Command Received:`);
      console.log(JSON.stringify(command, null, 2));
      console.log('─'.repeat(50));
      console.log('');
    } catch (error) {
      console.error('Failed to parse command message:', error.message);
      console.error('Raw message:', message.toString());
    }
  }
});

client.on('error', (error) => {
  console.error('MQTT error:', error);
  process.exit(1);
});

// Keep the script running
process.on('SIGINT', () => {
  console.log('\n\nShutting down...');
  client.end();
  process.exit(0);
});

