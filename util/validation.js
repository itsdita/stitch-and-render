function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
}

function userDetailsAreValid(
  email,
  password,
  confirmEmail,
  confirmPassword,
  username
) {
  return (
    !isEmpty(username) &&
    userCredentialsAreValid(email, password) &&
    confirmEmail &&
    confirmEmail.includes("@") &&
    confirmPassword &&
    confirmPassword.trim().length >= 6 &&
    email === confirmEmail &&
    password === confirmPassword
  );
}

module.exports = userDetailsAreValid;
