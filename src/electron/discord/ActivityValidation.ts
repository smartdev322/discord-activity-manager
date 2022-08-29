import { Activity } from './Activity';
import { DateTime } from 'luxon';

export class ActivityValidation {
  public static validActivity(activity: Activity.Struct): boolean {
    this.validApplicationId(activity.applicationId);

    if (activity.state) this.validUserString(activity.state);
    if (activity.details) this.validUserString(activity.details);


    return (false);
  }

  /**
   * Returns if the application id is a valid string
   * @param appId A value that is supposed to represent the Discord Application ID
   * @returns Whether the application ID is a string
   */
  private static validApplicationId(appId: any): boolean {
    if (typeof (appId) === 'string') return (true);
    return (false);
  }

  /**
   * Checks if the user-supplied string (e.g. state, details, etc.) is indeed a string and is 128 characters or fewer
   * @param userString The user input
   * @returns Whether the user string is valid
   */
  private static validUserString(userString: any): boolean {
    if (typeof (userString) !== 'string') return (false);
    if (userString.length > 128) return (false);
    return (true);
  }

  /**
   * 
   * @param date 
   * @returns 
   */
  private static validDate(date: any): boolean {
    let testDate = DateTime.fromObject(date);
    return (testDate.isValid);
  }
}

