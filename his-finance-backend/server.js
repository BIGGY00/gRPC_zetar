const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;
const redis = require('redis');
const { numbermanipulation_proto, grpc } = require('./numbermanipulationPlugin');
const promisify = require('util.promisify');

// Update the Redis client configuration to use the "redis" hostname
const redisClient = redis.createClient({ host: 'redis' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());

// Get the initial number from Redis or set it to 0 if it doesn't exist
redisClient.get('number', (err, reply) => {
  if (err || reply === null) {
    redisClient.set('number', 0);
  }
});

app.get('/api/get-number', (req, res) => {
  redisClient.get('number', (err, reply) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving the number from Redis' });
    } else {
      res.json({ number: parseInt(reply) });
    }
  });
});

app.post('/api/increase/', async (req, res) => {
  // Get the current number from Redis
  redisClient.get('number', (err, reply) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving the number from Redis' });
      return;
    }

    const currentNumber = parseInt(reply);

    // Send the current number to the plugin for increasing by 2
    const client = new numbermanipulation_proto.NumberManipulation(
      `${process.env.PLUGIN_HOST}:${process.env.PLUGIN_PORT}`,
      grpc.credentials.createInsecure()
    );

    const request = { number: currentNumber };

    promisify(client.increaseNumberByTwo.bind(client))(request)
      .then((response) => {
        const newNumber = response.result;
        // Update the number in Redis
        redisClient.set('number', newNumber.toString());
        res.json({ 'total': newNumber });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
