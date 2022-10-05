interface ControlVariables {
  richPresenceEditor: boolean;
  isBroadcasting: boolean;
}

interface ControlHooks {
  broadcast: () => Promise<void>;
  resetFlags: () => void;
  resetData: () => void;
  updateStatus: () => Promise<void>;
  setRichPresenceEditor: Dispatch<boolean>;
}

export interface ControlProps {
  vars: ControlVariables;
  hooks: ControlHooks;
}

export default ControlProps;
