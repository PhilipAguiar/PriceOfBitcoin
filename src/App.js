import "./App.scss";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { db } from "./utils/firebase";
import { set, ref, onValue } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [price, setPrice] = useState();
  const [cryptoCurrency, setCryptoCurrency] = useState({ name: "Bitcoin", ticker: "BTC" });
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [cryptoCurrencyList, setCryptoCurrencyList] = useState([]);
  const [phoneError, setPhoneError] = useState(false);
  const [priceTargetError, setPriceTargetError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const cryptoRef = useRef();
  const priceTargetRef = useRef();
  const fiatRef = useRef();
  const phoneRef = useRef();
  const belowAboveRef = useRef();

  // Live updates the current price of selected crypto currency in chosen fiat currency
  useEffect(() => {
    axios.get(`https://api.coinbase.com/v2/prices/${cryptoCurrency.ticker}-${fiatCurrency}/buy`).then((res) => {
      setPrice(res.data.data.amount);
    });
  }, [cryptoCurrency, fiatCurrency]);

  useEffect(() => {
    axios.get("https://api.pro.coinbase.com/currencies").then((res) => {
      res.data.forEach((currency) => {
        if (currency.details.type === "crypto") {
          setCryptoCurrencyList((prevList) => {
            return [...prevList, { ticker: currency.id, name: currency.name }];
          });
        }
      });
    });

    // axios.get("https://api.coinbase.com/v2/currencies").then((res) => {
    //   res.data.data.forEach((currency) => {
    //     setFiatCurrencyList((prevList) => [...prevList, currency.ticker]);
    //     // console.log(fiatCurrencyList);
    //   });
    // });
  }, []);

  // For testing accessing database

  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(Object.values(data));
      }
    });
  }, []);

  //Updates active crypto currency on change

  const changeCryptoHandler = (e) => {
    let selectedCryptoTicker = e.target.options[e.target.selectedIndex].value;

    let selectedCrypto = cryptoCurrencyList.find((crypto) => {
      return crypto.ticker === selectedCryptoTicker;
    });

    let selectedCryptoName = selectedCrypto.name;

    setCryptoCurrency({ name: selectedCryptoName, ticker: selectedCryptoTicker });
  };

  // updates fiat currency on change

  const changeFiatHandler = (e) => {
    setFiatCurrency(e.target.options[e.target.selectedIndex].value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Regex for phone validation

    if (!/(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g.test(phoneRef.current.value)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }

    // Check to make sure price target was given

    if (priceTargetRef.current.value === "") {
      setPriceTargetError(true);
    } else {
      setPriceTargetError(false);
    }

    // If no errors submit to database

    if (phoneError === false && priceTargetError === false && priceTargetRef.current.value !== "" && phoneRef.current.value !== "") {
      const id = uuidv4();
      set(ref(db, `/${id}`), {
        id,
        ticker: cryptoCurrency.ticker,
        cryptoName: cryptoCurrency.name,
        watchPrice: priceTargetRef.current.value,
        fiatCurrency,
        phoneNumber: phoneRef.current.value,
        beenAlerted: false,
        belowAbove: belowAboveRef.current.value,
      });

      setSubmitSuccess(true);
    }
  };

  return (
    <>
      <div className="main">
        <div>
          <h1 className="main__title">Price of Crypto</h1>
        </div>
        <p className="main__current-price">
          Current {cryptoCurrency.name} Price: {price} {fiatCurrency}
        </p>

        <form className="main__form" onSubmit={handleSubmit}>
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
              <option value="BTC">Bitcoin</option>
              <option value="ETH">Ethereum</option>
              <option value="ADA">Cardano</option>
              <option value="SOL">Solana</option>
            </select>
          </div>

          <div className="main__box">
            <label className="main__label">Notify Me when price is: </label>
            <select ref={belowAboveRef}>
              <option value="below">Below</option>
              <option value="above">Above</option>
            </select>
            <input type="number" defaultValue={price} step="any" ref={priceTargetRef} />
          </div>

          {priceTargetError && (
            <div className="main__box">
              <p>Please enter a valid price target!</p>
            </div>
          )}

          <div className="main__box">
            <label className="main__label">Fiat Currency Type: </label>
            <select
              onChange={(e) => {
                changeFiatHandler(e);
              }}
              ref={fiatRef}
            >
              <option>USD</option>
              <option>CAD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>AUD</option>
              <option>NZD</option>
              <option>HKD</option>
              <option>CNH</option>
              <option>JPY</option>
            </select>
          </div>

          <div className="main__box">
            <label className="main__label">Phone Number: </label>
            <input ref={phoneRef} />
          </div>

          {phoneError && (
            <div className="main__box">
              <p>Please enter a valid phone number!</p>
            </div>
          )}

          <div className="main__btn-container">
            <button className="main__button" disabled={submitSuccess}>
              Submit
            </button>
          </div>
          {submitSuccess && (
            <div className="main__box">
              <p>{`Success! You will now get a text when ${cryptoCurrency.name} reaches ${belowAboveRef.current.value} ${priceTargetRef.current.value} ${fiatCurrency}`}</p>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
