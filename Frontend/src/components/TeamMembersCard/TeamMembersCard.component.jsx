import styles from "../TeamMembersCard/TeamMembersCard.component.module.css";
import { TertiaryButton } from "../../components/Buttons/TertiaryButton.component.jsx";

export const TeamMembersCard = ({ data, text, onClick}) => {
  const joiningDate = new Date(data?.employeeDetail?.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <>
      <div className={styles.box}>
        <div className={styles.horizontal}>
          <div className={styles.nameAndPosition}>
            <h4>{data?.employeeDetail?.employeeName}</h4>
            <h6>{data?.employeeDetail?.role?.roleName}</h6>
          </div>

          <div className={styles.profile}>
            <h5>Pipeline Value</h5>
            <h6>{data?.metrics?.totalPipelineValue}</h6>
          </div>

          <div className={styles.profile}>
            <h5>Total Deals</h5>
            <h6>{data?.metrics?.totalLeads}</h6>
          </div>

          <div className={styles.profile}>
            <h5>Deal Won</h5>
            <h6>{data?.metrics?.countWonLeads}</h6>
          </div>

          <div className={styles.profile}>
            <h5>Deal Lost</h5>
            <h6>{data?.metrics?.countLostLeads}</h6>
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
              <p className={styles.value}>{data?.employeeDetail?.employeeEmail}</p>
            </div>
          </div>
          <div className={styles.details}>
            <div className={styles.keyValue}>
              <p className={styles.key}>Phone number</p>
              <p className={styles.value}>{data?.employeeDetail?.phoneNumber}</p>
            </div>
            <div className={styles.keyValue}>
              <p className={styles.key}>Reporting Person</p>
              <p className={styles.value}>
                {data?.employeeDetail?.reportingPerson?.employeeName || "None"}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.button}>
          <TertiaryButton onClick={onClick}>{text}</TertiaryButton>
        </div>
      </div>
    </>
  );
};
