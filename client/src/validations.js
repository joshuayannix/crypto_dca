import dayjs from "dayjs";
const coindeskStart = "2010-07-17";
// const coinTypes = [
//   "Bitcoin",
//   "Ethereum",
//   "Ripple",
//   "Litecoin",
//   "Monero",
//   "Dogecoin"
// ];

export const _validateAmount = (amount) => {
  let error = null;
  if (Number.isNaN(Number(amount))) error = "Amount must be a number";
  if (amount < 1) error = "Amount cannot be less than 1";
  return error;
}

export const _validateFrequency = (freq) => {
  let error = null;
  if (freq < 1) error = "Frequency cannot be less than 1";

  if (!Number.isInteger(Number(freq))) error = "Frequency must be an integer";
  return error;
}

export const _validateStartDate = (startDate) => {
  let error = null;
  if (!startDate.isValid()) error = "Start Date is not a valid date";

  if (startDate.isBefore(dayjs(coindeskStart)))
    error = "Start Date cannot be before 2009-01-12";

  if (startDate.isAfter(dayjs().subtract(1, "day")))
    error = "Start Date cannot be after yesterday";

  return error;
}

export const _validateEndDate = (endDate) => {
  let error = null;

    if (!endDate.isValid()) {
      error = "End Date is not a valid date";
    }

    if (endDate.isBefore(dayjs(coindeskStart).add(1, "day")))
      error = "End Date cannot be before 2009-01-13";

    if (endDate.isAfter(dayjs())) error = "End Date cannot be after today";

    return error;
}

export const _validateDatesOverlap = (duration) => {
  if (duration < 1) return "The start date has to be before the end date";
}

export const _validateFreqOverDuration = (freq, duration) => {
  return freq >= duration;
}

export const _validateCoinType = (coinType) => {
  if (!coinType) return "Must have a coin type";

  //if (!coinTypes.find(item => item == coinType))
    return "Coin is currently not supported";
}


