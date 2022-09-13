import ErrorMsg from './ErrorMsg';

interface componentProps {
  props: {
    isBroadcasting: boolean,
    processFailed: boolean,
    applicationId: string,
    discordStatus: number
  }
}

export default function StatusBar({ props }: componentProps): JSX.Element {
  if (props.processFailed) {
    return (
      <div className='bg-red-800 w-full statusbar overflow-hidden'>
        <span className='truncate'>{props.applicationId ? `${props.applicationId}` : 'Application ID not configured'}</span>
        <span className='grow w-1/12' />
        <span className='flex-none'>Error: {ErrorMsg(props.discordStatus)} ({props.discordStatus})</span>
      </div>
    );
  }
  
  if (props.isBroadcasting) {
    return (
      <div className='bg-green-900 w-full statusbar overflow-hidden'>
        <span className='truncate'>{props.applicationId ? `${props.applicationId}` : 'Application ID not configured'}</span>
        <span className='grow w-1/12' />
        <span className='flex-none'>Connected</span>
      </div>
    );
  }

  return (
    <div className='dark:bg-dark-800 bg-light-200 discordTextActive w-full statusbar overflow-hidden'>
      <span className='truncate'>{props.applicationId ? `${props.applicationId}` : 'Application ID not configured'}</span>
      <span className='grow w-1/12' />
      <span className='flex-none'>Ready</span>
    </div>
  );
}
