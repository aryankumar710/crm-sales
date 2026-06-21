import styles from "../AnalysisCard/AnalysisCard.component.module.css";

export const AnalysisCard = ({ content, data, lastMonthData , comparisonPercentage, children}) => {
  return (
    <div className={styles.card}>
      <div className={styles.contentDirection}>
        <div className={styles.content}>
          {children}
          <p>{content}</p>
        </div>
        <div className={styles.comparison}>
          <p>{comparisonPercentage}</p>
          <h6>this quarter</h6>
        </div>
      </div>
      <h1>{data}</h1>
      <div className={styles.lastMonth}>
        <p >{lastMonthData}</p>
        <h6>last month</h6>
      </div>
    </div>
  );
};
