import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedOption, setSelectedOption] = useState(null); // 'text' or 'image'
  const [textValue, setTextValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setTextValue('');
    setImageFile(null);
    setResult('');
    setError(null);
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    setResult('');
    setError(null);
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    setResult('');
    setError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const url = 'http://localhost:5000/predict';
    let fetchOptions = {
      method: 'POST',
    };

    if (selectedOption === 'text') {
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify({ text: textValue });
    } else {
      const formData = new FormData();
      formData.append('file', imageFile);
      fetchOptions.body = formData;
    }

    fetch(url, fetchOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.prediction) {
          setResult(data.prediction);
          setError(null);
        } else if (data.error) {
          setError(data.error);
          setResult('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Failed to get prediction. Please try again.');
        setResult('');
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sap Categorization</h1>
        {!selectedOption ? (
          <div className="options">
            <button
              className="option-button text-button"
              onClick={() => handleOptionChange('text')}
            >
              Text
            </button>
            <button
              className="option-button image-button"
              onClick={() => handleOptionChange('image')}
            >
              <span className="icon"></span> Image
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {selectedOption === 'text' ? (
              <>
                <textarea
                  placeholder="Enter your expense"
                  value={textValue}
                  onChange={handleTextChange}
                  className="text-area"
                /><br /><br />
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                /><br /><br />
              </>
            )}
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        )}
        {result && (
          <div className="result">
            <h2>Result:</h2>
            <p>{result}</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </header>
    </div>
  );
}

export default App;
