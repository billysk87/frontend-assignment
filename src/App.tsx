import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useQuery } from 'react-query';
import MyMap from './components/MyMap';
import 'leaflet/dist/leaflet.css'

function App() {
  const { isLoading, error, data } = useQuery('pointsData', () =>
    axios.get('https://services.marinetraffic.com/api/exportvesseltrack/' + process.env.REACT_APP_REQUEST_API_KEY + '/v:3/period:daily/days:20/mmsi:241486000/protocol:json')
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log('Error: ' +  error);
      })
  )

  return (
    <div className="App">
      {data &&          
        <MyMap/>
      }
    </div>
  );
}

export default App;
