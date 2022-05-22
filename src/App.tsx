import { useEffect, useState } from 'react';
import './App.scss';

import { handleGeolocation } from './data/Geolocation';
import { getLocation } from './data/Location';
import { retrieveOneDay, OneDayModel } from './data/OneDay';

enum Status {
  NOT_SET,
  SET,
  ERROR
}

const STATUS_MSG = {
  [Status.NOT_SET]: 'Location is not set.',
  [Status.SET]: 'Location is set.',
  [Status.ERROR]: 'There is a Location error.'
}

function buildTodaysDate() {
  const now = new Date();
  const Year = now.getFullYear();
  const Month = now.getMonth();
  const date = now.getDate();
  return `${Year}-${Month}-${date}` as unknown as Date;
}

function App() {
  const [oneDay, updateOneDay] = useState<OneDayModel>();
  const [coords, setCoords] = useState<Array<number>>([]);
  const [status, setStatus] = useState(Status.NOT_SET);
  const [location, setLocation] = useState<string>();
  
  useEffect(() => {
    async function loadLocation() {
      const [longitude, latitude] = coords;
      await getLocation(longitude, latitude, (locationResult) => setLocation(locationResult));
    }
    if (coords.length > 0) {
      loadLocation();
    }
  }, [coords]);

  const loadOneDayData = async (longitude: number, latitude: number) => {
    const todaysDate = buildTodaysDate();
    try {
      const oneDayData = await retrieveOneDay(todaysDate , [longitude, latitude]);
      updateOneDay(oneDayData);
    } catch (error) {
      console.error(error);
      setStatus(Status.ERROR);
    }

  }

  const getGeolocation = async () =>{
    try {
      const response = await handleGeolocation();
      const position = response.position;
      const latitude = position?.coords.latitude ?? 0;
      const longitude = position?.coords.longitude ?? 0;

      setCoords([longitude, latitude]);
      loadOneDayData(longitude, latitude);
      setStatus(Status.SET);

    } catch(error) {
      console.error(error);
      setStatus(Status.ERROR);
    }
    
  };

  const clearGeolocation = () => {
    setCoords([]);
    setStatus(Status.NOT_SET);
  }
  const currentPhase = oneDay?.properties?.data.curphase ?? 'Moon Phase';

  const handleButtons = () => (
    <>
      { status === Status.NOT_SET ? (
        <button onClick={getGeolocation}>Get Location</button>) : (
        <button onClick={clearGeolocation}>Clear Location</button>
      )}
    </>
  )

  return (
    <div>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <main className="App">
        {handleButtons()}
        <p>Currently:  { STATUS_MSG[status] }</p>
        { status === Status.SET && (
          <>
            <p>Coordinates: {coords.map((c) => ` ${c} `)} &mdash; {location}  </p>
            <p> { currentPhase } is the current moon phase.</p>
          </>
        )}
        
      </main>

    </div>
  );
}

export default App;



