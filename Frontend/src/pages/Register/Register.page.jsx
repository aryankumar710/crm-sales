import { LoginRegisterBanner } from "../../components/LoginRegistration/LoginRegisterBanner.component.jsx";
import styles from "./Register.page.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmployee } from "../../features/API/slice.js";
import { PlainInputField } from "../../components/inputFields/PlainInputfield.jsx";
import { PhoneInputField } from "../../components/InputFields/PhoneInputField.jsx";
import { PasswordInputField } from "../../components/InputFields/PasswordInputField.jsx";
import { FileInputField } from "../../components/InputFields/FileInputField.jsx";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component.jsx";
import { useGetMeQuery, useRegisterMutation } from "../../features/API/api.js";

export const Registration = () => {
  const [register, { isLoading, error, isSuccess }] =
    useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { loading, error, success } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    companyName: "",
    companyLogo: null,
    headOfficeName: "",
    superAdminEmail: "",
    adminName: "",
    hrAdminEmail: "",
    countryCode: "+91",
    phoneNumber: "",
    password: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleFileChange(e) {
    setForm({
      ...form,
      companyLogo: e.target.files[0],
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();

    data.append("companyName", form.companyName);
    data.append("logo", form.companyLogo); //
    data.append("headOfficeName", form.headOfficeName);
    data.append("superAdminEmail", form.superAdminEmail);
    data.append("adminName", form.adminName);
    data.append("hrAdminEmail", form.hrAdminEmail);
    data.append("countryCode", form.countryCode);
    data.append("phoneNumber", form.phoneNumber);
    data.append("password", form.password);

    // dispatch(registerOrganisation(data));

    try {
      const res = await register(data).unwrap();

      dispatch(setEmployee(res.data));

      navigate("/adminDashboard");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div className="formSection">
        <LoginRegisterBanner />
        <div className="formContainer">
          <form method="post" className="glassEffect" onSubmit={handleSubmit}>
            <h1>Company Registration</h1>
            <div className="formBox">
              <PlainInputField
                type="text"
                placeholder="e.g DeviceDisk"
                value={form.companyName}
                name="companyName"
                onChange={handleChange}
                required
                label="Company Name"
              />

              <FileInputField
                name={"companyLogo"}
                label={"Company Logo under 2mb*"}
                type={"file"}
                accept={"image/*"}
                onChange={handleFileChange}
                required={true}
              />

              <PlainInputField
                type="text"
                placeholder="e.g Delhi"
                value={form.headOfficeName}
                name="headOfficeName"
                onChange={handleChange}
                required
                label="Head Office*"
              />

              <PlainInputField
                type="email"
                placeholder="e.g superadmin@gmail.com"
                value={form.superAdminEmail}
                name="superAdminEmail"
                onChange={handleChange}
                label="Super Admin Email*"
              />

              <PlainInputField
                type="text"
                placeholder="e.g Aryan Kumar"
                value={form.adminName}
                name="adminName"
                onChange={handleChange}
                label="Admin Name*"
                required
              />

              <PlainInputField
                type="email"
                placeholder="e.g hradmin@gmail.com"
                value={form.hrAdminEmail}
                name="hrAdminEmail"
                onChange={handleChange}
                label="Admin Email*"
              />

              <PhoneInputField
                type={"tel"}
                value={form.phoneNumber}
                name={"phoneNumber"}
                onChange={handleChange}
                placeholder={"e.g 82993146XX"}
                label={"Phone Number*"}
                required={true}
              />

              <PasswordInputField
                name={"password"}
                label={"Password*"}
                type={"password"}
                placeholder={"••••••••"}
                value={form.password}
                onChange={handleChange}
                required={true}
              />
            </div>

            <PrimaryButton type={"submit"} text={"Register Company"}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 12L19.5 12M19.5 12L13.875 6M19.5 12L13.875 18"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </PrimaryButton>
          </form>
        </div>
      </div>
    </>
  );
};
