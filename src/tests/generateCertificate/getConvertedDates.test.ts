import { describe, expect, test } from '@jest/globals';
import { getConvertedDates } from '../../handlers/generateCertificate/getConvertedDates';

describe('getConvertedDates', () => {
  test('should return the correct formatted dates for a single-day interval with different hours', () => {
    const scheduledTime = [
      { from: new Date('2023-06-29T10:00:00.000+00:00'), to: new Date('2023-06-29T15:30:00.000+00:00') },
    ];
    const expectedString = '29/jun/2023';
    const result = getConvertedDates(scheduledTime);
    expect(result).toEqual(expectedString);
  });

  test('should return the correct formatted dates for a two-day interval with different hours', () => {
    const scheduledTime = [
      { from: new Date('2023-06-29T17:00:00.000+00:00'), to: new Date('2023-06-30T09:30:00.000+00:00') },
    ];
    const expectedString = '29/jun/2023 até 30/jun/2023';
    const result = getConvertedDates(scheduledTime);
    expect(result).toEqual(expectedString);
  });

  test('should return the correct formatted dates for a multi-day interval with different hours', () => {
    const scheduledTime = [
      { from: new Date('2023-06-29T08:00:00.000+00:00'), to: new Date('2023-07-01T18:30:00.000+00:00') },
    ];
    const expectedString = '29/jun/2023 até 01/jul/2023';
    const result = getConvertedDates(scheduledTime);
    expect(result).toEqual(expectedString);
  });

  test('should return the correct formatted dates for multiple intervals with different hours', () => {
    const scheduledTime = [
      { from: new Date('2023-07-01T12:00:00.000+00:00'), to: new Date('2023-07-01T17:30:00.000+00:00') },
      { from: new Date('2023-06-29T10:00:00.000+00:00'), to: new Date('2023-06-29T15:30:00.000+00:00') },
      { from: new Date('2023-06-29T18:00:00.000+00:00'), to: new Date('2023-06-30T09:00:00.000+00:00') },
    ];
    const expectedString = '29/jun/2023 até 01/jul/2023';
    const result = getConvertedDates(scheduledTime);
    expect(result).toEqual(expectedString);
  });
});
