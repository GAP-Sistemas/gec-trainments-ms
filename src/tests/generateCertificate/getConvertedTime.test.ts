import { describe, expect, test } from '@jest/globals';
import { getConvertedTime } from '../../handlers/generateCertificate/getConvertedTime';

describe('getConvertedTime', () => {
  test('should return the correct time with hours and minutes', () => {
    const tempoTotalEmMinutos = 130; // 2 horas e 10 minutos
    const expectedTime = '2 horas e 10 minutos.';
    const result = getConvertedTime(tempoTotalEmMinutos);
    expect(result).toEqual(expectedTime);
  });

  test('should return the correct time with only hours', () => {
    const tempoTotalEmMinutos = 120; // 2 horas
    const expectedTime = '2 horas.';
    const result = getConvertedTime(tempoTotalEmMinutos);
    expect(result).toEqual(expectedTime);
  });

  test('should return the correct time with only minutes', () => {
    const tempoTotalEmMinutos = 1; // 1 minuto
    const expectedTime = '1 minutos.';
    const result = getConvertedTime(tempoTotalEmMinutos);
    expect(result).toEqual(expectedTime);
  });

  test('should return "não especificada." for 0 minutes', () => {
    const tempoTotalEmMinutos = 0;
    const expectedTime = 'não especificada.';
    const result = getConvertedTime(tempoTotalEmMinutos);
    expect(result).toEqual(expectedTime);
  });
});
