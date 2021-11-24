import { useEffect, useRef, useState } from "react";
import "./App.css";
import Count from "./count.js";
import Load from "./load";
import axios from "axios";
function App() {
  const [counter, setCounter] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const maxVal= process.env.REACT_APP_MAX_VALUE
    ? process.env.REACT_APP_MAX_VALUE
    : 1000;

  const setCounterValue = (value) => {
    setCounter(value);
    setLoading(true);

    axios
      .put(
        "https://interview-8e4c5-default-rtdb.firebaseio.com/front-end.json",
        {
          7318019088: +value,
        }
      )
      .then(function (response) {
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  const onInputChange = (event) => {
    const target = event.nativeEvent.target;
    const value = target.value;

    if (isNaN(value) || +value > maxVal) return;

    event.nativeEvent.target.setAttribute(
      "size",
      value.length !== 0 ? value.length : 1
    );

    if (value === "") setCounterValue(0);
    else setCounterValue(value);
  };

  const onDecrement = () => {
    const currentCounter = +counter;

    if (currentCounter - 1 > maxVal) return;
    if (inputRef.current)
      inputRef.current.setAttribute(
        "size",
        (currentCounter - 1).toString().length
      );
    setCounterValue((currentCounter - 1).toString());
  };

  const onIncrement = () => {
    const currentCounter = +counter;

    if (currentCounter + 1 > maxVal) return;
    if (inputRef.current)
      inputRef.current.setAttribute(
        "size",
        (currentCounter + 1).toString().length
      );
    setCounterValue((currentCounter + 1).toString());
  };

  useEffect(() => {
    async function counteri(){
      try{
        const co = await fetch("https://interview-8e4c5-default-rtdb.firebaseio.com/front-end/7318019088.json")
        const data = co.data;
        if (data && data < maxVal) setCounter(data);
        else setCounter(1);
      } catch (error) {
        console.log(error)
      }
    };
    counteri();
  }, [maxVal]);

  return (
    <div className="screenContainer">
      <div className="container">
        {loading && (
          <div className="loaderContainer">
            <Load />
            <span className="loaderText">Saving counter value</span>
          </div>
        )}
        <div className="counterContainer">
          <div className="minus" onClick={onDecrement}>
            -
          </div>
          <div className="count">
            <input
              className="counterInput"
              ref={inputRef}
              value={counter}
              onChange={onInputChange}
              size={counter.toString().length}
            />
          </div>
          <div className="plus" onClick={onIncrement}>
            +
          </div>
        </div>
        <Count value={counter} />
      </div>
    </div>
  );
}

export default App;