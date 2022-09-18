import ErrorMsg from "./ErrorMsg";

interface componentProps {
  props: {
    isBroadcasting: boolean;
    processFailed: boolean;
    applicationId: string;
    discordStatus: number;
  };
}

export default function StatusBar({ props }: componentProps): JSX.Element {
  if (props.processFailed) {
    return (
      <div className="statusbar w-full overflow-hidden bg-red-800">
        <span className="truncate">
          {props.applicationId
            ? `${props.applicationId}`
            : "Application ID not configured"}
        </span>
        <span className="w-1/12 grow" />
        <span className="flex-none">
          Error: {ErrorMsg(props.discordStatus)} ({props.discordStatus})
        </span>
      </div>
    );
  }

  if (props.isBroadcasting) {
    return (
      <div className="statusbar w-full overflow-hidden bg-green-900">
        <span className="truncate">
          {props.applicationId
            ? `${props.applicationId}`
            : "Application ID not configured"}
        </span>
        <span className="w-1/12 grow" />
        <span className="flex-none">Connected</span>
      </div>
    );
  }

  return (
    <div className="discordTextActive statusbar w-full overflow-hidden bg-light-200 dark:bg-dark-800">
      <span className="truncate">
        {props.applicationId
          ? `${props.applicationId}`
          : "Application ID not configured"}
      </span>
      <span className="w-1/12 grow" />
      <span className="flex-none">Ready</span>
    </div>
  );
}
