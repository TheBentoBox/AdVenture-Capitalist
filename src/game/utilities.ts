/**
 * Formats the given number of seconds as a string timer value.
 * For example, passing in 67 returns "00:01:07".
 * @param timeInSeconds The number of seconds to retrieve as a display timer value.
 */
export function formatTime(timeInSeconds: number) {
    let hours = Math.max(Math.floor(timeInSeconds / 3600), 0);
    let minutes = Math.max(Math.floor((timeInSeconds % 3600) / 60), 0);
    let seconds = Math.max(Math.ceil(timeInSeconds % 60), 0);

    let timeValue = (hours < 10 ? `0${hours}` : String(hours));
    timeValue += (minutes < 10 ? `:0${minutes}` : String(minutes));
    timeValue += (seconds < 10 ? `:0${seconds}` : String(seconds));

    return timeValue;
}