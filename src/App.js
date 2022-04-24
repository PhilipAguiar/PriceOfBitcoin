import "./App.scss";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
function App() {
  const [price, setPrice] = useState();
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC");
  const [fiatCurrency, setFiatCurrency] = useState("USD");

  const cryptoRef = useRef();
  const priceTargetRef = useRef();
  const fiatRef = useRef();
  const phoneRef = useRef();

  useEffect(()=>{
    axios.get(`https://api.coinbase.com/v2/prices/${cryptoCurrency}-${fiatCurrency}/buy`).then((res) => {
      setPrice(res.data.data.amount);
      // setFiatCurrency(fiatRef.value);
      console.log("test")
    });
  })

  setTimeout(() => {
    axios.get(`https://api.coinbase.com/v2/prices/${cryptoCurrency}-${fiatCurrency}/buy`).then((res) => {
      setPrice(res.data.data.amount);
      console.log("test")
      // setFiatCurrency(fiatRef.value);
    });
  }, 30000);

  const changeCryptoHandler = (e) =>{
    setCryptoCurrency(e.target.options[e.target.selectedIndex].value)
  }

  const changeFiatHandler = (e) =>{
    setFiatCurrency(e.target.options[e.target.selectedIndex].value)
  }

  
  

  return (
    <>
      <div className="main">
        <div>
          <h1 className="main__title">Price of Crypto</h1>
        </div>
        <p className="main__current-price">
          Current {cryptoCurrency} Price: {price} {fiatCurrency}
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
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>

          <div className="main__box">
            <label className="main__price">Price target: </label>
            <input ref={priceTargetRef} />
          </div>

          <div className="main__box">
            <label>Fiat Currency Type: </label>
            <select  onChange={(e) => {
                changeFiatHandler(e);
              }} ref={fiatRef}>
              <option>USD</option>
              <option>CAD</option>
            </select>
          </div>

          <div className="main__box">
            <label>Phone Number: </label>
            <input ref={phoneRef} />
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
