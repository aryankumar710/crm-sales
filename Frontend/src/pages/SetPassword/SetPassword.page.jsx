import { LoginRegisterBanner } from "../../components/LoginRegistration/LoginRegisterBanner.component";
import { PlainInputField } from "../../components/InputFields/PlainInputField.jsx";
import { PhoneInputField } from "../../components/InputFields/PhoneInputField.jsx";
import { PasswordInputField } from "../../components/InputFields/PasswordInputField.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetTokenQuery,
  useUpdateSuperAdminMutation,
} from "../../features/API/api.js";
import { useState, useEffect } from "react";
import { setEmployee } from "../../features/API/slice.js";
import { useDispatch } from "react-redux";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component.jsx";

export const SetPassword = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const { data: getToken, isLoading: isTokenLoading } = useGetTokenQuery(
    token,
    { skip: !token },
  );

  const [updateSuperAdmin, { isLoading }] = useUpdateSuperAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeName: "",
    phoneNumber: "",
    password: "",
    employeeEmail: getToken?.employeeEmail || "",
  });

  useEffect(() => {
    if (getToken?.employeeEmail) {
      setForm({
        ...form,
        employeeEmail: getToken.employeeEmail,
      });
    }
  }, [getToken]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await updateSuperAdmin(form).unwrap();
      console.log(res);
      dispatch(setEmployee(res?.data));
      navigate("/employeeDashboard");
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
            <h1>Set Password</h1>
            <div className="formBox">
              <PlainInputField
                type="text"
                placeholder="e.g Sumit"
                value={form.employeeName}
                name="employeeName"
                onChange={handleChange}
                required
                label="Super Admin Name*"
              />
              <PlainInputField
                type="email"
                placeholder="e.g superAdmin@gmail.com"
                value={form.employeeEmail}
                name="hrAdminEmail"
                label="Super Admin Email*"
                disabled={true}
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

            <PrimaryButton type={"submit"} text={"Update SuperAdmin"}>
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
