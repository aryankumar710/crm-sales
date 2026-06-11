import styles from "../TeamMembersCard/TeamMembersCard.component.module.css"
import { TertiaryButton } from "../../components/Buttons/TertiaryButton.component";


export const TeamMembersCard = ({ data }) => {
 const joiningDate = new Date(data?.employee[0]?.createdAt)
  .toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  //  const joiningDate = new Date(data?.employee[0]?.createdAt)
  // .toLocaleDateString("en-IN", {
  //   day: "numeric",
  //   month: "long",
  //   year: "numeric",
  // });
  return (
    <>
      <div className={styles.box}>
        <div className={styles.horizontal}>
          <div className={styles.nameAndPosition}>
            <h4>{data?.employee[0]?.employeeName}</h4>
            <h6>{data?.employee[0]?.role?.roleName}</h6>
          </div>

          <div className={styles.profile}>
            <h5>Pipeline Value</h5>
            <h6>{data?.totalPipelineValue}</h6>
          </div>

          <div className={styles.profile}>
            <h5>Total Deals</h5>
            <h6>{data?.totalLead}</h6>
          </div>

          <div className={styles.profile}>
            <h5>Deal Won</h5>
            <h6>{data?.countWonLeads}</h6>
          </div>

          <div className={styles.profile}>
            <h5>Deal Lost</h5>
            <h6>{data?.countLostLeads}</h6>
          </div>
        </div>

        <div className={styles.horizontal}>
          <div className={styles.details}>
            <div className={styles.keyValue}>
              <p className={styles.key}>Joining Date</p>
              <p className={styles.value}>{joiningDate}</p>
            </div>
           <div className={styles.keyValue}>
              <p className={styles.key}>Email</p>
              <p className={styles.value}>{data?.employee[0]?.employeeEmail}</p>
              
            </div>
            </div>
             <div className={styles.details}>
            <div className={styles.keyValue}>
              <p className={styles.key}>Phone number</p>
              <p className={styles.value}>{data?.employee[0]?.phoneNumber}</p>
            </div>
          <div className={styles.keyValue}>
              <p className={styles.key}>Reporting Person</p>
              <p className={styles.value}>{data?.employee[0]?.reportingPerson?.employeeName || "None"}</p>
            </div>
          </div>
        </div> 
        <div className={styles.button}>
          <TertiaryButton>View</TertiaryButton>
        </div>
      </div>
    </>
  );
};
