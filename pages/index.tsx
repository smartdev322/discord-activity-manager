import { useEffect, useState, useRef, createRef } from 'react';
import Head from 'next/head';
import { IconMoon, IconSun, IconBroadcast, IconBroadcastOff, IconEdit, IconEraser, IconFile, IconFileText, IconQuestionMark } from '@tabler/icons';
import ErrorMsg from '../components/ErrorMsg';

function App() {
  const firstLoad = useRef(true);
  const broadcasting = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isBroadcasting, setisBroadcasting] = useState(false);
  const [processFailed, setProcessFailed] = useState(false);
  const [discordStatus, setDiscordStatus] = useState(0);

  const [darkMode, setDarkMode] = useState(true);
  const [richPresenceEditor, setRichPresenceEditor] = useState(true);

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
    setisBroadcasting(false);
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
    setisBroadcasting(true);
    setDiscordStatus(await window.activityManager.broadcastStatus(activity));
  }

  const updateStatus = async () => {
    if (discordStatus !== 0) { setisBroadcasting(false); return }

    const activityTimestamp = () => {
      if (timestampStart) {
        return ({ start: Date.now() });
      }
      return ({ end: new Date(timestamp).getTime() });
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
    if (firstLoad.current) {
      firstLoad.current = false;
      setDarkMode(localStorage.getItem('darkMode') === 'true');
      setRichPresenceEditor(localStorage.getItem('richPresenceEditor') === 'true');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (discordStatus !== 0) {
      setisBroadcasting(false);
      setProcessFailed(true);
    }
    else {
      setProcessFailed(false);
    }
  }, [discordStatus])

  // Toggle between light and dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    }
    else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Toggle between Simple and the Rich Presence editor.
  useEffect(() => {
    if (richPresenceEditor) {
      localStorage.setItem('richPresenceEditor', 'true');
    }
    else {
      localStorage.setItem('richPresenceEditor', 'false');

      // Clears all rich presence fields when the user switches to the simple editor
      setDetails('');
      setState('');
      setTimestamp(0);
      setTimestampStart(true);
      setLargeImageKey('');
      setLargeImageText('');
      setSmallImageKey('');
      setSmallImageText('');

      // If the change is performed after a status is being broadcasted, attempt to update the data
      if (isBroadcasting) { updateStatus() }
    }
  }, [richPresenceEditor]);

  const Status = () => {
    if (processFailed) {
      return (
        <div className='bg-red-800 w-full statusbar overflow-hidden'>
          <span className='truncate'>{applicationId ? `${applicationId}` : 'Application ID not configured'}</span>
          <span className='grow w-1/12' />
          <span className='flex-none'>Error: {ErrorMsg(discordStatus)} ({discordStatus})</span>
        </div>
      );
    }
    if (isBroadcasting) {
      return (
        <div className='bg-green-900 w-full statusbar overflow-hidden'>
          <span className='truncate'>{applicationId ? `${applicationId}` : 'Application ID not configured'}</span>
          <span className='grow w-1/12' />
          <span className='flex-none'>Connected</span>
        </div>
      );
    }
    return (
      <div className='dark:bg-dark-800 bg-light-200 discordTextActive w-full statusbar overflow-hidden'>
        <span className='truncate'>{applicationId ? `${applicationId}` : 'Application ID not configured'}</span>
        <span className='grow w-1/12' />
        <span className='flex-none'>Ready</span>
      </div>
    );
  }

  return (
    <main className={`${loading ? 'invisible' : 'visible'}`}>
      <Head>
        <title>Project Turf</title>
      </Head>

      <div id='bgMain' className='flex flex-col min-h-screen min-w-screen dark:bg-dark-600 bg-white'>
        <div className='mx-4 py-2 flex flex-row flex-grow-0'>
          <h1 className='py-2 text-xl text-center font-semibold discordTextActive'>Discord Status Editor</h1>
          <span className='flex grow' />
          <button id='darkMode' className='p-2 bg-inherit rounded-md discordTextInteractive interactiveBorder' onClick={() => setDarkMode(!darkMode)}>{darkMode ? <IconMoon /> : <IconSun className='fill-dark-700' />}</button>
        </div>
        <div id='bgConfig' className='flex flex-col flex-grow min-h-full m-4 p-4 mt-0 dark:bg-dark-800 dark:text-dark-200 bg-light-200 text-light-900 backdrop-blur-md rounded'>
          <form id='activityProperties' className='flex flex-col space-y-1'>
            <span className='flex flex-col hidden'>
              <label htmlFor='name' className='text-sm flex space-x-1'>
                <span>Application Name</span>
                <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='14px' />
                  <span className='tooltip'>You may search through your stored applications here. Whatever is entered here has no effect on what Discord displays as your activity</span>
                </span>
              </label>
              <input type='text' id='name' name='name' ref={broadcasting} className='inputBorder' placeholder='Application Name' value={name} onChange={(e) => { setName(e.target.value) }} />
            </span>

            <span className='flex flex-col'>
              <label htmlFor='applicationId' className='text-sm flex space-x-1'>
                <span>Application ID</span>
                <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='14px' />
                  <span className='tooltip'>An Application ID is the unique identifier that Discord uses to know what application you're using. If you do not know this value, you may need to first create one at Discord's Developer Portal</span>
                </span>
              </label>
              <input type='text' id='applicationId' name='applicationId' className={`inputBorder ${isBroadcasting ? 'disabled' : ''}`} placeholder='Application ID' value={applicationId} onChange={(e) => { setApplicationId(e.target.value) }} maxLength={64} required />
            </span>

            <div className={`space-y-2 ${richPresenceEditor ? 'visible' : 'invisible'}`}>
              <div className='flex flex-row space-x-2'>
                <span className='flex flex-col w-1/2'>
                  <label htmlFor='details' className='text-sm flex space-x-1'>
                    <span>Details</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='14px' />
                      <span className='tooltip'>What you are currently doing in-game</span>
                    </span>
                  </label>
                  <input type='text' id='details' name='details' className='inputBorder' placeholder='Details' value={details} onChange={(e) => { setDetails(e.target.value) }} />
                </span>
                <span className='flex flex-col w-1/2'>
                  <label htmlFor='state' className='text-sm flex space-x-1'>
                    <span>
                      State
                    </span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='14px' />
                      <span className='tooltip'>A description of your party's status (e.g. Playing Solo, Going Duo, In a Squad, etc.)</span>
                    </span>
                  </label>
                  <input type='text' id='state' name='state' className='inputBorder' placeholder='State' value={state} onChange={(e) => { setState(e.target.value) }} />
                </span>
              </div>

              <div className='flex flex-row space-x-2'>
                <span className='flex flex-col w-1/2'>
                  <label htmlFor='largeImageKey' className='text-sm flex space-x-1'>
                    <span>Large Image Key</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='14px' />
                      <span className='tooltip'>The case-sensitive key for the artwork uploaded under the application's Rich Presence Assets. If the key matches, the image set here will be shown to other users</span>
                    </span>
                  </label>
                  <input type='text' id='largeImageKey' name='largeImageKey' className='inputBorder' placeholder='Large Image Key' value={largeImageKey} onChange={(e) => { setLargeImageKey(e.target.value) }} />
                </span>
                <span className='flex flex-col w-1/2'>
                  <label htmlFor='largeImageText' className='text-sm flex space-x-1'>
                    <span>Large Image Text</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='14px' />
                      <span className='tooltip'>The tooltip when hovering over the large artwork</span>
                    </span>
                  </label>
                  <input type='text' id='largeImageText' name='largeImageText' className='inputBorder' placeholder='Large Image Text' value={largeImageText} onChange={(e) => { setLargeImageText(e.target.value) }} />
                </span>
              </div>

              <div className='flex flex-row space-x-2'>
                <span className='flex flex-col w-1/2'>
                  <label htmlFor='smallImageKey' className='text-sm flex space-x-1'>
                    <span>Small Image Key</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='14px' />
                      <span className='tooltip'>The case-sensitive key for the artwork uploaded under the application's Rich Presence Assets. The image will be shown on the bottom-right corner of the large image set above &ndash; if the this value is set but the large image key is not, this value will take its place</span>
                    </span>
                  </label>
                  <input type='text' id='smallImageKey' name='smallImageKey' className='inputBorder' placeholder='Small Image' value={smallImageKey} onChange={(e) => { setSmallImageKey(e.target.value) }} />
                </span>
                <span className='flex flex-col w-1/2'>
                  <label htmlFor='smallImageText' className='text-sm flex space-x-1'>
                    <span>Small Image Text</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='14px' />
                      <span className='tooltip'>The tooltip when hovering over the small artwork</span>
                    </span>
                  </label>
                  <input type='text' id='smallImageText' name='smallImageText' className='inputBorder' placeholder='Small Image Text' value={smallImageText} onChange={(e) => { setSmallImageText(e.target.value) }} />
                </span>
              </div>
            </div>
          </form>

          <div className='grow' />

          <div id='operationControl' className='flex flex-row space-x-5 font-semibold'>
            <button id='editorStyle' className='p-2 bg-inherit rounded-md discordTextInteractive' onClick={() => setRichPresenceEditor(!richPresenceEditor)}>{
              richPresenceEditor
                ? <span className='flex space-x-1'><IconFileText /><span>Rich Presence</span><span className='has-tooltip'><IconQuestionMark size='12px' /><span className='tooltip text-sm bottom-11 left-0 font-normal'>The editor is in <strong>rich presence</strong> mode<br /><br />The rich presence editor grants the user more control over what gets shown in their status message</span></span></span>
                : <span className='flex space-x-1'><IconFile /><span>Simple</span><span className='has-tooltip'><IconQuestionMark size='12px' /><span className='tooltip text-sm bottom-11 left-0 font-normal'>The editor is in <strong>simple</strong> mode<br /><br />No rich presence assets can be configured, and Discord will use the application's <strong>default app icon</strong></span></span></span>
            }</button>
            <span className='grow' />

            {/* RESET/DISCONNECT */}
            {isBroadcasting
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
                <IconEraser /><span>Reset</span>
              </button>
            }

            {/* BROADCAST/UPDATE */}
            {isBroadcasting
              ? <button
                id='update'
                className='flex p-2 w-max-1/4 rounded-md space-x-1 text-white bg-indigo-600 hover:bg-indigo-700'
                onClick={updateStatus}>
                <IconEdit /><span>Update</span>
              </button>
              : <button
                id='broadcast'
                className='flex p-2 w-max-1/4 rounded-md space-x-1 text-white bg-indigo-600 hover:bg-indigo-700'
                onClick={broadcast}>
                <IconBroadcast /><span>Broadcast</span>
              </button>
            }
          </div>
        </div>

        <div id='discordStatus' className='flex flex-row font-semibold'>
          <Status />
        </div>
      </div>
    </main>
  );
}

export default App;
