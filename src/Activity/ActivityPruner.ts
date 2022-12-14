/**
 * Prunes an Activity object so that it removes empty fields
 */

import { Activities } from '../types/activities';

interface ActivityIndex extends Activities.Activity {
  [key: string]:
    | string
    | number
    | Activities.ActivityAssets
    | Activities.PartySize
    | Array<Activities.Buttons>;
}

export function prune(activity: Activities.Activity): Activities.Activity {
  const keys: string[] = Object.keys(activity);
  const newActivity: ActivityIndex = { ...activity };

  keys.forEach((key: string) => {
    switch (typeof newActivity[key]) {
      case 'number':
        if (newActivity[key] == 0 || newActivity[key] === 'undefined') {
          delete newActivity[key];
        }
        break;
      default:
        if (Object.values(newActivity[key]).length === 0) {
          delete newActivity[key];
        }
    }
  });

  return newActivity;
}
