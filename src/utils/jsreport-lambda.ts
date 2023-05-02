import { config } from 'dotenv';

config();


const jsReportLambda = async (shortIdJSReport: string | undefined, data) => {

  try {
    const client = require("jsreport-client")(process.env.JSREPORT_URL, process.env.JSREPORT_USER, process.env.JSREPORT_PASSWORD);

    const JSReporRender = await client.render({
      template: { shortid: shortIdJSReport},
      data,
    })

    const bodyBuffer = await JSReporRender.body()

    return bodyBuffer

  } catch(e) {
    console.log('e', e)
  }
}

export default jsReportLambda
