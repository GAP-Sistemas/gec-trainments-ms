import moment from "moment";

export const getExpiration = (expirationDate: Date) => {
  let text = "Validade indeterminada"
  if (expirationDate) {
      const newExpirationDate = moment(expirationDate).format('DD/MMM/YYYY');
      text = `Válido até ${newExpirationDate}`
  }
  return text;
}