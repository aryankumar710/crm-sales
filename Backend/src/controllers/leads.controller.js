import { Leads } from "../models/leads.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createLeads } from "../utils/createLeads.js";
import { Employee } from "../models/employee.model.js";
import { getLeadsList } from "../utils/getLeadsList.js";

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

const editLead = async (req, res) => {
  try {
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

    const [employee] = await Employee.aggregate([
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

    if (!employee) {
      throw new APIError(404, "Employee not found");
    }

    const accessibleUsers = [
      employeeID,
      ...employee.subordinates.map((emp) => emp._id),
    ];

    const findLead = await Leads.findOne({
      clientName: clientName,
      assignedTo: { $in: accessibleUsers },
    });

    if (!findLead) {
      throw new APIError(400, "Can't Find Lead");
    }

    findLead.clientName = clientName;
    findLead.status = status;
    findLead.source = source;
    findLead.source = source;
    findLead.email = email;
    findLead.phoneNumber = phoneNumber;
    findLead.dealValue = dealValue;

    await findLead.save();

    res
      .status(200)
      .json(new APIResponse(200, findLead, "Lead details updated"));
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

    const [employee] = await Employee.aggregate([
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

    console.log(employee);

    if (!employee) {
      throw new APIError(404, "Employee not found");
    }

    const accessibleUsers = [
      employeeID,
      ...employee.subordinates.map((emp) => emp._id),
    ];

    const totalLeads = await Leads.countDocuments({
      assignedTo: { $in: accessibleUsers },
    });

    const leads = await Leads.find({
      assignedTo: { $in: accessibleUsers },
    });

    console.log(leads);

    res.status(200).json(
      new APIResponse(
        200,
        {
          leads,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalLeads / limit),
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

const getFunnelData = async (req, res) => {
  try {
    const employeeID = req.context.employeeID;
    console.log(employeeID);
    const { leads, totalLeads } = await getLeadsList(employeeID);
    const suspect = leads.filter((lead) => {
      return lead.status === "Suspect";
    }).length;

    const prospect = leads.filter((lead) => {
      return lead.status === "Prospect";
    }).length;

    const demo = leads.filter((lead) => {
      return lead.status === "Demo";
    }).length;

    const proposal = leads.filter((lead) => {
      return lead.status === "Proposal";
    }).length;

    const negotiation = leads.filter((lead) => {
      return lead.status === "Negotiation";
    }).length;

    const leadsWon = leads.filter((lead) => {
      return lead.status === "Decision (Won)";
    }).length;
    console.log(leadsWon);

    const leadsLost = leads.filter((lead) => {
      return lead.status === "Decision (Lost)";
    }).length;
    console.log(leadsLost);

    const decision = leadsLost + leadsWon;
    console.log(decision);
    const leadsInProgress = totalLeads - decision;
    console.log(leadsInProgress);

    res.status(200).json(
      new APIResponse(
        200,
        {
          suspect,
          prospect,
          demo,
          proposal,
          negotiation,
          decision,
          totalLeads,
          leadsInProgress,
          leadsWon,
          leadsLost,
        },
        "Funnel Data Fetched"
      )
    );
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addLead, getLeads, getFunnelData, editLead };
