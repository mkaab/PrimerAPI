// This example is built using express
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const fetch = require("node-fetch");
const https = require('https');
const fs = require('fs');

require("dotenv").config();

const PORT = process.env.PORT || 443;
const API_KEY = process.env.API_KEY;
const PRIMER_API_URL = process.env.PRIMER_API_URL;

const app = express();

const staticDir = path.join(__dirname, "static");
const checkoutPage = path.join(__dirname, "static", "checkout.html");

app.use(bodyParser.json());
app.use("/static", express.static(staticDir));

app.get("/", (req, res) => {
  return res.sendFile(checkoutPage);
});

app.post("/client-token", async (req, res) => {
  const url = `${PRIMER_API_URL}/auth/client-token`;

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
    },
  });

  const json = await response.json();

  return res.send(json);
});

app.post("/authorize", async (req, res) => {
  const { token } = req.body;
  const url = `${PRIMER_API_URL}/payments`;

  const orderId = "order-123." + Math.random();
  console.log('[TEST] body: ', req.body)
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
      "Idempotency-Key": orderId, // Optionally add an idempotency key
    },
    body: JSON.stringify({
      amount: 700,
      currencyCode: "EUR",
      orderId: orderId,
      paymentInstrument: {
        token: "tok_auth_authorized_card",
      },
    }),
  });

  const json = await response.json();
  console.log('[TEST] authorize res:', json);

  return res.send(json);
});

// console.log(`Checkout server listening on port ${PORT}.\n\nYou can now view the Checkout in a web browser at http://localhost:${PORT}`);
// app.listen(PORT);

// const options = {
//   key: fs.readFileSync('./ssl/localhost-key.pem'),
//   cert: fs.readFileSync('./ssl/localhost.pem')
// };

// const httpsServer = https.createServer(options, app);
app.listen(PORT, () => {
  console.log(`Checkout server listening on port ${PORT}.\n\nYou can now view the Checkout in a web browser at https://localhost:${PORT}`);  
})
