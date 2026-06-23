import { Employee } from "../models/employee.model.js";
import { Organisation } from "../models/organisation.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createEmployee } from "../utils/createEmployee.js";
import crypto from "crypto";
import { sendInviteEmail } from "../utils/invitationToken.js";
import { Role } from "../models/roles.model.js";
import { Leads } from "../models/leads.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const createNewEmployee = async (req, res) => {
  try {
    const {
      employeeName,
      employeeRole,
      employeeEmail,
      phoneNumber,
      reportingPerson,
    } = req.body;

    //    console.log(req.body)

    if (
      [
        employeeName,
        employeeRole,
        employeeEmail,
        phoneNumber,
        reportingPerson,
      ].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const existingEmployee = await Employee.findOne({
      employeeEmail: employeeEmail,
    });
    //   console.log(existingEmployee)

    if (existingEmployee) {
      throw new APIError(409, "Employee with same email exist");
    }

    const organisationID = req.context.organisationID;

    const generateInviteToken = await crypto.randomBytes(32).toString("hex");

    const employeeRoleId = await Role.findOne({
      roleName: employeeRole,
      organisationID: organisationID,
    }).select("_id");
    //  console.log(employeeRoleId)

    const reportingPersonId = await Employee.findOne({
      employeeName: reportingPerson,
      organisationID: organisationID,
    }).select("_id");
    //  console.log(reportingPersonId)

    const employeeData = await createEmployee({
      organisationID: organisationID,
      employeeName: employeeName,
      employeeEmail: employeeEmail,
      countryCode: "+91",
      role: employeeRoleId._id,
      reportingPerson: reportingPersonId._id,
      phoneNumber: phoneNumber,
      invitationToken: generateInviteToken,
    });

    // console.log(employeeData)

    const link = `${process.env.CORS_ORIGIN}/set-password?token=${generateInviteToken}`;

    const sendEmail = sendInviteEmail(employeeEmail, link);

    if (!employeeData) {
      throw new APIError(500, "Something went wrong while adding employee");
    }

    res
      .status(200)
      .json(new APIResponse(200, employeeData, "Employee created"));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const employeeData = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const organisationID = req.context.organisationID;
    const roleType = req.context.roleType;

    if (roleType !== "HR Admin") {
      throw new APIError(409, "Invalid Access");
    }
    let totalEmployees = await Employee.countDocuments({
      organisationID: organisationID,
    });
    let getList = "";

    if (req.query.roleName) {
      const role = await Role.findOne({
        roleName: req.query.roleName,
        organisationID: organisationID,
      });
      console.log(role);
      if (!role) {
        throw new APIError(
          409,
          "Role not found while fetch api for role selection employee list"
        );
      }

      totalEmployees = await Employee.countDocuments({
        organisationID: organisationID,
        role: role._id,
      });

      getList = await Employee.find({
        role: role._id,
        organisationID: organisationID,
      })
        .populate("role reportingPerson")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      if (getList.length === 0) {
        throw new APIError(409, "Employee List not fetched");
      }
    } else {
      getList = await Employee.find({ organisationID: organisationID })
        .populate("role reportingPerson")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();
    }

    res.status(200).json(
      new APIResponse(
        200,
        {
          getList,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalEmployees / limit),
          },
        },
        "Employee data fetched"
      )
    );
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTeamData = async (req, res) => {
  try {
    const organisationID = req.context.organisationID;
    const employeeID = req.context.employeeID;
    console.log(employeeID);
    const [employees] = await Employee.aggregate([
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
          connectToField: "reportingPerson",
          depthField: "level",
          as: "subordinates",
        },
      },
    ]);

    console.log(employees);

    if (!employees) {
      throw new APIError(409, "No employees found");
    }

    const accessibleUsers = [
      employeeID,
      ...employees.subordinates.map((emp) => emp._id),
    ];

    const fetchEmployees = await Employee.find({
      _id: { $in: accessibleUsers },
    })
      .populate("role reportingPerson")
      .select("-password -refreshToken");

    // console.log(fetchEmployees)

    const fetchLeads = await Leads.find({
      assignedTo: {
        $in: accessibleUsers,
      },
    });

    // console.log(fetchLeads)

    const dataSet = {};

    fetchEmployees.forEach((emp) => {
      dataSet[emp._id.toString()] = {
        employeeDetail: emp,
        children: [],
        ownLeads: [],
      };
    });

    fetchLeads.forEach((lead) => {
      const id = lead.assignedTo.toString();
      if (dataSet[id]) {
        dataSet[id].ownLeads.push(lead);
      }
    });

    fetchEmployees.forEach((emp) => {
      if (emp.reportingPerson) {
        const managerId = emp.reportingPerson._id.toString();

        if (dataSet[managerId]) {
          dataSet[managerId].children.push(dataSet[emp._id.toString()]);
        }
      }
    });

    const TeamsData = (data) => {
      let totalLeads = data.ownLeads.length;

      let totalPipelineValue = data.ownLeads.reduce(
        (sum, lead) => sum + Number(lead.dealValue || 0),
        0
      );

      let countWonLeads = data.ownLeads.filter(
        (lead) => lead.status === "Decision (Won)"
      ).length;

      let countLostLeads = data.ownLeads.filter(
        (lead) => lead.status === "Decision (Lost)"
      ).length;

      for (const child of data.children) {
        const childData = TeamsData(child);

        totalLeads += childData.totalLeads;
        totalPipelineValue += childData.totalPipelineValue;
        countWonLeads += childData.countWonLeads;
        countLostLeads += childData.countLostLeads;
      }

      data.metrics = {
        totalLeads,
        totalPipelineValue,
        countWonLeads,
        countLostLeads,
      };

      return data.metrics;
    };

    const root = dataSet[employeeID.toString()];

    TeamsData(root);

    const result = Object.values(dataSet).map((e) => ({
      employeeDetail: e.employeeDetail,
      metrics: e.metrics,
    }));

    console.log(result);

    res
      .status(200)
      .json(new APIResponse(200, result, "Team fetched successfully"));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfileData = async (req, res) => {
  try {
    const organisationID = req.context.organisationID;
    const employeeID = req.context.employeeID;

    const [employees] = await Employee.aggregate([
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
          connectToField: "reportingPerson",
          depthField: "level",
          as: "subordinates",
        },
      },
    ]);

    if (!employees) {
      throw new APIError(409, "No employees found");
    }

    const accessibleUsers = [
      employeeID,
      ...employees.subordinates.map((emp) => emp._id),
    ];

    const fetchEmployees = await Employee.find({
      _id: { $in: accessibleUsers },
    })
      .populate("role reportingPerson")
      .select("-password -refreshToken");

    const fetchLeads = await Leads.find({
      assignedTo: {
        $in: accessibleUsers,
      },
    });

    const dataSet = {};

    fetchEmployees.forEach((emp) => {
      dataSet[emp._id.toString()] = {
        employeeDetail: emp,
        children: [],
        ownLeads: [],
      };
    });

    fetchLeads.forEach((lead) => {
      const id = lead.assignedTo.toString();
      if (dataSet[id]) {
        dataSet[id].ownLeads.push(lead);
      }
    });

    fetchEmployees.forEach((emp) => {
      if (emp.reportingPerson) {
        const managerId = emp.reportingPerson._id.toString();

        if (dataSet[managerId]) {
          dataSet[managerId].children.push(dataSet[emp._id.toString()]);
        }
      }
    });

    const TeamsData = (data) => {
      let totalLeads = data.ownLeads.length;

      let totalPipelineValue = data.ownLeads.reduce(
        (sum, lead) => sum + Number(lead.dealValue || 0),
        0
      );

      let countWonLeads = data.ownLeads.filter(
        (lead) => lead.status === "Decision (Won)"
      ).length;

      let countLostLeads = data.ownLeads.filter(
        (lead) => lead.status === "Decision (Lost)"
      ).length;

      for (const child of data.children) {
        const childData = TeamsData(child);

        totalLeads += childData.totalLeads;
        totalPipelineValue += childData.totalPipelineValue;
        countWonLeads += childData.countWonLeads;
        countLostLeads += childData.countLostLeads;
      }

      data.metrics = {
        totalLeads,
        totalPipelineValue,
        countWonLeads,
        countLostLeads,
      };

      return data.metrics;
    };

    const root = dataSet[employeeID.toString()];

    TeamsData(root);

    const result = dataSet[employeeID.toString()];

    console.log(result);

    res
      .status(200)
      .json(new APIResponse(200, result, "Team fetched successfully"));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfileData = async (req, res) => {
  try {
    console.log(req.body);
    const {
      employeeName,
      employeeEmail,
      phoneNumber,
      oldPassword,
      newPassword,
    } = req.body;

    if (
      [employeeName, employeeEmail, phoneNumber, oldPassword, newPassword].some(
        (field) => {
          return field?.trim() === "";
        }
      )
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const employeeID = req.context.employeeID;

    const employee = await Employee.findOne({ _id: employeeID });
    console.log(employee);

    if (!employee) {
      throw new APIError(409, "No employee found");
    }

    const passwordVerification = await employee.isPasswordCorrect(oldPassword);
    console.log(passwordVerification);

    if (passwordVerification === false) {
      throw new APIError(401, "Password Incorrect");
    }

    const compareOldAndNewPassword =
      await employee.comparePasswords(newPassword);
    console.log(compareOldAndNewPassword);

    if (compareOldAndNewPassword === true) {
      throw new APIError(409, "New and old passwords cannot be same");
    }

    employee.employeeName = employeeName;
    employee.employeeEmail = employeeEmail;
    employee.phoneNumber = phoneNumber;
    employee.password = newPassword;

    await employee.save();
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeProfilePhoto = async (req, res) => {
  try {
    const photoPath = req.file.path
    const organisationID = req.context.organisationID
    const organisation = await Organisation.findOne({_id: organisationID})
    const employee = req.context.employee
    let profile = ""
    if(employee.profilePhoto === null || undefined){
      profile = await uploadOnCloudinary(photoPath, organisation)
      if(!profile.url) {
        throw new APIError(409, "Profile photo is not uploaded properly");
      }
      employee.profilePhoto = profile.url
      employee.profilePhotoPublicId = profile.public_id

      await employee.save()
    }else{
      const toBeDeletedPhoto = employee.profilePhotoPublicId
      const deletingPhoto = await deleteFromCloudinary(toBeDeletedPhoto)
      profile = await uploadOnCloudinary(photoPath, organisation)
      if(!profile.url) {
        throw new APIError(409, "Profile photo is not uploaded properly");
      }
      employee.profilePhoto = profile.url
      employee.profilePhotoPublicId = profile.public_id
      await employee.save()
    }

    res.status(200).json(new APIResponse(200, employee.profilePhoto, "Photo changed successfully"))
  } catch (error) {
     res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
}

export {
  createNewEmployee,
  employeeData,
  getTeamData,
  getProfileData,
  updateProfileData,
  changeProfilePhoto
};
