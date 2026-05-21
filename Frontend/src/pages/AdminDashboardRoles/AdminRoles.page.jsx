import { TertiaryButton } from "../../components/Buttons/TertiaryButton.component";
import styles from "../AdminDashboardRoles/AdminRoles.page.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import {
  useGetEmployeesQuery,
  useGetRolesQuery,
} from "../../features/auth/authAPI";
import { Table } from "../../components/Table/Table.component.jsx";
import { AddRole } from "../AddRole/AddRole.page";
import { useNavigate } from "react-router-dom";

export const AdminRoles = () => {
  const { data: getRoles, isLoading } = useGetRolesQuery();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedRole, setSelectedRole] = useState("");
  const tabRef = useRef(null);
  const [showTab, setShowTab] = useState(false);
  
  const activeRole = selectedRole || getRoles?.data[0]?.roleName;
  const { data: getEmployeesData, isLoading: getEmployeesDataLoading } =
    useGetEmployeesQuery(
      { limit, page, roleName: activeRole },
      { skip: !activeRole },
    );

  const [isOpen, setOpen] = useState(false);

  function handleModal() {
    if (isOpen) {
      setOpen(false);
      navigate("/adminDashboardRoles");
    } else {
      setOpen(true);
      navigate("/adminDashboardRoles/createRoles");
    }
  }

  function handleClose() {
    setOpen(false);
    navigate("/adminDashboardRoles");
  }

  useEffect(() => {
    const e = tabRef.current;
    if (e) {
      setShowTab(e.scrollWidth > e.clientWidth);
    }
  }, [getRoles]);


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

              <TertiaryButton onClick={handleModal}>New Role</TertiaryButton>
            </div>
          </div>

          <div className={styles.tabsContainer} ref={tabRef}>
            <Swiper
              spaceBetween={12}
              slidesPerView={"auto"}
              modules={[Navigation]}
              navigation={showTab}
              style={{ display: "flex" }}
            >
              {getRoles?.data?.map((role) => (
                <SwiperSlide key={role._id} style={{ display: "flex" }}>
                  <button
                    className={`${styles.roleTab} ${
                      (selectedRole || activeRole) === role.roleName
                        ? styles.active
                        : ""
                    }`}
                    onClick={()=> {setSelectedRole(role.roleName),setPage(1); }}
                  >
                    <span>{role.roleName}</span>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
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

            <div className={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
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
                {page} / {getEmployeesData?.data?.pagination?.totalPages}
              </span>

              <button
                disabled={
                  page === getEmployeesData?.data?.pagination?.totalPages
                }
                onClick={() => setPage((prev) => prev + 1)}
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
          </div>
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
              {getEmployeesData?.data?.getList.map((data) => {
                return <Table key={data._id} data={data} />;
              })}
            </tbody>
          </table>
        </div>
      </section>

      <AddRole isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
