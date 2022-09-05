import { useEffect, useState, useRef } from 'react';
import { IconSun, IconMoonStars, IconArrowBackUp, IconBroadcast, IconBroadcastOff, IconEdit } from '@tabler/icons';

function App() {
  const firstLoad = useRef(true);
  const [isLive, setIsLive] = useState(false);
  const [processFailed, setProcessFailed] = useState(false);
  const [discordStatus, setDiscordStatus] = useState(0);

  const [darkMode, setDarkMode] = useState(false);

  // Variables found in the Activity struct
  const [name, setName] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [details, setDetails] = useState('');
  const [state, setState] = useState('');
  const [timestamp, setTimestamp] = useState(0);
  const [timestampStart, setTimestampStart] = useState(true);
  const [largeImageKey, setLargeImageKey] = useState('');
  const [largeImageText, setLargeImageText] = useState('');
  const [smallImageKey, setSmallImageKey] = useState('');
  const [smallImageText, setSmallImageText] = useState('');
  const [partySize, setPartySize] = useState(0);
  const [partyMax, setPartyMax] = useState(0);

  const reset = () => {
    setIsLive(false);
    setProcessFailed(false);
    setDiscordStatus(0);
  }

  const resetData = () => {
    reset();

    setName('');
    setApplicationId('');
    setDetails('');
    setTimestamp(0);
    setTimestampStart(true);
    setLargeImageKey('');
    setLargeImageText('');
  }

  const broadcast = async (): Promise<void> => {
    const activityTimestamp = () => {
      if (timestampStart) {
        return ({
          start: Date.now()
        })
      }
      return ({
        end: new Date(timestamp).getTime()
      });
    }

    const activity = {
      applicationId: applicationId,
      state: state,
      details: details,
      //timestamp: activityTimestamp(),
      largeImageKey: largeImageKey,
      largeImageText: largeImageText,
      smallImageKey: smallImageKey,
      smallImageText: smallImageText,
      //party: [partySize, partyMax]
    }

    reset();
    setIsLive(true);
    setDiscordStatus(await window.activityManager.broadcastStatus(activity));
  }

  const updateStatus = async () => {
    const activityTimestamp = () => {
      if (timestampStart) {
        return ({
          start: Date.now()
        })
      }
      return ({
        end: new Date(timestamp).getTime()
      });
    }

    const activity = {
      applicationId: applicationId,
      state: state,
      details: details,
      //timestamp: activityTimestamp(),
      largeImageKey: largeImageKey,
      largeImageText: largeImageText,
      smallImageKey: smallImageKey,
      smallImageText: smallImageText,
      //party: [partySize, partyMax]
    }

    await window.activityManager.updateStatus(activity);
  }

  const disconnect = async (): Promise<void> => {
    window.activityManager.disconnect();
    reset();
  }

  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode') === 'true');
  }, [])

  useEffect(() => {
    if (discordStatus !== 0) {
      setIsLive(false);
      setProcessFailed(true);
    }
    else {
      setProcessFailed(false);
    }
  }, [discordStatus])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      firstLoad.current === true ? firstLoad.current = false : localStorage.setItem('darkMode', 'true');
    }
    else {
      document.documentElement.classList.remove('dark');
      firstLoad.current === true ? firstLoad.current = false : localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode])

  const Status = () => {
    let text = '';
    if (processFailed) {
      switch (discordStatus) {
        case 100:
          text = 'Child Process terminated'
          break;
        case 101:
          text = 'Active Process'
          break;
        case 102:
          text = 'Too many requests'
          break;
        case 103:
          text = 'Invalid Data'
          break;
        default:
          text = 'Other'
      }
      return (
        <div className='bg-rose-500 w-full statusbar'>
          <span className='flex'>{applicationId ? `'${applicationId}'` : 'Application ID not configured'}</span>
          <span className='flex grow' />
          <span className='flex'>Error: {text} ({discordStatus})</span>
        </div>
      );
    }
    if (isLive) {
      return (
        <div className='bg-green-500 w-full statusbar'>
          <span className='flex'>{applicationId ? `${applicationId}` : 'Application ID not configured'}</span>
          <span className='flex grow' />
          <span className='flex'>Connected</span>
        </div>
      );
    }

    return (
      <div className='bg-indigo-500 w-full statusbar'>
        <span className='flex'>{applicationId ? `${applicationId}` : 'Application ID not configured'}</span>
        <span className='flex grow' />
        <span className='flex'>Ready</span>
      </div>
    );
  }

  return (
    <div id="bgMain" className='flex flex-col min-h-screen min-w-screen dark:bg-dark-600 bg-white'>
      <h1 className='text-xl text-center font-semibold discordTextActive p-4'>Status Editor <span id="version" /></h1>
      <div id="bgConfig" className='relative flex flex-col flex-grow min-h-full m-4 p-4 mt-0 dark:bg-dark-800 dark:text-dark-200 bg-light-200 text-light-900 backdrop-blur-md rounded'>
        <form id='activityProperties' className='flex flex-col space-y-2'>
          <label htmlFor='name'>Application Name</label>
          <input type='text' id='name' name='name' className='inputBorder' placeholder='Application Name' value={name} onChange={(e) => { setName(e.target.value) }} required />

          <label htmlFor='applicationId'>Application ID</label>
          <input type='text' id='applicationId' name='applicationId' className='inputBorder' placeholder='Application ID' value={applicationId} onChange={(e) => { setApplicationId(e.target.value) }} required />

          <div className='flex flex-row space-x-2'>
            <span className='flex flex-col w-1/2'>
              <label htmlFor='details'>Details</label>
              <input type='text' id='details' name='details' className='inputBorder' placeholder='Details' value={details} onChange={(e) => { setDetails(e.target.value) }} />
            </span>
            <span className='flex flex-col w-1/2'>
              <label htmlFor='state'>State</label>
              <input type='text' id='state' name='state' className='inputBorder' placeholder='State' value={state} onChange={(e) => { setState(e.target.value) }} />
            </span>
          </div>

          <div className='flex flex-row space-x-2'>
            <span className='flex flex-col w-1/2'>
              <label htmlFor='largeImageKey'>Large Image Key</label>
              <input type='text' id='largeImageKey' name='largeImageKey' className='inputBorder' placeholder='Large Image Key' value={largeImageKey} onChange={(e) => { setLargeImageKey(e.target.value) }} />
            </span>
            <span className='flex flex-col w-1/2'>
              <label htmlFor='largeImageText'>Large Image Text</label>
              <input type='text' id='largeImageText' name='largeImageText' className='inputBorder' placeholder='Large Image Text' value={largeImageText} onChange={(e) => { setLargeImageText(e.target.value) }} />
            </span>
          </div>

          <div className='flex flex-row space-x-2 hidden'>
            <span className='flex flex-col w-1/2'>
              <label htmlFor='smallImageKey'>Small Image</label>
              <input type='text' id='smallImageKey' name='smallImageKey' className='inputBorder' placeholder='Small Image' value={smallImageKey} onChange={(e) => { setSmallImageKey(e.target.value) }} />
            </span>
            <span className='flex flex-col w-1/2'>
              <label htmlFor='smallImageText'>Small Image Text</label>
              <input type='text' id='smallImageText' name='smallImageText' className='inputBorder' placeholder='Small Image Text' value={smallImageText} onChange={(e) => { setSmallImageText(e.target.value) }} />
            </span>
          </div>
        </form>

        <div className='grow' />

        <div id="operationControl" className='flex flex-row space-x-5 font-semibold'>
          <button id='darkMode' className='p-2 bg-inherit rounded-md discordTextInteractive' onClick={() => setDarkMode(!darkMode)}>{darkMode ? <IconMoonStars /> : <IconSun />}</button>
          <span className='grow' />

          {/* RESET/DISCONNECT */}
          {isLive
            ? <button
              id='disconnect'
              className='flex border border-solid border-red-500 hover:bg-red-500 p-2 discordTextActive hover:text-white rounded-md space-x-1'
              onClick={disconnect}>
              <IconBroadcastOff /><span>Disconnect</span>
            </button>
            : <button
              id='reset'
              className='flex discordTextActive p-2 w-max-1/4 rounded-md discordTextInteractive space-x-1'
              onClick={resetData}>
              <IconArrowBackUp /><span>Reset</span>
            </button>
          }

          {/* BROADCAST/UPDATE */}
          {isLive
            ? <button
              id='update'
              className='flex bg-teal-500 p-2 discordTextActive rounded-md space-x-1'
              onClick={updateStatus}>
              <IconEdit /><span>Edit</span>
            </button>
            : <button
              id='broadcast'
              className='flex discordTextActive p-2 w-max-1/4 rounded-md discordTextInteractive space-x-1'
              onClick={broadcast}>
              <IconBroadcast /><span>Broadcast</span>
            </button>
          }
        </div>
      </div>

      <div id="discordStatus" className="flex flex-row font-semibold">
        <Status />
      </div>
    </div>
  );
}

export default App;
