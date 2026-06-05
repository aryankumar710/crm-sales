import { Leads } from "../models/leads.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createLeads } from "../utils/createLeads";


const addLead = async (req, res) => {
  try {
    console.log(req.body)
    const { clientName, projectInfo, status, source, email, phoneNumber, dealValue } = req.body;

    if (
      [clientName, projectInfo, status, source, email, phoneNumber, dealValue].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const employeeID = req.context.employeeID
    console.log(employeeID)

    const leads = await createLeads({
        assignedTo: employeeID,
        clientName: clientName,
        projectInfo: projectInfo,
        status: status,
        source: source,
        email: email,
        phoneNumber: phoneNumber,
        dealValue: dealValue
    }) 

    console.log(leads)

    if(!leads){
        throw new APIError(409, "Error while creating new lead");
    }

    res.status(200).json(new APIResponse(200, leads, "Leads saved"))

  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export {addLead}
