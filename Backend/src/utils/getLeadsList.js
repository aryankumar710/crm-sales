import { Employee } from "../models/employee.model.js";
import { Leads } from "../models/leads.model.js";

const getLeadsList = async (employeeID) => {
    
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

    console.log(employee)

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

    return {
        leads, totalLeads
    }

}

export {getLeadsList}