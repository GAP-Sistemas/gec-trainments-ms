
import { ObjectId, Db } from 'mongodb';

interface IFile {
  tenant: ObjectId;
  name: string,
  key: string,
  fileType: string,
  deleted: boolean,
  size:  number,
};

export const populateDatabase = async (db: Db, file: IFile, employeeId: string, trainmentId: string) => {

  const { insertedId } = await db.collection('files').insertOne(file)

  await db.collection('trainments').updateOne(
    {
      _id: new ObjectId(trainmentId),
      "attendance.employee": new ObjectId(employeeId)
    },
    {
      $set: { "attendance.$.certificate": new ObjectId(insertedId) }
    }
  )

  const updateResult = await db.collection("employees").updateOne(
    { 
      _id: new ObjectId(employeeId),
      "documents.trainment": new ObjectId(trainmentId),
    },
    { 
      $push: { "documents.$.files": new ObjectId(insertedId) } 
    }
  );
  return updateResult;
}