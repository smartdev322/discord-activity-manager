import { useEffect, useState, useRef } from 'react';

function App() {
  const firstLoad = useRef(true);
  const [isLive, setIsLive] = useState(false);
  const [processFailed, setProcessFailed] = useState(false);
  const [discordStatus, setDiscordStatus] = useState(0);

  const [darkMode, setDarkMode] = useState(false);

  const [name, setName] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [details, setDetails] = useState('');
  const [state, setState] = useState('');
  const [timestamp, setTimestamp] = useState(0);
  const [timestampStart, setTimestampStart] = useState(true);
  const [largeImageKey, setLargeImageKey] = useState('');
  const [largeImageText, setLargeImageText] = useState('');

  const reset = () => {
    setIsLive(false);
    setProcessFailed(false);
    setDiscordStatus(0);
  }

  const resetData = () => {
    setIsLive(false);
    setProcessFailed(false);
    setDiscordStatus(0);

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
      assets: {largeImageKey, largeImageText},
      timestamp: activityTimestamp()
    }
    reset();
    setIsLive(true);
    setDiscordStatus(await window.activityManager.updateStatus(activity));
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
        <div className='bg-rose-500 py-2 w-full font-medium text-white flex px-4'>
          <span className='flex'>{applicationId ? `appID: ${applicationId}` : 'Application ID not configured'}</span>
          <span className='flex grow' />
          <span className='flex'>Error: {text} ({discordStatus})</span>
        </div>
      );
    }
    if (isLive) {
      return (
        <div className='bg-green-500 py-2 w-full font-medium text-white flex px-4'>
          <span className='flex'>{applicationId ? `appID: ${applicationId}` : 'Application ID not configured'}</span>
          <span className='flex grow' />
          <span className='flex'>Connected</span>
        </div>
      );
    }

    return (
      <div className='bg-gradient-to-r from-sky-500 to-indigo-500 py-2 w-full font-medium text-white flex px-4'>
        <span className='flex'>{applicationId ? `appID: ${applicationId}` : 'Application ID not configured'}</span>
        <span className='flex grow' />
        <span className='flex'>Ready</span>
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen min-w-screen dark:bg-[#36393e] bg-[#f5f5f5]'>
      <div className='relative flex flex-col flex-grow min-h-full m-4 p-4 dark:bg-[#f5f5f5]/75 bg-[#36393e]/75 backdrop-blur-md rounded'>
        <h1 className='text-xl text-center flex-row'>Status Editor</h1>

        <form id='activityProperties' className='flex flex-col space-y-2'>
          <label htmlFor='name'>Application Name</label>
          <input type='text' id='name' name='name' className=' accent-rose-700' placeholder='Application Name' value={name} onChange={(e) => { setName(e.target.value) }} required />

          <label htmlFor='applicationId'>Application ID</label>
          <input type='text' id='applicationId' name='applicationId' className=' accent-rose-700' placeholder='Application ID' value={applicationId} onChange={(e) => { setApplicationId(e.target.value) }} required />

          <label htmlFor='state'>State</label>
          <input type='text' id='state' name='state' className='' placeholder='State' value={state} onChange={(e) => { setState(e.target.value) }} />

          <label htmlFor='details'>Details</label>
          <input type='text' id='details' name='details' className='' placeholder='Details' value={details} onChange={(e) => { setDetails(e.target.value) }} />

          <div className='flex-row space-y-2'>
            <span className='flex-col'>
              <label htmlFor='largeImageKey'>Large Image</label>
              <input type='text' id='largeImageKey' name='largeImageKey' className='' placeholder='Large Image' value={largeImageKey} onChange={(e) => { setLargeImageKey(e.target.value) }} />
            </span>
            <span className='flex-col'>
              <label htmlFor='largeImageText'>Large Image Text</label>
              <input type='text' id='largeImageText' name='largeImageText' className='' placeholder='Large Image Text' value={largeImageText} onChange={(e) => { setLargeImageText(e.target.value) }} />
            </span>

          </div>
        </form>

        <div className='grow' />

        <div id="operationControl" className='flex flex-row space-x-10'>
          <button id='darkMode' className='p-2 bg-slate-50' onClick={() => setDarkMode(!darkMode)}>DARK MODE</button>
          <span className='grow' />
          <button id='reset' className='bg-slate-400 p-2' onClick={resetData}>RESET</button>
          {isLive ? <button id='disconnect' className='bg-rose-500 p-2' onClick={disconnect}>DISCONNECT</button> : <button id='broadcast' className='p-2 bg-teal-300' onClick={broadcast}>BROADCAST</button>}
        </div>
      </div>

      <div id="discordStatus" className="flex flex-row">
        <Status />
      </div>
    </div>
  );
}

export default App;
