import {describe, expect, test } from '@jest/globals';
import { signAndStructureData } from '../../handlers/generateCertificate/signAndStructureData';

describe('signAndStructureData', () => {
  test('should return the expected data', async () => {
    const trainmentInfo = {
      _id: '1',
      expirationDate: new Date('2022-05-03'),
      documentEmployee: [{ name: 'document' }],
      site: [{ name: 'site' }],
      scheduledTime: { to: new Date('2022-06-03'), from: new Date('2022-06-01') },
      description: 'description',
      attendance: [{
        employee: [{ _id: '1', name: 'employee', cpf: '123.456.789-00' }],
        approved: true,
        signature: [{ key: 'signature-key' }]
      }],
      instructors: [{
        name: 'instructor',
        signature: [{ key: 'signature-key' }]
      }],
      tenant: [{ _id: '1', name: 'tenant', photo: [{ key: 'photo-key' }] }]
    };

    const getFakeSignedUrl = () => 'http://fake-url'

    const result = await signAndStructureData(trainmentInfo, getFakeSignedUrl);

    expect(result).toEqual({
      employee: {
        name: 'employee',
        cpf: '123.456.789-00',
        signature: 'http://fake-url'
      },
      trainment: {
        _id: '1',
        expirationDate: 'Válido até 02/mai/2022',
        documentEmployee: 'document',
        site: 'site',
        workload: '48 horas',
        scheduledTime: '31/mai/2022 até 02/jun/2022',
        description: 'description',
        instructors: [{
          name: 'instructor',
          signature: 'http://fake-url'
        }]
      },
      tenant: {
        name: 'tenant',
        url: 'http://fake-url'
      }
    });
  });
});