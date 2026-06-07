import styles from "../Table/Table.component.module.css";

export const LeadsTable = ({data}) => {
    return(
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
                {data.map((data)=> {
                    return(
                      <tr className={styles.tableTabs}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    )
                })}
            </tbody>
        </table>
    )
}