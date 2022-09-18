import {
  IconFileText,
  IconFile,
  IconQuestionMark,
  IconBroadcast,
  IconBroadcastOff,
  IconEdit,
  IconEraser,
} from "@tabler/icons";
import { Dispatch } from "react";

interface ControlProps {
  vars: ControlVariables;
  hooks: ControlHooks;
}

interface ControlVariables {
  richPresenceEditor: boolean;
  isBroadcasting: boolean;
}

interface ControlHooks {
  broadcast: () => Promise<void>;
  reset: () => void;
  resetData: () => void;
  updateStatus: () => Promise<void>;
  setRichPresenceEditor: Dispatch<boolean>;
}

export default function Control({ vars, hooks }: ControlProps) {
  async function disconnect(): Promise<void> {
    window.activityManager.disconnect();
    hooks.reset();
  }

  return (
    <div id="Controls" className="flex flex-row space-x-5 font-semibold">
      <button
        id="editorStyle"
        className="interactiveBorder discordTextInteractive rounded-md bg-inherit p-2"
        onClick={() => hooks.setRichPresenceEditor(!vars.richPresenceEditor)}
      >
        {vars.richPresenceEditor ? (
          <span className="flex space-x-1">
            <IconFileText />
            <span>Rich Presence</span>
            <span className="has-tooltip">
              <IconQuestionMark
                className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                size="12px"
              />
              <span className="tooltip bottom-11 left-0 text-xs font-normal">
                The editor is in <strong>rich presence</strong> mode
                <br />
                <br />
                The rich presence editor grants the user more control over what
                gets shown in their status message
              </span>
            </span>
          </span>
        ) : (
          <span className="flex space-x-1">
            <IconFile />
            <span>Simple</span>
            <span className="has-tooltip">
              <IconQuestionMark
                className="interactiveBorder rounded-full bg-light-300 dark:bg-dark-700"
                size="12px"
              />
              <span className="tooltip bottom-11 left-0 text-xs font-normal">
                The editor is in <strong>simple</strong> mode
                <br />
                <br />
                No rich presence assets can be configured, and Discord will use
                the application's <strong>default app icon</strong>
              </span>
            </span>
          </span>
        )}
      </button>
      <span className="grow" />

      {/* RESET/DISCONNECT */}
      {vars.isBroadcasting ? (
        <button
          id="disconnect"
          className="discordTextActive flex space-x-1 rounded-md border border-solid border-red-500 p-2 hover:bg-red-500 hover:text-white"
          onClick={disconnect}
        >
          <IconBroadcastOff />
          <span>Disconnect</span>
        </button>
      ) : (
        <button
          id="reset"
          className="discordTextActive discordTextInteractive interactiveBorder flex space-x-1 rounded-md p-2"
          onClick={hooks.resetData}
        >
          <IconEraser />
          <span>Reset</span>
        </button>
      )}

      {/* BROADCAST/UPDATE */}
      {vars.isBroadcasting ? (
        <button
          id="update"
          className="interactiveBorder flex space-x-1 rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700"
          onClick={hooks.updateStatus}
        >
          <IconEdit />
          <span>Update</span>
        </button>
      ) : (
        <button
          id="broadcast"
          className="interactiveBorder flex space-x-1 rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700"
          onClick={hooks.broadcast}
        >
          <IconBroadcast />
          <span>Broadcast</span>
        </button>
      )}
    </div>
  );
}
