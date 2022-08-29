import React, { useState } from 'react';
import './App.css';
import './global.d.ts';

function App() {
  const [isLive, setIsLive] = useState(false);

  const broadcast = async (): Promise<void> => {
    window.activityManager.updateStatus();
    setIsLive(true);
  }

  const disconnect = async (): Promise<void> => {
    window.activityManager.disconnect();
    setIsLive(false);
  }


  return (
    <div className='App'>
      <h1>Project Turf</h1>

      <div>
        <label htmlFor='applicationId'>Application ID</label>
        <input type='number' id='applicationId' name='applicationId' className='' required readOnly />

        <label htmlFor='appName'>Application Name</label>
        <input type='text' id='appName' name='appName' className='' required readOnly />
      </div>
      <div>
        {isLive ? <button id='disconnect' onClick={disconnect}>DISCONNECT</button> : <button id='broadcast' onClick={broadcast}>BROADCAST</button>}
      </div>
    </div>
  );
}

export default App;
