export const  getConvertedTime = (tempoTotalEmMilissegundos: number)=>  {
  const milissegundosPorMinuto = 60000;
  const milissegundosPorHora = 3600000;

  const horas = Math.floor(tempoTotalEmMilissegundos / milissegundosPorHora);
  const minutos = Math.floor((tempoTotalEmMilissegundos % milissegundosPorHora) / milissegundosPorMinuto);

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
