import { useState } from "react";
import { useLoginMutation } from "../../features/API/api.js";
import { useDispatch } from "react-redux";
import { setEmployee } from "../../features/API/slice.js";
import { PasswordInputField } from "../../components/InputFields/PasswordInputField.jsx";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Login/Login.page.module.css";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component.jsx";
import { PlainInputField } from "../../components/InputFields/PlainInputfield.jsx";
import { LoginRegisterBanner } from "../../components/LoginRegistration/LoginRegisterBanner.component.jsx";

export const Login = () => {
  const [form, setForm] = useState({ employeeEmail: "", password: "" });
  const [login, { isLoading, isSuccess, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setEmployee(res?.data));
      console.log(res?.data);
      if (res?.data?.loggedInEmployee.role.roleType === "HR Admin") {
        navigate("/adminDashboard");
      } else {
        navigate("/employeeDashboard");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="formSection">
        <LoginRegisterBanner />
        <div className="formContainer">
          <form method="post" className="glassEffect" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="formBox">
              <PlainInputField
                type="email"
                placeholder="e.g employee@gmail.com"
                value={form.employeeEmail}
                name="employeeEmail"
                onChange={handleChange}
                label="Employee Email*"
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

            <PrimaryButton type={"submit"} text={"Login"}>
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
            <div className={styles.link}>
              <Link to="/forgetPassword">Forgot Password?</Link>
            </div>
            
          </form>
          
        </div>
      </div>
    </>
  );
};
