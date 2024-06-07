export const nextTime = (data) => {
  let newDate;

  // Convert the frequency to an integer
  const freq = parseInt(data.freq, 10);

  const givenDate = new Date(data.time);
  const givenTime = givenDate.getTime();
  const currentTime = new Date().getTime();

  if (givenTime > currentTime) {
    // If the given time is in the future, return it as is
    return givenDate;
  }

  // Calculate the timezone offset in milliseconds
  const timezoneOffset = givenDate.getTimezoneOffset() * 60000;

  switch (data.repeatMode) {
    case "DAY": {
      const dayInMs = 86400000;
      newDate = new Date(givenTime + freq * dayInMs - timezoneOffset);
      break;
    }
    case "WEEK": {
      const weekInMs = 604800000;
      newDate = new Date(givenTime + freq * weekInMs - timezoneOffset);
      break;
    }
    case "MONTH": {
      newDate = new Date(
        givenDate.getUTCFullYear(),
        givenDate.getUTCMonth() + freq,
        givenDate.getUTCDate(),
        givenDate.getUTCHours(),
        givenDate.getUTCMinutes(),
        givenDate.getUTCSeconds(),
      );
      break;
    }
    case "YEAR": {
      newDate = new Date(
        givenDate.getUTCFullYear() + freq,
        givenDate.getUTCMonth(),
        givenDate.getUTCDate(),
        givenDate.getUTCHours(),
        givenDate.getUTCMinutes(),
        givenDate.getUTCSeconds(),
      );
      break;
    }
    default:
      throw new Error("Invalid repeat mode");
  }

  // Adjust the date back to the original timezone
  return new Date(newDate.getTime() + timezoneOffset);
};

export const prevTime = (data) => {
  let prevDate;

  // Convert the frequency to an integer
  const freq = parseInt(data.freq, 10);

  const givenDate = new Date(data.time);
  const givenTime = givenDate.getTime();
  const currentTime = new Date().getTime();

  // Calculate the timezone offset in milliseconds
  const timezoneOffset = givenDate.getTimezoneOffset() * 60000;

  switch (data.repeatMode) {
    case "DAY": {
      const dayInMs = 86400000;
      prevDate = new Date(givenTime - freq * dayInMs + timezoneOffset);
      break;
    }
    case "WEEK": {
      const weekInMs = 604800000;
      prevDate = new Date(givenTime - freq * weekInMs + timezoneOffset);
      break;
    }
    case "MONTH": {
      prevDate = new Date(
        givenDate.getUTCFullYear(),
        givenDate.getUTCMonth() - freq,
        givenDate.getUTCDate(),
        givenDate.getUTCHours(),
        givenDate.getUTCMinutes(),
        givenDate.getUTCSeconds(),
      );
      break;
    }
    case "YEAR": {
      prevDate = new Date(
        givenDate.getUTCFullYear() - freq,
        givenDate.getUTCMonth(),
        givenDate.getUTCDate(),
        givenDate.getUTCHours(),
        givenDate.getUTCMinutes(),
        givenDate.getUTCSeconds(),
      );
      break;
    }
    default:
      throw new Error("Invalid repeat mode");
  }

  // If the calculated previous time is in the future, return the current time
  if (prevDate.getTime() > currentTime) {
    return new Date(currentTime);
  }

  // Adjust the date back to the original timezone
  return new Date(prevDate.getTime() + timezoneOffset);
};
