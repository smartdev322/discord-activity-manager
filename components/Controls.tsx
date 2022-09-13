import { IconFileText, IconFile, IconQuestionMark, IconBroadcast, IconBroadcastOff, IconEdit, IconEraser } from '@tabler/icons';
import { Dispatch, FunctionComponent } from 'react';

interface ControlProps {
  vars: ControlVariables,
  hooks: ControlHooks
}

interface ControlVariables {
  richPresenceEditor: boolean,
  isBroadcasting: boolean
}

interface ControlHooks {
  resetData: Dispatch<any>
  broadcast: Dispatch<any>
  reset: any
  updateStatus: Dispatch<any>
  setRichPresenceEditor: Dispatch<any>
}

export default function Control({ vars, hooks }: ControlProps) {
  async function disconnect(): Promise<void> {
    window.activityManager.disconnect();
    hooks.reset();
  }

  return (
    <div id='Controls' className='flex flex-row space-x-5 font-semibold'>
      <button id='editorStyle' className='p-2 bg-inherit rounded-md interactiveBorder discordTextInteractive' onClick={() => hooks.setRichPresenceEditor(!vars.richPresenceEditor)}>{
        vars.richPresenceEditor
          ? <span className='flex space-x-1'><IconFileText /><span>Rich Presence</span><span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' /><span className='tooltip text-xs bottom-11 left-0 font-normal'>The editor is in <strong>rich presence</strong> mode<br /><br />The rich presence editor grants the user more control over what gets shown in their status message</span></span></span>
          : <span className='flex space-x-1'><IconFile /><span>Simple</span><span className='has-tooltip'><IconQuestionMark className='dark:bg-dark-700 bg-light-300 interactiveBorder rounded-full' size='12px' /><span className='tooltip text-xs bottom-11 left-0 font-normal'>The editor is in <strong>simple</strong> mode<br /><br />No rich presence assets can be configured, and Discord will use the application's <strong>default app icon</strong></span></span></span>
      }</button>
      <span className='grow' />

      {/* RESET/DISCONNECT */}
      {vars.isBroadcasting
        ? <button
          id='disconnect'
          className='flex border border-solid border-red-500 hover:bg-red-500 p-2 discordTextActive hover:text-white rounded-md space-x-1'
          onClick={disconnect}>
          <IconBroadcastOff /><span>Disconnect</span>
        </button>
        : <button
          id='reset'
          className='flex discordTextActive p-2 w-max-1/4 rounded-md discordTextInteractive interactiveBorder space-x-1'
          onClick={hooks.resetData}>
          <IconEraser /><span>Reset</span>
        </button>
      }

      {/* BROADCAST/UPDATE */}
      {vars.isBroadcasting
        ? <button
          id='update'
          className='flex p-2 w-max-1/4 rounded-md space-x-1 interactiveBorder text-white bg-indigo-600 hover:bg-indigo-700'
          onClick={hooks.updateStatus}>
          <IconEdit /><span>Update</span>
        </button>
        : <button
          id='broadcast'
          className='flex p-2 w-max-1/4 rounded-md space-x-1 interactiveBorder text-white bg-indigo-600 hover:bg-indigo-700'
          onClick={hooks.broadcast}>
          <IconBroadcast /><span>Broadcast</span>
        </button>
      }
    </div>
  )
}