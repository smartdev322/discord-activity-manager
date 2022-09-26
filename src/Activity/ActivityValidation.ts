import { Activities } from '../types/activities';
import { DateTime } from 'luxon';

export class ActivityValidation {
  public static validActivity(activity: Activities.Activity): boolean {
    const errors = [];
    let valid = true;
    if (!this.validApplicationId(activity.applicationId)) return false;

    if (activity.state) errors.push(this.validUserString(activity.state));
    if (activity.details) errors.push(this.validUserString(activity.details));
    //if (activity.startTimestamp) errors.push(this.validNumber(activity.startTimestamp));
    //if (activity.timestamp) errors.push(this.validDate(activity.timestamp));
    if (activity.party) errors.push(this.validParty(activity.party));
    if (activity.buttons.length > 0)
      errors.push(this.validButtons(activity.buttons));

    errors.forEach((check) => {
      if (check !== true) valid = false;
    });

    return valid;
  }

  /**
   * Returns if the application id is a valid string
   * @param appId A value that is supposed to represent the Discord Application ID
   * @returns Whether the application ID is a string
   */
  private static validApplicationId(appId: unknown): boolean {
    if (typeof appId === 'string' && appId.length > 0) return true;
    return false;
  }

  /**
   * Checks if the user-supplied string (e.g. state, details, etc.) is indeed a string and is 128 characters or fewer
   * @param userString The user input
   * @returns Whether the user string is valid
   */
  private static validUserString(userString: unknown): boolean {
    if (typeof userString !== 'string') return false;
    if (userString.length > 128) return false;
    return true;
  }

  /**
   * Uses the Luxon isValid function to check if the date provided is valid
   * @param date
   * @returns
   */
  private static validDate(date: Activities.ActivityTimestamps): boolean {
    if (!date.start && !date.end) return false;
    const testDate = date.end || date.start;

    return DateTime.fromMillis(testDate).isValid;
  }

  private static validParty(array: Activities.PartySize): boolean {
    if (
      typeof array.currentSize === 'number' &&
      typeof array.maxSize === 'number'
    )
      return true;
    return false;
  }

  private static validButtons(buttons: Array<Activities.Buttons>): boolean {
    const urlRegex = /https:.*/; //HTTPS only
    buttons.forEach((val) => {
      return urlRegex.test(val.url);
    });

    return false;
  }
}