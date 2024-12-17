// otpUtils.js
export const generateOTP = (length = 6) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  )
    .toString()
    .padStart(length, "0");
};

export const validateOTP = (storedOTP, userProvidedOTP) => {
  return storedOTP === userProvidedOTP;
};
