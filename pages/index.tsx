import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import {
  IconQuestionMark,
  IconExternalLink /*,
  IconX,
  IconHistory,
  IconLock,
  IconSearch,*/,
} from "@tabler/icons";
import DarkModeToggle from "../components/DarkMode";
import StatusBar from "../components/StatusBar";
import Controls from "../components/Controls";

function App() {
  const firstLoad = useRef(true);
  const [loading, setLoading] = useState(true);
  const [isBroadcasting, setisBroadcasting] = useState(false);
  const [processFailed, setProcessFailed] = useState(false);
  const [discordStatus, setDiscordStatus] = useState(0);

  const [darkMode, setDarkMode] = useState(true);
  const [richPresenceEditor, setRichPresenceEditor] = useState(true);

  // Variables found in the Activity struct
  const [name, setName] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [details, setDetails] = useState("");
  const [state, setState] = useState("");
  //const [timestamp, setTimestamp] = useState(0);
  //const [timestampStart, setTimestampStart] = useState(true);
  const [largeImageKey, setLargeImageKey] = useState("");
  const [largeImageText, setLargeImageText] = useState("");
  const [smallImageKey, setSmallImageKey] = useState("");
  const [smallImageText, setSmallImageText] = useState("");
  //const [partySize, setPartySize] = useState(0);
  //const [partyMax, setPartyMax] = useState(0);
  //const [button1, setButton1] = useState({ label: "", url: "" });
  //const [button2, setButton2] = useState({ label: "", url: "" });
  //const [buttons, setButtons] = useState([]);

  const reset = () => {
    setisBroadcasting(false);
    setProcessFailed(false);
    setDiscordStatus(0);
  };

  const resetData = () => {
    reset();

    setName("");
    setApplicationId("");
    setDetails("");
    setState("");
    //setTimestamp(0);
    //setTimestampStart(true);
    setLargeImageKey("");
    setLargeImageText("");
    setSmallImageKey("");
    setSmallImageText("");
    //setPartySize(0);
    //setPartyMax(0);
    //setButtons([]);
  };

  const broadcast = async (): Promise<void> => {
    /*const activityTimestamp = () => {
      if (timestampStart) {
        return {
          start: Date.now(),
        };
      }
      return {
        end: new Date(timestamp).getTime(),
      };
    };*/

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
    };

    reset();
    setisBroadcasting(true);
    setDiscordStatus(await window.activityManager.broadcastStatus(activity));
  };

  const updateStatus = async () => {
    if (discordStatus !== 0) {
      setisBroadcasting(false);
      return;
    }

    /*const activityTimestamp = () => {
      if (timestampStart) {
        return { start: Date.now() };
      }
      return { end: new Date(timestamp).getTime() };
    };*/

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
    };

    setDiscordStatus(await window.activityManager.updateStatus(activity));
  };

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
      setDarkMode(
        localStorage.getItem("darkMode")
          ? localStorage.getItem("darkMode") === "true"
          : window.matchMedia("(prefers-color-scheme: dark)").matches
      );
      setRichPresenceEditor(
        localStorage.getItem("richPresenceEditor")
          ? localStorage.getItem("richPresenceEditor") === "true"
          : true
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (name !== "") null;
  }, [name]);

  useEffect(() => {
    if (discordStatus !== 0) {
      setisBroadcasting(false);
      setProcessFailed(true);
    } else {
      setProcessFailed(false);
    }
  }, [discordStatus]);

  // Toggle between light and dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Toggle between Simple and the Rich Presence editor.
  useEffect(() => {
    if (richPresenceEditor) {
      localStorage.setItem("richPresenceEditor", "true");
    } else {
      localStorage.setItem("richPresenceEditor", "false");

      // Clears all rich presence fields when the user switches to the simple editor
      setDetails("");
      setState("");
      //setTimestamp(0);
      //setTimestampStart(true);
      setLargeImageKey("");
      setLargeImageText("");
      setSmallImageKey("");
      setSmallImageText("");
      //setButtons([]);
    }
  }, [richPresenceEditor]);

  return (
    <main className={`${loading ? "invisible" : "visible"}`}>
      <Head>
        <title>Discord Activity Manager</title>
      </Head>

      <div
        id="bgMain"
        className="flex min-h-screen w-screen flex-col bg-white dark:bg-dark-600"
      >
        <div className="mx-4 flex grow-0 flex-row py-2">
          <h1 className="discordTextActive py-2 text-center text-xl font-semibold">
            Discord Activity Manager
          </h1>
          <span className="flex grow" />
          <DarkModeToggle mode={{ darkMode, setDarkMode }} />
        </div>
        <div
          id="bgConfig"
          className="m-4 mt-0 flex min-h-full grow flex-col rounded bg-light-200 p-4 text-light-900 backdrop-blur-md dark:bg-dark-800 dark:text-dark-200"
        >
          <form id="activityProperties" className="flex flex-col space-y-1">
            <div id="applicationSearchField" className="hidden flex-col">
              <label
                htmlFor="applicationSearch"
                className="flex select-none space-x-1 text-xs"
              >
                <span>Search for Application</span>
                <span className="has-tooltip">
                  <IconQuestionMark
                    className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                    size="12px"
                  />
                  <span className="tooltip">
                    Search for locally stored application IDs
                  </span>
                </span>
              </label>
              <input
                type="text"
                id="applicationSearch"
                name="applicationSearch"
                className={`inputBorder text-sm`}
                placeholder="Application Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              ></input>
            </div>

            <div id="applicationIdField" className="flex flex-col">
              <label
                htmlFor="applicationId"
                className="flex select-none space-x-1 text-xs"
              >
                <span>Application ID</span>
                <span className="has-tooltip">
                  <IconQuestionMark
                    className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                    size="12px"
                  />
                  <span className="tooltip">
                    An Application ID is the unique identifier that Discord uses
                    to know what application you're using. If you do not know
                    this value, you may need to first create one at{" "}
                    <a
                      href="https://discord.com/developers/applications"
                      target="_blank"
                    >
                      <span className="inline">
                        Discord's Developer Portal
                        <IconExternalLink size="16px" className="inline pb-1" />
                      </span>
                    </a>
                  </span>
                </span>
              </label>
              <input
                type="text"
                id="applicationId"
                name="applicationId"
                className={`inputBorder disabled:discordTextInactive text-sm disabled:cursor-not-allowed`}
                placeholder="Application ID"
                value={applicationId}
                onChange={(e) => {
                  setApplicationId(e.target.value);
                }}
                maxLength={32}
                required
                disabled={isBroadcasting ? true : false}
                onKeyDown={(e) => {
                  if (
                    e.altKey &&
                    (e.code === "Enter" || e.code === "NumpadEnter")
                  ) {
                    isBroadcasting ? updateStatus() : broadcast();
                  }
                }}
              />
            </div>

            <div
              id="richPresenceFields"
              className={`space-y-2 ${
                richPresenceEditor ? "visible" : "invisible"
              }`}
            >
              <div className="flex flex-row space-x-2">
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="details"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Details</span>
                    <span className="has-tooltip">
                      <IconQuestionMark
                        className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                        size="12px"
                      />
                      <span className="tooltip">
                        What you are currently doing in-game
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="details"
                    name="details"
                    className="inputBorder text-sm"
                    placeholder="Details"
                    value={details}
                    onChange={(e) => {
                      setDetails(e.target.value);
                    }}
                  />
                </div>
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="state"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>State</span>
                    <span className="has-tooltip">
                      <IconQuestionMark
                        className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                        size="12px"
                      />
                      <span className="tooltip">
                        A description of your party's status (e.g. Playing Solo,
                        Going Duo, In a Squad, etc.)
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="inputBorder text-sm"
                    placeholder="State"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-row space-x-2">
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="largeImageKey"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Large Image Key</span>
                    <span className="has-tooltip">
                      <IconQuestionMark
                        className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                        size="12px"
                      />
                      <span className="tooltip">
                        The all lowercase identifier for the artwork uploaded
                        under the application's Rich Presence Assets. If the key
                        matches, the image set here will be shown to other users
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="largeImageKey"
                    name="largeImageKey"
                    className="inputBorder text-sm"
                    placeholder="Large Image Key"
                    value={largeImageKey}
                    onChange={(e) => {
                      setLargeImageKey(e.target.value);
                    }}
                  />
                </div>
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="largeImageText"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Large Image Text</span>
                    <span className="has-tooltip">
                      <IconQuestionMark
                        className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                        size="12px"
                      />
                      <span className="tooltip">
                        The tooltip when hovering over the large artwork
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="largeImageText"
                    name="largeImageText"
                    className="inputBorder text-sm"
                    placeholder="Large Image Text"
                    value={largeImageText}
                    onChange={(e) => {
                      setLargeImageText(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-row space-x-2">
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="smallImageKey"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Small Image Key</span>
                    <span className="has-tooltip">
                      <IconQuestionMark
                        className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                        size="12px"
                      />
                      <span className="tooltip">
                        The all lowercase identifier for the artwork uploaded
                        under the application's Rich Presence Assets. The image
                        will be shown on the bottom-right corner of the large
                        image set above &ndash; if the this value is set but the
                        large image key is not, this value will take its place
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="smallImageKey"
                    name="smallImageKey"
                    className="inputBorder text-sm"
                    placeholder="Small Image Key"
                    value={smallImageKey}
                    onChange={(e) => {
                      setSmallImageKey(e.target.value);
                    }}
                  />
                </div>
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="smallImageText"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Small Image Text</span>
                    <span className="has-tooltip">
                      <IconQuestionMark
                        className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                        size="12px"
                      />
                      <span className="tooltip">
                        The tooltip when hovering over the small artwork
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="smallImageText"
                    name="smallImageText"
                    className="inputBorder text-sm"
                    placeholder="Small Image Text"
                    value={smallImageText}
                    onChange={(e) => {
                      setSmallImageText(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className=" hidden flex-row space-x-2">
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="button1"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Button 1 Label</span>
                    <span className="has-tooltip">
                      <IconQuestionMark
                        className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                        size="12px"
                      />
                      <span className="tooltip">
                        This is a button that will take the user to the
                        specified URL. It will appear below the activity. A
                        quirk is that the original user will not be able to use
                        the button.
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="button1"
                    name="Button 1 Label"
                    className="inputBorder text-sm"
                    placeholder="Button 1 Label"
                    value={smallImageKey}
                    onChange={(e) => {
                      setSmallImageKey(e.target.value);
                    }}
                  />
                </div>
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="button1Url"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Button 1 URL</span>
                  </label>
                  <input
                    type="text"
                    id="button1Url"
                    name="button1Url"
                    className="inputBorder text-sm"
                    placeholder="Button 1 URL"
                    value={smallImageText}
                    onChange={(e) => {
                      setSmallImageText(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className=" hidden flex-row space-x-2">
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="button1"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Button 2 Label</span>
                    <span className="has-tooltip">
                      <IconQuestionMark
                        className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                        size="12px"
                      />
                      <span className="tooltip">
                        This is a button that will take the user to the
                        specified URL. It will appear below the activity. A
                        quirk is that the original user will not be able to use
                        the button.
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="button2"
                    name="Button 2 Label"
                    className="inputBorder text-sm"
                    placeholder="Button 2 Label"
                    value={smallImageKey}
                    //onChange={(e) => {setButton2({ label: e.target.value, url: "" });}}
                  />
                </div>
                <div className="flex w-1/2 flex-col">
                  <label
                    htmlFor="button2Url"
                    className="flex select-none space-x-1 text-xs"
                  >
                    <span>Button 2 URL</span>
                  </label>
                  <input
                    type="text"
                    id="button2Url"
                    name="button2Url"
                    className="inputBorder text-sm"
                    placeholder="Button 2 URL"
                    value={smallImageText}
                    onChange={(e) => {
                      setSmallImageText(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="grow" />
          <Controls
            vars={{ richPresenceEditor, isBroadcasting }}
            hooks={{
              reset,
              resetData,
              setRichPresenceEditor,
              broadcast,
              updateStatus,
            }}
          />
        </div>
        <div id="discordStatus">
          <StatusBar
            props={{
              processFailed,
              isBroadcasting,
              applicationId,
              discordStatus,
            }}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
