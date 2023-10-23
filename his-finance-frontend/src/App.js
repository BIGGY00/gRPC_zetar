import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Result } from 'antd';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const URL_GET_NUMBER = '/api/get-number';
const URL_INCREASE_NUMBER = '/api/increase/';

function App() {
  const [number, setNumber] = useState(null);
  const [increasing, setIncreasing] = useState(false);

  // Function to get the current number from the backend
  const getNumber = async () => {
    try {
      const response = await axios.get(URL_GET_NUMBER);
      setNumber(response.data.number);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to increase the number
  const increaseNumber = async () => {
    setIncreasing(true);
    try {
      await axios.post(URL_INCREASE_NUMBER);
      getNumber(); // Refresh the number after increasing
    } catch (error) {
      console.error(error);
    } finally {
      setIncreasing(false);
    }
  };

  useEffect(() => {
    getNumber(); // Fetch the initial number on component mount
  }, []);

  return (
    <div className="center-screen">
      <Result
        status="info"
        title={`Current Number: ${number ?? 'Loading...'}`}
        extra={
          <Button type="primary" onClick={increaseNumber} loading={increasing}>
            Increase Number
          </Button>
        }
      />
    </div>
  );
}

export default App;
