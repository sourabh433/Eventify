export const getErrorMessage = (err) => {
  const status = err.response?.status;

  if (err.needsVerification) {
    return "Please verify your account using the OTP sent to your email.";
  }

  if (status === 404) {
    return "User not found. Please check your email.";
  }

  if (status === 401) {
    return "Incorrect password. Please try again.";
  }

  if (status === 400) {
    return "Invalid input. Please check your details.";
  }

  return "Something went wrong. Please try again.";
};