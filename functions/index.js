const functions = require("firebase-functions");
const admin = require("firebase-admin");

require("dotenv").config();

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const database = admin.database();
const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.options("*", cors());

// Function that checks if the price target you set has been reached and sends you a text if so

const checkPrice = async (user) => {
  return await axios.get(`https://api.coinbase.com/v2/prices/${user.ticker}-${user.fiatCurrency}/buy`).then((res) => {
    const currentCryptoPrice = res.data.data.amount;
    if (user.belowAbove === "below") {
      if (parseFloat(currentCryptoPrice) < parseFloat(user.watchPrice)) {
        console.log(`The current price is now ${currentCryptoPrice}! which is below your watch price of: ${user.watchPrice} ${user.fiatCurrency}!`);

        client.messages
          .create({
            body: `The current price is now ${currentCryptoPrice}! which is below your watch price of: ${user.watchPrice} ${user.fiatCurrency}!`,
            messagingServiceSid: process.env.REACT_APP_TWILIO_MESSAGING_SID,
            to: user.phoneNumber,
          })
          .then((message) => console.log(message.sid))
          .done();

        return true;
      } else {
        return false;
      }
    }
    if (user.belowAbove === "above") {
      if (parseFloat(currentCryptoPrice) > parseFloat(user.watchPrice)) {
        console.log(`The current price is now ${currentCryptoPrice}! which is above your watch price of: ${user.watchPrice} ${user.fiatCurrency}!`);

        client.messages
          .create({
            body: `The current price is now ${currentCryptoPrice}! which is above your watch price of: ${user.watchPrice} ${user.fiatCurrency}!`,
            messagingServiceSid: process.env.REACT_APP_TWILIO_MESSAGING_SID,
            to: user.phoneNumber,
          })
          .then((message) => console.log(message.sid))
          .done();

        return true;
      } else {
        return false;
      }
    }
    return false;
  });
};

// Cloud function that runs every minute to see if your price target has been hit. Only alerts once

exports.scheduledFunction = functions.pubsub.schedule("every 1 minutes").onRun((context) => {
  const usersRef = database.ref();

  usersRef.once("value", (snapshot) => {
    const data = snapshot.val();

    if (data !== null) {
      Object.values(data).forEach((user) => {
        if (!user.beenAlerted) {
          checkPrice(user).then((res) => {
            if (res) {
              database.ref(`/${user.id}`).set({
                id: user.id,
                ticker: user.ticker,
                cryptoName: user.cryptoName,
                watchPrice: user.watchPrice,
                fiatCurrency: user.fiatCurrency,
                phoneNumber: user.phoneNumber,
                beenAlerted: true,
                belowAbove: user.belowAbove,
              });
            }
          });
        }
      });
    }
  });
  return null;
});
