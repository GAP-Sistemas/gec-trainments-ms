import shortid from 'shortid';
import jsReportLambda from '../../utils/jsreport-lambda';
import moment from 'moment';

interface IEmployee {
  name: string;
  cpf: string;
  signature: string;
}

interface IInstructor {
  name: string;
  signature: string;
}

interface ITrainment {
  _id: string;
  expirationDate: string;
  documentEmployee: string;
  site: string;
  workload: string;
  scheduledTime: string;
  description: string;
  instructors: IInstructor[];
}

interface ITenant {
  name: string;
  url: string;
}

export interface IData {
  employee: IEmployee;
  trainment: ITrainment;
  tenant: ITenant;
}

export const generatePdf = async (dataToCertificate: IData) => {

  const shortIdJSReport = process.env.JSREPORT_CERTIFICATE_SHORT_ID
  const bodyBuffer = await jsReportLambda(shortIdJSReport, dataToCertificate)

  const name = `${dataToCertificate.employee.name}-certificate-${moment().format('DD-MM-YYYY HH:mm')}-${shortid.generate()}.pdf`
  const folder = 'certificates'

  return {
    bodyBuffer,
    name,
    folder
  }
}
