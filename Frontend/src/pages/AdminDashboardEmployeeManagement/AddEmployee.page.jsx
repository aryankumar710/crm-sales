//import { createPortal } from "react-dom";
import { Modal } from "../../components/Modals/Modal.component.jsx";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component.jsx";
import { PlainInputField } from "../../components/inputFields/PlainInputfield.jsx";
import { PhoneInputField } from "../../components/InputFields/PhoneInputField.jsx";
import { PasswordInputField } from "../../components/InputFields/PasswordInputField.jsx";
import styles from "../AdminDashboardEmployeeManagement/EmployeeManagement.page.module.css";
import { Dropdown } from "../../components/InputFields/Dropdown.component.jsx";
import { useState } from "react";
//import { useEffect } from "react";
//import { API } from "../../services/axios.js";
import { CrossButton } from "../../components/Buttons/CrossButton.component.jsx";
import {
  useAddEmployeeMutation,
  useGetEmployeesByRoleQuery,
  useGetEmployeesQuery,
  useGetRolesQuery,
} from "../../features/API/api.js";

export const AddEmployee = ({ isOpen, onClose }) => {
  //
  const [roleList, setRoleList] = useState([]);
  const [role, setRole] = useState("");

  const { data: rolesData, isLoading: rolesLoading } = useGetRolesQuery();
  const { data: employeeData, isLoading: employeeLoading } =
    useGetEmployeesQuery({ roleName: role });
  const [addEmployee, { isLoading: addEmployeeLoading, error, isSuccess }] =
    useAddEmployeeMutation();
  const [form, setForm] = useState({
    employeeName: "",
    employeeRole: "",
    employeeEmail: "",
    phoneNumber: "",
    reportingPerson: "",
  });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  // useEffect(() => {
  //   if (isOpen) {
  //     const fetchApi = async () => {
  //       try {
  //         const response = await API.get("/roleNameApi");
  //         setRoleList(response.data.data);
  //       } catch (error) {
  //         console.log(error.response?.data);
  //         console.log(error.message);
  //       }
  //     };
  //     fetchApi();
  //   }
  // }, [isOpen]);

  // useEffect(() => {

  //   const fetchApi = async () => {
  //     try {
  //       const response = await API.get("/roleSelectionEmployeeList", {
  //         params: { roleName: role.reportingRoleName },
  //       });
  //       setEmployeeList(response.data.data);
  //     } catch (error) {
  //       console.log(error.response?.data);
  //       console.log(error.message);
  //     }
  //   };
  //   fetchApi();
  // }, [role.reportingRoleName]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const postApi = async () => {
      try {
        const response = await addEmployee(form).unwrap();
        onClose();
      } catch (error) {
        console.log(error);
      }
    };
    postApi();
  }

  return (
    <Modal isOpen={isOpen}>
      <form
        method="post"
        className={styles.whiteBackground}
        onSubmit={handleSubmit}
      >
        <div className={styles.formText}>
          <h1>Add Employee</h1>
          <CrossButton onClick={() => onClose()} />
        </div>

        <div className={styles.formBox}>
          <PlainInputField
            onChange={onChange}
            type="text"
            placeholder="e.g Aryan Kumar"
            name="employeeName"
            label="Employee Name*"
            required={true}
          />

          <PlainInputField
            onChange={onChange}
            type="email"
            placeholder="e.g employee@gmail.com"
            name="employeeEmail"
            label="Employee Email*"
            required={true}
          />

          <PhoneInputField
            onChange={onChange}
            type={"tel"}
            name={"phoneNumber"}
            placeholder={"e.g 82993146XX"}
            label={"Phone Number*"}
            required={true}
          />

          <Dropdown
            name={"roleName"}
            label={"Select Employee Role"}
            onChange={(e) => setForm({ ...form, employeeRole: e.target.value })}
            value={form.employeeRole}
            options={rolesData?.data || []}
          />

          <Dropdown
            name={"roleName"}
            label={"Select Reporting Role"}
            onChange={(e) => setRole(e.target.value)}
            value={role}
            options={rolesData?.data || []}
          />

          <Dropdown
            name={"employeeName"}
            label={"Select Reporting Person"}
            onChange={(e) =>
              setForm({ ...form, reportingPerson: e.target.value })
            }
            value={form.reportingPerson}
            options={employeeData?.data?.getList || []}
          />
        </div>

        <PrimaryButton type={"submit"} text={"Add Employee"}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 12L19.5 12M19.5 12L13.875 6M19.5 12L13.875 18"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </PrimaryButton>
      </form>
    </Modal>
  );
};
