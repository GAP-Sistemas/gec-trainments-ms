import { ObjectId, Db } from 'mongodb';

export interface ITrainment {
  _id: string;
  expirationDate: Date;
  documentEmployee: { name: string }[];
  site: { name: string }[];
  scheduledTime: { to: Date; from: Date }[];
  workload: number;
  description: string;
  attendance: {
    employee: { _id: string; name: string; cpf: string }[];
    approved: boolean;
    signature: { key: string }[];
  }[];
  instructors: {
    name: string;
    signature: { key: string }[];
  }[];
  tenant: { _id: string; name: string; photo: { key: string }[] }[];
}

export const getTrainment = async (employeeId: ObjectId, trainmentId: ObjectId, tenantId: ObjectId, db: Db) => {
  const aggregation = [
    {
      $match: { _id: new ObjectId(trainmentId), tenant: tenantId, deleted: false }
    },
    {
      $lookup: { from: "documentemployees", localField: "documentEmployee", foreignField: "_id", as: "documentEmployee" }
    },
    {
      $lookup: { from: "sites", localField: "site", foreignField: "_id", as: "site" }
    },
    {
      $unwind: { path: "$attendance", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: { from: "employees", localField: "attendance.employee", foreignField: "_id", as: "attendance.employee" }
    },
    {
      $match: { "attendance.employee._id": new ObjectId(employeeId) }
    },
    {
      $lookup: { from: "files", localField: "attendance.signature", foreignField: "_id", as: "attendance.signature" }
    },
    {
      $unwind: { path: "$instructors", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: { from: "files", localField: "instructors.signature", foreignField: "_id", as: "instructors.signature" }
    },
    {
      $lookup: { from: "tenants", localField: "tenant", foreignField: "_id", as: "tenant" }
    },
    {
      $unwind: { path: "$tenant", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: { from: "photos", localField: "tenant.photo", foreignField: "_id", as: "tenant.photo" }
    },
    {
      $group: {
        _id: "$_id",
        expirationDate: { $first: "$expirationDate" },
        documentEmployee: { $first: "$documentEmployee" },
        site: { $first: "$site" },
        scheduledTime: { $first: "$scheduledTime" },
        description: { $first: "$description" },
        attendance: { $addToSet: "$attendance" },
        instructors: { $addToSet: "$instructors" },
        tenant: { $addToSet: "$tenant" },
        workload: { $first: '$workload' }
      }
    },
    {
      $project: {
        _id: 1,
        expirationDate: 1,
        workload: 1,
        "documentEmployee.name": 1,
        "site.name": 1,
        "scheduledTime": 1,
        "description": 1,
        "instructors.name": 1,
        "instructors.signature.key": 1,
        "tenant.photo.key": 1,
        "tenant.name": 1,
        "tenant._id": 1,
        "attendance.employee._id": 1,
        "attendance.employee.name": 1,
        "attendance.employee.cpf": 1,
        "attendance.signature.key": 1,
        "attendance.approved": 1,
      }
    }
  ];

  const [trainment]: ITrainment[] = await db
    .collection('trainments')
    .aggregate(aggregation)
    .toArray() as ITrainment[];

  return trainment;
};
