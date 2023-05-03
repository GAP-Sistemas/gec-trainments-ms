export const  getConvertedTime = (tempoTotalEmMilissegundos: number)=>  {
  const milissegundosPorMinuto = 60000;
  const milissegundosPorHora = 3600000;

  const horas = Math.floor(tempoTotalEmMilissegundos / milissegundosPorHora);
  const minutos = Math.floor((tempoTotalEmMilissegundos % milissegundosPorHora) / milissegundosPorMinuto);

  let result = `${horas} horas`
  
  if (minutos !== 0) {
    result += ` e ${minutos} minutos`
  }

  return result;
}
