import {describe, expect, test } from '@jest/globals';
import { signAndStructureData } from '../../handlers/generateCertificate/signAndStructureData';

describe('signAndStructureData', () => {
  test('should return the expected data', async () => {
    const trainmentInfo = {
      _id: '1',
      expirationDate: new Date('2023-05-02T06:30:00.000Z'),
      documentEmployee: [{ name: 'document' }],
      site: [{ name: 'site' }],
      scheduledTime: [{ to: new Date('2023-05-02T06:30:00.000Z'), from: new Date('2023-05-02T06:00:00.000Z') }],
      workload: 30,
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
        expirationDate: 'Válido até 02/mai/2023',
        documentEmployee: 'document',
        site: 'site',
        workload: '30 minutos.',
        scheduledTime: '02/mai/2023',
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