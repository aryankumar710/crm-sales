import styles from "../Table/Table.component.module.css";

export const LeadsTable = ({ data, page, pageSelectionLeft, pageSelectionRight }) => {
  return (
    <>
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={pageSelectionLeft}
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
          {page} / {data?.pagination?.totalPages}
        </span>

        <button
          disabled={page === data?.pagination?.totalPages}
          onClick={pageSelectionRight}
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
      <table>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Project Info</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {data?.leads?.map((lead) => {
            return (
              <tr className={styles.tableTabs}>
                <td>{lead.clientName}</td>
                <td>{lead.projectInfo}</td>
                <td>{lead.status}</td>
                <td>{lead.source}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
