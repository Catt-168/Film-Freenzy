export function localStorageSetter(token, user) {
  localStorage.setItem("jwtToken", JSON.stringify(token));
  localStorage.setItem("user", JSON.stringify(user));
}
