import { Leads } from "../models/leads.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createLeads } from "../utils/createLeads";
import { Employee } from "../models/employee.model.js";

const addLead = async (req, res) => {
  try {
    console.log(req.body);
    const {
      clientName,
      projectInfo,
      status,
      source,
      email,
      phoneNumber,
      dealValue,
    } = req.body;

    if (
      [
        clientName,
        projectInfo,
        status,
        source,
        email,
        phoneNumber,
        dealValue,
      ].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const employeeID = req.context.employeeID;
    console.log(employeeID);

    const leads = await createLeads({
      assignedTo: employeeID,
      clientName: clientName,
      projectInfo: projectInfo,
      status: status,
      source: source,
      email: email,
      phoneNumber: phoneNumber,
      dealValue: dealValue,
    });

    console.log(leads);

    if (!leads) {
      throw new APIError(409, "Error while creating new lead");
    }

    res.status(200).json(new APIResponse(200, leads, "Leads saved"));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const employeeID = req.context.employeeID;
    Employee.aggregate([
      {
        $match: {
          _id: employeeID,
        },
      },
      {
        $graphLookup: {
          from: "employees",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "reportingTo",
          depthField: "level",
          as: "subordinates",
        },
      },
    ]);

    const accessibleUsers = [employeeID, ...subordinates.map((emp) => emp._id)];

    if (accessibleUsers.length === 0) {
      throw new APIError(409, "Accessible user not found");
    }

    const leads = await Lead.find({
      assignedTo: { $in: accessibleUsers },
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const leadsItem = leads.length;

    if (leadsItem === 0) {
      throw new APIError(409, "No leads available");
    }

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          {
            leads,
            pagination: {
              page,
              limit,
              totalPages: Math.ceil(leadsItem / limit),
            },
          },
          "Leads fetched"
        )
      );
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addLead, getLeads };
