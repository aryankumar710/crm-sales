import { useState } from "react";
import { FilterDropdown } from "../../components/InputFields/FilterDropdown.component";
import { TeamMembersCard } from "../../components/TeamMembersCard/TeamMembersCard.component";
import { useGetTeamQuery } from "../../features/API/api.js";
import styles from "../Team/Team.page.module.css";

export const Team = () => {
  // const limit = 10;
  // const [page, setPage] = useState(1)
  const { data: getLeads, isLoading } = useGetTeamQuery();
  console.log(getLeads);
  console.log(isLoading);
  return (
    <>
      <section className="glassEffect">
        <h1 className={styles.heading}>Team Overview</h1>

        {getLeads?.data?.map((leadsData) => {
          return <TeamMembersCard data={leadsData} text={"View"}/>;
        })}
      </section>
    </>
  );
};


