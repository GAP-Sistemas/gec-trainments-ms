import {describe, expect, test} from '@jest/globals';
import { getConvertedTime } from '../../handlers/generateCertificate/getConvertedTime';

describe('getConvertedTime', () => {
  test('should return the correct time with hours and minutes', () => {
    const tempoTotalEmMilissegundos = 7800000; // 2 horas e 10 minutos
    const expectedTime = '2 horas e 10 minutos.';
    const result = getConvertedTime(tempoTotalEmMilissegundos);
    expect(result).toEqual(expectedTime);
  });

  test('should return the correct time with only hours', () => {
    const tempoTotalEmMilissegundos = 7200000; // 2 horas
    const expectedTime = '2 horas.';
    const result = getConvertedTime(tempoTotalEmMilissegundos);
    expect(result).toEqual(expectedTime);
  });

  test('should return the correct time with only minutes', () => {
    const tempoTotalEmMilissegundos = 60000; // 1 minuto
    const expectedTime = '1 minutos.';
    const result = getConvertedTime(tempoTotalEmMilissegundos);
    expect(result).toEqual(expectedTime);
  });

  test('should return "0 horas" for 0 milliseconds', () => {
    const tempoTotalEmMilissegundos = 0;
    const expectedTime = 'não especificada.';
    const result = getConvertedTime(tempoTotalEmMilissegundos);
    expect(result).toEqual(expectedTime);
  });
});