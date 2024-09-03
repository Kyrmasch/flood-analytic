export const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch (error) {
    console.error("Ошибка при проверке срока действия токена:", error);
    return true;
  }
};
