import { useState, useEffect } from "react";
import { LoginRegisterBanner } from "../../components/LoginRegistration/LoginRegisterBanner.component";
import {
  useChangePasswordMutation,
  useGetChangePasswordTokenQuery,
} from "../../features/API/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PlainInputField } from "../../components/InputFields/PlainInputField.jsx";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component";
import { PasswordInputField } from "../../components/InputFields/PasswordInputField.jsx";

export const ChangePassword = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("passwordToken");
  const navigate = useNavigate()

  const { data: getToken, isLoading: dataLoading } =
    useGetChangePasswordTokenQuery(token, {
      skip: !token,
    });

  const [form, setForm] = useState({
    employeeEmail: getToken?.employeeEmail,
    newPassword: "",
  });
  useEffect(()=>{
  setForm({
    employeeEmail: getToken?.employeeEmail,
    newPassword: "",
  })
  },[getToken])

  const [changePasswordData, { isLoading, isSuccess, error }] =
    useChangePasswordMutation();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await changePasswordData(form).unwrap();
      console.log(res);
      navigate("/login")
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
            <h1>Change Password</h1>
            <div className="formBox">
              <PlainInputField
                type="email"
                placeholder="e.g employee@gmail.com"
                value={getToken?.employeeEmail}
                name="employeeEmail"
                label="Employee Email*"
              />

              <PasswordInputField
                name={"newPassword"}
                label={"Password*"}
                type={"password"}
                placeholder={"••••••••"}
                value={form.newPassword}
                onChange={onChange}
                required={true}
              />
            </div>

            <PrimaryButton type={"submit"} text={"Reset Password"}>
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
