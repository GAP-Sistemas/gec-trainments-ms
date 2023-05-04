import {describe, expect, test} from '@jest/globals';
import { getWorkload } from '../../handlers/generateCertificate/getWorkload';

describe('getWorkload', () => {
  test('should return "0 horas" if scheduledTime.to and scheduledTime.from are the same', () => {
    const scheduledTime = { to: new Date('2022-05-04T08:00:00.000Z'), from: new Date('2022-05-04T08:00:00.000Z') };
    const workload = getWorkload(scheduledTime);
    expect(workload).toBe('não especificada.');
  });

  test('should return the correct workload for a single hour', () => {
    const scheduledTime = { to: new Date('2022-05-04T09:00:00.000Z'), from: new Date('2022-05-04T08:00:00.000Z') };
    const workload = getWorkload(scheduledTime);
    expect(workload).toBe('1 horas.');
  });

  test('should return the correct workload for multiple hours', () => {
    const scheduledTime = { to: new Date('2022-05-04T12:30:00.000Z'), from: new Date('2022-05-04T08:00:00.000Z') };
    const workload = getWorkload(scheduledTime);
    expect(workload).toBe('4 horas e 30 minutos.');
  });
});