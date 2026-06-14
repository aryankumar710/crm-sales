import { TeamMembersCard } from "../../components/TeamMembersCard/TeamMembersCard.component";
import { useGetProfileQuery } from "../../features/API/api.js";
import styles from "../Profile/Profile.page.module.css";

export const Profile = () => {
  const { data: getProfile, isLoading } = useGetProfileQuery();
  return (
    <>
      <section className="glassEffect">
        <div className="subSection">
          <h1 className={styles.heading}>My Profile</h1>
          <TeamMembersCard data={getProfile?.data}/>
        </div>
        <div className="subSection">
          <h3>Edit Profile</h3>
          <div className={styles.box}>
            <div className={styles.horizontal}>
                <div className={styles.verticle}>
                    
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
