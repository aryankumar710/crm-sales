import { useEffect } from "react";
import { AnalysisCard } from "../../components/AnalysisCard/AnalysisCard.component.jsx";
import { TertiaryButton } from "../../components/Buttons/TertiaryButton.component.jsx";
import { Header } from "../../components/Header/Header.component.jsx";
import { useGetMeQuery } from "../../features/auth/authAPI.js";
import styles from "../AdminDashboard/AdminDashboard.page.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setEmployee } from "../../features/auth/authSlice.js";

export const AdminDashboard = () => {

  const dispatch = useDispatch()
  const employee = useSelector((state)=> state.auth.employee)
   console.log(employee)

  const {data, isLoading} = useGetMeQuery()



  useEffect(()=> {
    if(data){
      dispatch(setEmployee(data?.data))
    }
  },[data])

  return (
    <>
      <section className="glassEffect">
        <div className="subSection">
          <div className={styles.employeeDashboard}>
            <h1>{employee?.loggedInEmployee?.employeeName}</h1>
            <TertiaryButton>Add Employee</TertiaryButton>
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
          </div>
          <table>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Current Role</th>
              <th>Report to</th>
            </tr>

            <tr className={styles.tableTabs}>
              <td>Aryan Kumar</td>
              <td>aryan@gmail.com</td>
              <td>+91 8299324643</td>
              <td>Manager</td>
              <td>Pankaj Sinha</td>
            </tr>

            <tr className={styles.tableTabs}>
              <td>Aryan Kumar</td>
              <td>aryan@gmail.com</td>
              <td>+91 8299324643</td>
              <td>Manager</td>
              <td>Pankaj Sinha</td>
            </tr>

            <tr className={styles.tableTabs}>
              <td>Aryan Kumar</td>
              <td>aryan@gmail.com</td>
              <td>+91 8299324643</td>
              <td>Manager</td>
              <td>Pankaj Sinha</td>
            </tr>
          </table>
        </div>
      </section>
    </>
  );
};
