import { Leads } from "../models/leads.model.js";
import { APIError } from "../utils/APIerror.js";

const newLead = async (req, res) => {
  try {
    const { clientName, projectInfo, status, source } = req.body;

    if (
      [clientName, projectInfo, status, source].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const employeeID = req.context.employeID

    const createdlead = await createdlead({
        employeeID: employeeID,
        clientName: clientName,
        projectInfo: projectInfo,
        status: status,
        source: source
    }) 

    if(!createdlead){
        throw new APIError(409, "Error while creating new lead");
    }


  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export {newLead}
