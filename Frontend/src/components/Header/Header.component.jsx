import { NavLink } from "react-router-dom";
import styles from "../Header/Header.component.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useGetMeQuery } from "../../features/auth/authAPI.js";
import { useEffect } from "react";
import { setEmployee } from "../../features/auth/authSlice.js";

export const Header = () => {
  
  const dispatch = useDispatch();
  const employee = useSelector((state)=> state.auth.employee)

  const { data, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (data) {
      dispatch(setEmployee(data?.data));
    }
  }, [data]);
  return (
    <>
      <div className={styles.container}>
        <img className={styles.image} src={employee?.loggedInOrganisation?.companyLogo} alt="" />

        <nav className={styles.navigation}>
          <NavLink>
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="44" height="44" rx="22" fill="#292929" />
              <g clip-path="url(#clip0_59217_27411)">
                <path
                  d="M14.5 22.153C14.5 20.4363 14.5 19.5782 14.89 18.8672C15.2785 18.1555 15.9902 17.7145 17.413 16.831L18.913 15.9003C20.4167 14.9665 21.169 14.5 22 14.5C22.831 14.5 23.5825 14.9665 25.087 15.9003L26.587 16.831C28.0097 17.7145 28.7215 18.1555 29.1108 18.8672C29.5 19.579 29.5 20.4362 29.5 22.1523V23.2938C29.5 26.2188 29.5 27.682 28.621 28.591C27.742 29.5 26.3282 29.5 23.5 29.5H20.5C17.6718 29.5 16.2572 29.5 15.379 28.591C14.5007 27.682 14.5 26.2195 14.5 23.2938V22.153Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M22 24.25V26.5"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_59217_27411">
                  <rect
                    width="18"
                    height="18"
                    fill="white"
                    transform="translate(13 13)"
                  />
                </clipPath>
              </defs>
            </svg>
          </NavLink>
        </nav>

        <img className={styles.image} src=" " alt="" />
      </div>
    </>
  );
};

// const NavItem = ({to}) => {
//   return (
//     <NavLink to={to} >

//     </NavLink>
//   )
// }
