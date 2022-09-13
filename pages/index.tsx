import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { IconQuestionMark, IconX, IconHistory, IconLock, IconSearch } from '@tabler/icons';
import DarkModeToggle from '../components/DarkMode';
import StatusBar from '../components/StatusBar';
import Controls from '../components/Controls';

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
  const [button1, setButton1] = useState({ label: '', url: '' });
  const [button2, setButton2] = useState({ label: '', url: '' });
  const [buttons, setButtons] = useState([]);

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
    setPartySize(0);
    setPartyMax(0);
    setButtons([]);
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
      //party: [partySize, partyMax],
      //buttons: buttons
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
      //party: [partySize, partyMax],
      //buttons: buttons
    }

    setDiscordStatus(await window.activityManager.updateStatus(activity));
  }

  /*function SearchResults(): JSX.Element {
    let results: Array<any> = [];
    window.searchManager.search(name).then((data) => results = data)

    return ( 
      <div>
        {results.map((val: { item: { name: string, applicationId: string } }) =>
          <div onClick={() => {
            setName(val.item.name);
            setApplicationId(val.item.applicationId);
          }}>
            {val.item.name}
          </div>
        )}
      </div>
    )
  }*/

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      setDarkMode(localStorage.getItem('darkMode') === 'true');
      setRichPresenceEditor(localStorage.getItem('richPresenceEditor') === 'true');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (name !== '') null;
  }, [name])

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
      setButtons([]);
    }
  }, [richPresenceEditor]);

  return (
    <main className={`${loading ? 'invisible' : 'visible'}`}>
      <Head>
        <title>Project Turf</title>
      </Head>

      <div id='bgMain' className='flex flex-col min-h-screen min-w-screen dark:bg-dark-600 bg-white'>
        <div className='mx-4 py-2 flex flex-row flex-grow-0'>
          <h1 className='py-2 text-xl text-center font-semibold discordTextActive'>Discord Status Editor</h1>
          <span className='flex grow' />
          <DarkModeToggle mode={{ darkMode, setDarkMode }} />
        </div>
        <div id='bgConfig' className='flex flex-col flex-grow min-h-full m-4 p-4 mt-0 dark:bg-dark-800 dark:text-dark-200 bg-light-200 text-light-900 backdrop-blur-md rounded'>
          <form id='activityProperties' className='flex flex-col space-y-1'>
            <div id='applicationSearchField' className='flex-col hidden'>
              <label htmlFor='applicationSearch' className='select-none text-xs flex space-x-1'>
                <span>Search for Application</span>
                <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                  <span className='tooltip'>Search for locally stored application IDs</span>
                </span>
              </label>
              <input type='text' id='applicationSearch' name='applicationSearch' className={`inputBorder text-sm`} placeholder='Application Name' value={name} onChange={(e) => { setName(e.target.value) }}></input>
            </div>

            <div id='applicationIdField' className='flex flex-col'>
              <label htmlFor='applicationId' className='select-none text-xs flex space-x-1'>
                <span>Application ID</span>
                <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                  <span className='tooltip'>An Application ID is the unique identifier that Discord uses to know what application you're using. If you do not know this value, you may need to first create one at Discord's Developer Portal</span>
                </span>
              </label>
              <input type='text' id='applicationId' name='applicationId' className={`inputBorder text-sm disabled:discordTextInactive disabled:cursor-not-allowed`} placeholder='Application ID' value={applicationId} onChange={(e) => { setApplicationId(e.target.value) }} maxLength={32} required disabled={isBroadcasting ? true : false} onKeyDown={(e) => { console.log(e) }} onKeyDownCapture={(e) => { if (e.altKey && (e.code === 'Enter' || e.code === 'NumpadEnter')) { isBroadcasting ? updateStatus() : broadcast() } }} />
            </div>

            <div id='richPresenceFields' className={`space-y-2 ${richPresenceEditor ? 'visible' : 'invisible'}`}>
              <div className='flex flex-row space-x-2'>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='details' className='select-none text-xs flex space-x-1'>
                    <span>Details</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                      <span className='tooltip'>What you are currently doing in-game</span>
                    </span>
                  </label>
                  <input type='text' id='details' name='details' className='inputBorder text-sm' placeholder='Details' value={details} onChange={(e) => { setDetails(e.target.value) }} />
                </div>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='state' className='select-none text-xs flex space-x-1'>
                    <span>State</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                      <span className='tooltip'>A description of your party's status (e.g. Playing Solo, Going Duo, In a Squad, etc.)</span>
                    </span>
                  </label>
                  <input type='text' id='state' name='state' className='inputBorder text-sm' placeholder='State' value={state} onChange={(e) => { setState(e.target.value) }} />
                </div>
              </div>

              <div className='flex flex-row space-x-2'>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='largeImageKey' className='select-none text-xs flex space-x-1'>
                    <span>Large Image Key</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                      <span className='tooltip'>The all lowercase identifier for the artwork uploaded under the application's Rich Presence Assets. If the key matches, the image set here will be shown to other users</span>
                    </span>
                  </label>
                  <input type='text' id='largeImageKey' name='largeImageKey' className='inputBorder text-sm' placeholder='Large Image Key' value={largeImageKey} onChange={(e) => { setLargeImageKey(e.target.value) }} />
                </div>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='largeImageText' className='select-none text-xs flex space-x-1'>
                    <span>Large Image Text</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                      <span className='tooltip'>The tooltip when hovering over the large artwork</span>
                    </span>
                  </label>
                  <input type='text' id='largeImageText' name='largeImageText' className='inputBorder text-sm' placeholder='Large Image Text' value={largeImageText} onChange={(e) => { setLargeImageText(e.target.value) }} />
                </div>
              </div>

              <div className='flex flex-row space-x-2'>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='smallImageKey' className='select-none text-xs flex space-x-1'>
                    <span>Small Image Key</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                      <span className='tooltip'>The all lowercase identifier for the artwork uploaded under the application's Rich Presence Assets. The image will be shown on the bottom-right corner of the large image set above &ndash; if the this value is set but the large image key is not, this value will take its place</span>
                    </span>
                  </label>
                  <input type='text' id='smallImageKey' name='smallImageKey' className='inputBorder text-sm' placeholder='Small Image Key' value={smallImageKey} onChange={(e) => { setSmallImageKey(e.target.value) }} />
                </div>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='smallImageText' className='select-none text-xs flex space-x-1'>
                    <span>Small Image Text</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                      <span className='tooltip'>The tooltip when hovering over the small artwork</span>
                    </span>
                  </label>
                  <input type='text' id='smallImageText' name='smallImageText' className='inputBorder text-sm' placeholder='Small Image Text' value={smallImageText} onChange={(e) => { setSmallImageText(e.target.value) }} />
                </div>
              </div>

              <div className='flex flex-row space-x-2 hidden'>
                <div className='flex flex-col w-1/12'>
                  <label htmlFor='partySize' className='select-none text-xs flex space-x-1'>
                    Size
                  </label>
                  <input type='number' id='partySize' name='partySize' min={0} className='appearance-none inputBorder text-sm w-max-2' placeholder='Size' value={partySize} onChange={(e) => {
                    if (e.target.valueAsNumber > partyMax) { setPartyMax(e.target.valueAsNumber); }
                    setPartySize(e.target.valueAsNumber);
                  }} />
                </div>
                <span className='flex flex-col text-xs h-full'><span className='flex' /><span className='flex'>of</span></span>
                <div className='flex flex-col w-1/12'>
                  <label htmlFor='partyMax' className='select-none text-xs flex space-x-1'>
                    Max
                  </label>
                  <input type='number' id='partyMax' name='partyMax' min={0} className='appearance-none inputBorder text-sm w-max-2' placeholder='Max' value={partyMax} onChange={(e) => {
                    if (e.target.valueAsNumber <= partySize) { setPartySize(e.target.valueAsNumber); }
                    setPartyMax(e.target.valueAsNumber);
                  }} />
                </div>
              </div>

              <div className='flex flex-row space-x-2 hidden'>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='button1' className='select-none text-xs flex space-x-1'>
                    <span>Button 1 Label</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                      <span className='tooltip'>This is a button that will take the user to the specified URL. It will appear below the activity. A quirk is that the original user will not be able to use the button.</span>
                    </span>
                  </label>
                  <input type='text' id='button1' name='Button 1 Label' className='inputBorder text-sm' placeholder='Button 1 Label' value={smallImageKey} onChange={(e) => { setSmallImageKey(e.target.value) }} />
                </div>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='button1Url' className='select-none text-xs flex space-x-1'>
                    <span>Button 1 URL</span>
                  </label>
                  <input type='text' id='button1Url' name='button1Url' className='inputBorder text-sm' placeholder='Button 1 URL' value={smallImageText} onChange={(e) => { setSmallImageText(e.target.value) }} />
                </div>
              </div>
              <div className='flex flex-row space-x-2 hidden'>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='button1' className='select-none text-xs flex space-x-1'>
                    <span>Button 2 Label</span>
                    <span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' />
                      <span className='tooltip'>This is a button that will take the user to the specified URL. It will appear below the activity. A quirk is that the original user will not be able to use the button.</span>
                    </span>
                  </label>
                  <input type='text' id='button2' name='Button 2 Label' className='inputBorder text-sm' placeholder='Button 2 Label' value={smallImageKey} onChange={(e) => { setButton2({ label: e.target.value, url: '' }) }} />
                </div>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor='button2Url' className='select-none text-xs flex space-x-1'>
                    <span>Button 2 URL</span>
                  </label>
                  <input type='text' id='button2Url' name='button2Url' className='inputBorder text-sm' placeholder='Button 2 URL' value={smallImageText} onChange={(e) => { setSmallImageText(e.target.value) }} />
                </div>
              </div>
            </div>
          </form>
          <div className='grow' />
          <Controls vars={{ richPresenceEditor, isBroadcasting }} hooks={{ reset, resetData, setRichPresenceEditor, broadcast, updateStatus }} />
        </div>
        <div id='discordStatus'>
          <StatusBar props={{ processFailed, isBroadcasting, applicationId, discordStatus }} />
        </div>
      </div>

    </main>
  );
}

export default App;
