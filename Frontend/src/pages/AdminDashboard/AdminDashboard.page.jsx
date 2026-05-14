import { useEffect, useState } from "react";
import { AnalysisCard } from "../../components/AnalysisCard/AnalysisCard.component.jsx";
import { TertiaryButton } from "../../components/Buttons/TertiaryButton.component.jsx";
import { Header } from "../../components/Header/Header.component.jsx";
import {
  useGetEmployeesQuery,
  useGetMeQuery,
} from "../../features/auth/authAPI.js";
import styles from "../AdminDashboard/AdminDashboard.page.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setEmployee } from "../../features/auth/authSlice.js";
import { Modal } from "../../components/Modals/Modal.component.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component.jsx";
import { PlainInputField } from "../../components/inputFields/PlainInputfield.jsx";
import { LoginRegisterBanner } from "../../components/LoginRegistration/LoginRegisterBanner.component.jsx";
import { PasswordInputField } from "../../components/InputFields/PasswordInputField.jsx";
import { AddEmployee } from "../EmployeeManagement/AddEmployee.page.jsx";
import { API } from "../../services/axios.js";

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const employee = useSelector((state) => state.auth.employee);
  const { data, isLoading } = useGetMeQuery();
  const [page, setPage] = useState(1);
  const limit = 8;
  const { data: getEmployeesData, isLoading: getEmployeesDataLoading } =
    useGetEmployeesQuery({ page, limit });

  //const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    if (data) {
      dispatch(setEmployee(data?.data));
    }
  }, [data]);

  // useEffect(() => {
  //   const fetchEmployeeData = async () => {
  //     try {
  //       const response = await API.get("/employeeData");
  //       console.log(response.data.data);
  //       setEmployeeData(response.data.data);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };
  //   fetchEmployeeData();
  // }, []);

  const [isOpen, setOpen] = useState(false);

  function handleModal() {
    if (isOpen) {
      setOpen(false);
      navigate("/adminDashboard");
    } else {
      setOpen(true);
      navigate("/adminDashboard/addEmployee");
    }
  }

  function handleClose() {
    setOpen(false);
    navigate("/adminDashboard");
  }

  return (
    <>
      <section className="glassEffect">
        <div className="subSection">
          <div className={styles.employeeDashboard}>
            <h1>{employee?.loggedInEmployee?.employeeName}</h1>
            <TertiaryButton onClick={handleModal}>Add Employee</TertiaryButton>
          </div>

          <div className={styles.dashboardData}>
            <AnalysisCard
              content={"Total Employee"}
              data={5000}
              lastMonthData={456}
              comparisonPercentage={"-2%"}
            />
            <AnalysisCard
              content={"Total Employee"}
              data={5000}
              lastMonthData={456}
              comparisonPercentage={"-2%"}
            />
            <AnalysisCard
              content={"Total Employee"}
              data={5000}
              lastMonthData={456}
              comparisonPercentage={"-2%"}
            />
          </div>
          <div className={styles.dashboardData}>
            <AnalysisCard
              content={"Total Employee"}
              data={5000}
              lastMonthData={456}
              comparisonPercentage={"-2%"}
            />
            <AnalysisCard
              content={"Total Employee"}
              data={5000}
              lastMonthData={456}
              comparisonPercentage={"-2%"}
            />
            <AnalysisCard
              content={"Total Employee"}
              data={5000}
              lastMonthData={456}
              comparisonPercentage={"-2%"}
            />
          </div>
        </div>

        <div className="subSection background">
          <div className={styles.slider}>
            <div className={styles.employeeStatusAlignment}>
              <div className={styles.employeeStatus}>
                <div className={styles.greenBox}></div>
                <h6>New Employees</h6>
              </div>
              <div className={styles.employeeStatus}>
                <div className={styles.redBox}></div>
                <h6>Employees Left</h6>
              </div>
            </div>

            <div className={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <svg
                  width="14"
                  height="28"
                  viewBox="0 0 14 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.15017 14.8296L8.75001 21.4294L10.3997 19.7797L4.62467 14.0047L10.3997 8.22974L8.75001 6.58008L2.15017 13.1799C1.93146 13.3987 1.80859 13.6954 1.80859 14.0047C1.80859 14.3141 1.93146 14.6108 2.15017 14.8296Z"
                    fill="black"
                  />
                </svg>
              </button>

              <span>
                {page} / {getEmployeesData?.data?.pagination?.totalPages}
              </span>

              <button
                disabled={
                  page === getEmployeesData?.data?.pagination?.totalPages
                }
                onClick={() => setPage((prev) => prev + 1)}
              >
                <svg
                  width="14"
                  height="28"
                  viewBox="0 0 14 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.8498 14.8296L5.24999 21.4294L3.60033 19.7797L9.37533 14.0047L3.60033 8.22974L5.24999 6.58008L11.8498 13.1799C12.0685 13.3987 12.1914 13.6954 12.1914 14.0047C12.1914 14.3141 12.0685 14.6108 11.8498 14.8296Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Current Role</th>
                <th>Report to</th>
              </tr>
            </thead>

            <tbody>
              {getEmployeesData?.data?.data.map((data) => {
                return (
                  <tr key={data._id} className={styles.tableTabs}>
                    <td>{data.employeeName}</td>
                    <td>{data.employeeEmail}</td>
                    <td>{data.phoneNumber}</td>
                    <td>{data.role?.roleName}</td>
                    <td>{data.reportingPerson?.employeeName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <AddEmployee isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
