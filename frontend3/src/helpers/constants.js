export const EMAIL_REGEX =
  /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)$/;

// Minimum eight characters, at least one uppercase letter,
// one lowercase letter, one number and one special character:
export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const STATUS_TYPE = Object.freeze({
  idle: "idle",
  loading: "loading",
  success: "success",
  error: "error",
});

export const Colors = {
  primary: "#126180",
  background: "#fff",
  textWhite: "#fff",
  textBlack: "#000000DE",
  darkPrimary: "#0f506a",
  red: "#D32F2F",
};
