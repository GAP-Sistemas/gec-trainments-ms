import { map as asyncMap } from "p-iteration";
import moment from "moment";
import 'moment/locale/pt-br';
import { getWorkload } from "./getWorkload";
import { getExpiration } from "./getExpiration";
import { IData } from "./generatePdf";
import { ITrainment } from "./getTrainment";

interface Instructor {
  name: string;
  signature: { key: string }[];
}[]




export const signAndStructureData = async (trainmentInfo: ITrainment, getSignedUrl: Function): Promise<IData> => {

  const { attendance, tenant, instructors, ...trainmentData } = trainmentInfo

  const instructorsData = async () => {
    const instructorsData = await asyncMap(instructors, async (instructor: Instructor) => ({
      name: instructor?.name ? instructor.name : '',
      signature: instructor?.signature ? await getSignedUrl(instructor?.signature[0]?.key) : '',
    }))
    return instructorsData;
  }
  
  
  const dataCreator = async () =>  {
    const newFrom = moment(trainmentData.scheduledTime.from).locale('pt-br').format('DD/MMM/YYYY');
    const newTo = moment(trainmentData.scheduledTime.to).locale('pt-br').format('DD/MMM/YYYY');
    const scheduledTime = newFrom === newTo ? newFrom : `${newFrom} até ${newTo}`
    const workload = getWorkload(trainmentData.scheduledTime);

    const data =  {
      employee: {
        name: attendance[0]?.employee[0]?.name ? attendance[0].employee[0].name : '',
        cpf: attendance[0]?.employee[0]?.cpf ? attendance[0].employee[0].cpf : '',
        signature: attendance[0]?.signature[0]?.key ? await getSignedUrl(attendance[0].signature[0].key) : '',
      },
      trainment: {
        _id: trainmentData?._id ? trainmentData._id : '',
        expirationDate: trainmentData?.expirationDate ? getExpiration(trainmentData.expirationDate) : '',
        documentEmployee: trainmentData?.documentEmployee[0]?.name ? trainmentData.documentEmployee[0].name : '',
        site: trainmentData?.site[0]?.name ? trainmentData.site[0].name : '',
        workload,
        scheduledTime,
        description: trainmentData?.description ? trainmentData.description : '',
        instructors: instructors.length > 0 ? await instructorsData() : [],
      },
      tenant: {
        name: tenant[0]?.name ? tenant[0].name : '',
        url: tenant[0]?.photo[0]?.key ? await getSignedUrl(tenant[0]?.photo[0]?.key) : '',
      }
    }
    return data;
  }

  const result = await dataCreator()

  return result;
}