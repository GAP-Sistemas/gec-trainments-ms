import {describe, expect, test} from '@jest/globals';
import { getExpiration } from '../../handlers/generateCertificate/getExpiration';

describe('getExpiration function', () => {
  test('returns "Validade indeterminada" when expirationDate is undefined', () => {
    const expirationDate: Date | undefined = undefined;
    expect(getExpiration(expirationDate)).toEqual('Validade indeterminada');
  });

  test('returns a valid expiration date string when expirationDate is a Date object', () => {
    const expirationDate = new Date('2023-05-31');
    expect(getExpiration(expirationDate)).toMatch("Válido até 30/May/2023");
  });
});
