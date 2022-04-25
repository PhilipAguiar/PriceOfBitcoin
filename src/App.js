import "./App.scss";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
// const accountSid = 'ACcb85d0e04d2b6e7a00d1ed4e584c2d81';
// const authToken = '11fc2071c29d17165f18267d9c4dc218';
// const client = require('twilio')(accountSid, authToken);

const BASE_URL = "https://api.twilio.com/2010-04-01";

function App() {
  const [price, setPrice] = useState();
  const [cryptoCurrency, setCryptoCurrency] = useState({ name: "Bitcoin", id: "BTC" });
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [fiatCurrencyList, setFiatCurrencyList] = useState([]);
  const [cryptoCurrencyList, setCryptoCurrencyList] = useState([]);
  const cryptoRef = useRef();
  const priceTargetRef = useRef();
  const fiatRef = useRef();
  const phoneRef = useRef();

  useEffect(() => {
    axios.get(`https://api.coinbase.com/v2/prices/${cryptoCurrency.id}-${fiatCurrency}/buy`).then((res) => {
      setPrice(res.data.data.amount);

      console.log("test");
    });
  }, [cryptoCurrency, fiatCurrency]);

  useEffect(() => {
    axios.get("https://api.pro.coinbase.com/currencies").then((res) => {
      res.data.forEach((currency) => {
        if (currency.details.type === "crypto") {
          setCryptoCurrencyList((prevList) => {
            return [...prevList, { id: currency.id, name: currency.name }];
          });
        }
      });
    });

    axios.get("https://api.coinbase.com/v2/currencies").then((res) => {
      res.data.data.forEach((currency) => {
        setFiatCurrencyList((prevList) => [...prevList, currency.id]);
        // console.log(fiatCurrencyList);
      });
    });
  }, []);

  // setTimeout(() => {
  //   axios.get(`https://api.coinbase.com/v2/prices/${cryptoCurrency}-${fiatCurrency}/buy`).then((res) => {
  //     setPrice(res.data.data.amount);
  //     console.log("test")
  //     // setFiatCurrency(fiatRef.value);
  //   });
  // }, 30000);

  const changeCryptoHandler = (e) => {
    let selectedCrypto = e.target.options[e.target.selectedIndex].value;

    let selectedCryptoTicker = cryptoCurrencyList.find((crypto) => {
      return crypto.name === selectedCrypto;
    });
    console.log("name/id", selectedCrypto, selectedCryptoTicker);
    setCryptoCurrency({ name: selectedCrypto, id: selectedCryptoTicker.id });
  };

  const changeFiatHandler = (e) => {
    setFiatCurrency(e.target.options[e.target.selectedIndex].value);
  };

  // const handleSubmit = (e) => {
  //   client.messages
  //       .create({
  //          body: 'Thanks for signing up ',
  //          messagingServiceSid: 'MG9358bc3ae20b8ebbb053bd3d7597cef8',
  //          to: '+16475092822'
  //        })
  //       .then(message => console.log(message.sid))
  //       .done();
  // }

  return (
    <>
      <div className="main">
        <div>
          <h1 className="main__title">Price of Crypto</h1>
        </div>
        <p className="main__current-price">
          Current {cryptoCurrency.name} Price: {price} {fiatCurrency}
        </p>

        <form className="main__form">
          <div className="main__box">
            <label className="main__label">Crypto Currency: </label>
            <select
              className="main__dropdown"
              onChange={(e) => {
                changeCryptoHandler(e);
              }}
              defaultValue="BTC"
              ref={cryptoRef}
            >
              {/* <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="USDT">USDT</option>
              <option value="BNB">BNB</option>
              <option value="USDC">USDC</option>
              <option value="XRP">XRP</option>
              <option value="SOL">SOL</option>
              <option value="LUNA">LUNA</option>
              <option value="ADA">ADA</option> */}

              {cryptoCurrencyList
                .sort((a, b) => {
                  return a.name.localeCompare(b.name);
                })
                .map((currency) => {
                  return <option>{currency.name}</option>;
                })}
            </select>
          </div>

          <div className="main__box">
            <label className="main__price">Price target: </label>
            <input ref={priceTargetRef} />
          </div>

          <div className="main__box">
            <label>Fiat Currency Type: </label>
            <select
              onChange={(e) => {
                changeFiatHandler(e);
              }}
              ref={fiatRef}
            >
              {fiatCurrencyList.map((currency) => {
                return <option>{currency}</option>;
              })}
            </select>
          </div>

          <div className="main__box">
            <label className="main__phone">Phone Number: </label>
            <input ref={phoneRef} />
          </div>
          <div className="main__btn-container">
            <button
              // onSubmit={handleSubmit}
              className="main__button"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
