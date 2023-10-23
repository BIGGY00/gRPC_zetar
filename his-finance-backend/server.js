const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const PORT = 8000;
const { reimbursement_proto, grpc } = require('./reimbursementPlugin');
const promisify = require('util.promisify');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());

app.post('/api/calculate-total-fee/', async (req, res) => {
  const client = new reimbursement_proto.Reimbursement(
    `${process.env.PLUGIN_HOST}:${process.env.PLUGIN_PORT}`,
    grpc.credentials.createInsecure()
  );

  promisify(client.calculateReimbursement.bind(client)) ({...req.body.params})
  .then((response) => {
    res.json({ 'total': response.totalPrice})
  })
  .catch((error) => {
    res.status(500).json(error)
  })
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});