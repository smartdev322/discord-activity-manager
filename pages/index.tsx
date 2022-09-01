import { useState } from 'react';

function App() {
  const [isLive, setIsLive] = useState(false);
  const [discordStatus, setDiscordStatus] = useState(null);

  const broadcast = async (): Promise<void> => {
    //window.activityManager.updateStatus();
    setIsLive(true);
    setDiscordStatus(null);
  }

  const disconnect = async (): Promise<void> => {
    //window.activityManager.disconnect();
    setIsLive(false);
  }


  return (
    <div className='App'>
      <div id="appStatus" className='bg-black'>Status</div>
      <h1>Header</h1>

      <div>
        <label htmlFor='applicationId'>Application ID</label>
        <input type='number' id='applicationId' name='applicationId' className='' required readOnly />

        <label htmlFor='appName'>Application Name</label>
        <input type='text' id='appName' name='appName' className='' required readOnly />
      </div>
      <div className='absolute bottom-0'>
        {isLive ? <button id='disconnect' onClick={disconnect}>DISCONNECT</button> : <button id='broadcast' onClick={broadcast}>BROADCAST</button>}
      </div>
    </div>
  );
}

export default App;
