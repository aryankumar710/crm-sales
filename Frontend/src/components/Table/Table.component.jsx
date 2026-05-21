import styles from "../Table/Table.component.module.css";

export const Table = ({ data }) => {
  return (
    <tr className={styles.tableTabs}>
      <td>{data.employeeName}</td>
      <td>{data.employeeEmail}</td>
      <td>{data.phoneNumber}</td>
      <td>{data.role?.roleName}</td>
      <td>{data.reportingPerson?.employeeName}</td>
    </tr>
  );
};
