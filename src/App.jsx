import APIForm from './Components/APIForm';
import Gallery from './Components/Gallery';
import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
  const [count, setCount] = useState(0)
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });
  const defaultValues = {
    format: "jpeg",
    no_ads: "true",
    no_cookie_banners: "true",
    width: "1920",
    height: "1080",
  };
  
  const submitForm = () => {
    if (inputs.url === "" || inputs.url.trim() === "") {
      alert("You forgot to submit an URL!");
      return;
    }

    for (const [key, value] of Object.entries(inputs)) {
      if (value === "") {
        inputs[key] = defaultValues[key];
      }
    }

    makeQuery();
  };
  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;
    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    console.log(query); // Log the query
    return query; // Added return statement
  }    
  const [currentImage, setCurrentImage] = useState(null);
  const callAPI = async (query) => {
    try {
      const response = await fetch(query);
      const json = await response.json();
      if (json.url == null) {
        alert("Oops! Something went wrong with that query, let's try again!");
      } else {
        setCurrentImage(json.url);
        setPrevImages((images) => [...images, json.url]);
        reset();
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching the screenshot.");
    }
  };
  

  useEffect(() => {
    if (inputs.url !== "") {
      const query = makeQuery(); // Assuming makeQuery returns a string
      callAPI(query);
    }
  }, [inputs.url]);
  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
  };
  const [prevImages, setPrevImages] = useState([]);
  return (
    <div className="whole-page">
      <h1>Build Your Own Screenshot! 📸</h1>
      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div> </div>
      )}
      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          <br></br>
        </p>
      </div>
      <div className="container">
        <Gallery images={prevImages} />
      </div>

      <br></br>
      <br></br>
    </div>
  );
}

export default App
