import { TertiaryButton } from "../../components/Buttons/TertiaryButton.component";
import styles from "../AdminDashboardRoles/AdminRoles.page.module.css"
import {Swiper, SwiperSlide} from "swiper/react"
import {Navigation} from "swiper/modules"
import { useEffect, useRef, useState } from "react";
import { useGetRolesQuery } from "../../features/auth/authAPI";

export const AdminRoles = () => {

  const {data: getRoles, isLoading} = useGetRolesQuery()

  const [selectedRole, setSelectedRole]= useState("")
  const tabRef = useRef(null)
  const [showTab, setShowTab] = useState(false);

  useEffect(()=> {
    const e = tabRef.current
    if(e){
      setShowTab(e.scrollWidth> e.clientWidth)
    }

  }, [getRoles])
  return (
    <>
      <section className="glassEffect">
        <div className="subSection">
          <div className={styles.heading}>
            <h1>Employee Roles</h1>
            <div className={styles.subHeading}>
              <div className={styles.heirarchyDirection}>
                <h2>Employee Hierarchy</h2>
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_59244_909)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M24.8903 10.1821L31.6785 16.9704L24.8903 23.7586L23.7589 22.6272L28.6159 17.7703L1.0001 17.5L1.0001 16.1709L28.6159 16.1705L23.7589 11.3135L24.8903 10.1821Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_59244_909">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(16.9706) rotate(45)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <TertiaryButton>Add Role</TertiaryButton>
            </div>
            
          </div>  

          <div className={styles.tabsContainer} ref={tabRef}>
            <Swiper spaceBetween={12} slidesPerView={"auto"} modules={[Navigation]} navigation={showTab} style={{ display:"flex"}} >
              {getRoles?.data?.map((role)=> (
                <SwiperSlide key={role} style={{ display:"flex"}}>
                  <button className={styles.roleTab}>
                    <span>{role.roleName}</span>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>        
        </div>
      </section>
    </>
  );
};
