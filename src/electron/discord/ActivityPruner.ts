/**
 * Prunes an Activity object so that it removes empty fields
 */

import { Activities } from "./Activities";

interface ActivityIndex extends Activities.Activity{
  [key: string]: string | number | Activities.ActivityAssets | Activities.ActivityTimestamps | Activities.ActivityParty;
}

export function prune(activity: Activities.Activity): Activities.Activity {
  const keys: string[] = Object.keys(activity);
  const newActivity: ActivityIndex = { ...activity }

  console.log(newActivity);
  keys.forEach((key: string) => {
    if ((Object.values(newActivity[key]).length) === 0) {
      delete (newActivity[key]);
    }
  })

  console.log(newActivity);
  return (newActivity);
}
