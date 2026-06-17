import { useState } from "react";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component.jsx";
import { TertiaryButton } from "../../components/Buttons/TertiaryButton.component.jsx";
import { TeamMembersCard } from "../../components/TeamMembersCard/TeamMembersCard.component";
import { PlainInputField } from "../../components/inputFields/PlainInputfield.jsx";
import { PhoneInputField } from "../../components/InputFields/PhoneInputField.jsx";
import { PasswordInputField } from "../../components/InputFields/PasswordInputField.jsx";
import { clearUser } from "../../features/API/slice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  useChangeProfilePhotoMutation,
  useGetProfileQuery,
  useUpdateProfileDataMutation,
  useUpdateSuperAdminMutation,
  useLogoutMutation,
} from "../../features/API/api.js";
import styles from "../Profile/Profile.page.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { data: getProfile, isLoading } = useGetProfileQuery();
  // const { data: changePhoto, isLoading: changePhotoLoading } =
  //   useChangeProfilePhotoMutation();
  const [
    updateProfileData,
    { isLoading: updateProfileDataLoading, error, isSuccess },
  ] = useUpdateProfileDataMutation();

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const [form, setForm] = useState({
    employeeName: getProfile?.data?.employeeDetail.employeeName || "",
    employeeEmail: getProfile?.data?.employeeDetail.employeeEmail || "",
    phoneNumber: getProfile?.data?.employeeDetail.phoneNumber || "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    setForm({
      employeeName: getProfile?.data?.employeeDetail.employeeName,
      employeeEmail: getProfile?.data?.employeeDetail.employeeEmail,
      phoneNumber: getProfile?.data?.employeeDetail.phoneNumber,
      oldPassword: "",
      newPassword: "",
    });
  }, [getProfile]);

  //   const [photo, setPhoto] = useState(null)

  //  async function handleChangePhoto(){
  //     const data = new FormData()
  //     data.append()
  //   }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await updateProfileData(form).unwrap();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <section className="glassEffect">
        <div className="subSection">
          <h1 className={styles.heading}>My Profile</h1>
          <TeamMembersCard
            data={getProfile?.data}
            onClick={handleLogout}
            text={"Logout"}
          />
        </div>
        <div className="subSection">
          <h3 className={styles.subHeading}>Edit Profile</h3>
          <div className={styles.box}>
            <div className={styles.horizontal}>
              <div className={styles.verticle}>
                <div className={styles.profileImage}>
                  <img
                    className={styles.image}
                    src="ix_user-profile-filled.png"
                    alt=""
                  />
                </div>
                <div className={styles.editButtonAlignment}>
                  <TertiaryButton>Change Photo</TertiaryButton>
                  <TertiaryButton>Delete Photo</TertiaryButton>
                </div>
              </div>
            </div>
            <form className={styles.form} method="post" onSubmit={onSubmit}>
              <div className={styles.formBox}>
                <PlainInputField
                  type="text"
                  placeholder="e.g Aryan Kumar"
                  name="employeeName"
                  label="Employee Name*"
                  value={form.employeeName}
                  required={true}
                />
                <PlainInputField
                  type="email"
                  placeholder="e.g aryankumar79101117@gmail.com"
                  value={form.employeeEmail}
                  name="employeeEmail"
                  label="Employee Email*"
                  required={true}
                />

                <PhoneInputField
                  type={"tel"}
                  value={form.phoneNumber}
                  name={"phoneNumber"}
                  placeholder={"e.g 82993146XX"}
                  label={"Phone Number*"}
                  required={true}
                />

                <PasswordInputField
                  name={"oldPassword"}
                  label={"Old Password*"}
                  type={"password"}
                  placeholder={"••••••••"}
                  value={form.oldPassword}
                  onChange={onChange}
                  required={true}
                />

                <PasswordInputField
                  name={"newPassword"}
                  label={"New Password*"}
                  type={"password"}
                  placeholder={"••••••••"}
                  value={form.newPassword}
                  onChange={onChange}
                  required={true}
                />
              </div>
              <div className={styles.saveButtonAlignment}>
                <div className={styles.saveButton}>
                  <PrimaryButton text={"Save Profile"} type={"submit"}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 7V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H17L21 7ZM12 18C12.8333 18 13.5417 17.7083 14.125 17.125C14.7083 16.5417 15 15.8333 15 15C15 14.1667 14.7083 13.4583 14.125 12.875C13.5417 12.2917 12.8333 12 12 12C11.1667 12 10.4583 12.2917 9.875 12.875C9.29167 13.4583 9 14.1667 9 15C9 15.8333 9.29167 16.5417 9.875 17.125C10.4583 17.7083 11.1667 18 12 18ZM6 10H15V6H6V10Z"
                        fill="black"
                      />
                    </svg>
                  </PrimaryButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
