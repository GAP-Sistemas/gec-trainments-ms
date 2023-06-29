export const  getConvertedTime = (tempoTotalEmMinutos: number)=>  {
  const minutosPorHora = 60;

  const horas = Math.floor(tempoTotalEmMinutos / minutosPorHora);
  const minutos = tempoTotalEmMinutos % minutosPorHora;

  let result = ``
  
  if (minutos !== 0 && horas !== 0) {
    result += `${horas} horas e ${minutos} minutos.`
  } else if (horas !== 0) {
    result += `${horas} horas.`
  } else if (minutos !== 0) {
    result += `${minutos} minutos.`
  } else {
    result += `não especificada.`
  }

  return result;
}
