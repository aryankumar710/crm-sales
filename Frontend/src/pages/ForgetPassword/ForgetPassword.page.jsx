import { useSearchParams } from "react-router-dom";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component";
import { LoginRegisterBanner } from "../../components/LoginRegistration/LoginRegisterBanner.component";
import { useForgetPasswordMutation } from "../../features/API/api";
import { useState } from "react";
import { PlainInputField } from "../../components/inputFields/PlainInputfield.jsx";

export const ForgetPassword = () => {
  const [forgetPasswordData, { isLoading, isSuccess, error }] =
    useForgetPasswordMutation();

  const [form, setForm] = useState({
    employeeEmail: "",
  });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await forgetPasswordData(form).unwrap();
      console.log(res);
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
            <h1>Enter email</h1>
            <div className="formBox">
              <PlainInputField
                type="email"
                placeholder="e.g employee@gmail.com"
                value={form.employeeEmail}
                name="employeeEmail"
                onChange={onChange}
                label="Employee Email*"
              />
            </div>
            <PrimaryButton type={"submit"} text={"Sent link to email"}>
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
