import {describe, expect, test, jest} from '@jest/globals';
import { ObjectId, Db } from 'mongodb';
import { populateDatabase } from '../../handlers/generateCertificate/populateDatabase';

describe('populateDatabase', () => {
  test('should insert file and update employee documents', async () => {
    const file = {
      tenant: new ObjectId(),
      name: 'test.pdf',
      key: 'test1234',
      fileType: 'pdf',
      deleted: false,
      size: 1000,
    };
    const employeeId = new ObjectId().toHexString();
    const trainmentId = new ObjectId().toHexString();

    const mockCollection = {
      insertOne: jest.fn(() => ({ insertedId: "5d49e06505d1aa3ed4fb4964"})),
      updateOne: jest.fn(),
    };
    const mockDb = ({
      collection: jest.fn(() => mockCollection),
    } as unknown) as Db;

    await populateDatabase(mockDb, file, employeeId, trainmentId);


    expect(mockCollection.insertOne).toHaveBeenCalledWith(file);

    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      {
        _id: new ObjectId(employeeId),
        'documents.trainment': new ObjectId(trainmentId),
      },
      {
        $push: { 'documents.$.files': new ObjectId("5d49e06505d1aa3ed4fb4964") },
      },
    );
  });
});
