import { LoginRegisterBanner } from "../../components/LoginRegistration/LoginRegisterBanner.component";
import styles from "./Register.page.module.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerOrganisation } from "../../features/auth/authSlice.js";

export const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

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


  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);

    const data = new FormData();

    data.append("companyName", form.companyName);
    data.append("logo", form.companyLogo); // ⚠️ must match multer field
    data.append("headOfficeName", form.headOfficeName);
    data.append("superAdminEmail", form.superAdminEmail);
    data.append("adminName", form.adminName);
    data.append("hrAdminEmail", form.hrAdminEmail);
    data.append("countryCode", form.countryCode);
    data.append("phoneNumber", form.phoneNumber);
    data.append("password", form.password);

    dispatch(registerOrganisation(data));
  }

  if(loading){
    <button className={styles.submitBtn} disabled={true}>
    </button>
  }

  return (
    <>
      <section className="formSection">
        <LoginRegisterBanner />
        <div className="formContainer">
          <form method="post" className="glassEffect" onSubmit={handleSubmit}>
            <h1>Company Registration</h1>
            <div className="formBox">
              <div className={styles.inputBox}>
                <label htmlFor="companyName">Company Name*</label>
                <input
                  type="text"
                  id="companyName"
                  placeholder="e.g DeviceDisk"
                  vlaue={form.companyName}
                  name="companyName"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputBox}>
                <label htmlFor="companyLogo">Company Logo under 2mb*</label>
                <input
                  type="file"
                  id="companyLogo"
                  name="companyLogo"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className={styles.inputBox}>
                <label htmlFor="headOfficeName">Head Office*</label>
                <input
                  type="text"
                  id="headOfficeName"
                  placeholder="e.g Delhi"
                  name="headOfficeName"
                  value={form.headOfficeName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputBox}>
                <label htmlFor="superAdminEmail">Super Admin Email*</label>
                <input
                  type="email"
                  id="superAdminEmail"
                  placeholder="e.g superadmin@gmail.com"
                  name="superAdminEmail"
                  value={form.superAdminEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputBox}>
                <label htmlFor="adminName">Admin Name*</label>
                <input
                  type="text"
                  id="adminName"
                  placeholder="e.g Aryan Kumar"
                  vlaue={form.adminName}
                  name="adminName"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputBox}>
                <label htmlFor="hrAdminEmail">HR Admin Email*</label>
                <input
                  type="email"
                  id="hrAdminEmail"
                  placeholder="e.g hradmin@gmail.com"
                  value={form.hrAdminEmail}
                  onChange={handleChange}
                  name="hrAdminEmail"
                  required
                />
              </div>
              <div className={styles.inputBox}>
                <label htmlFor="phoneNumber">Phone Number*</label>
                <PhoneInput international defaultCountry="IN" required />
                <input
                  value={form.phoneNumber}
                  onChange={handleChange}
                  id="phoneNumber"
                  name="phoneNumber"
                />
              </div>
              <div className={styles.inputBox}>
                <label htmlFor="password">Password*</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    name="password"
                    className={styles.passwordInput}
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Register Company
              <div className={styles.arrowBox}>
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
              </div>
            </button>
          </form>
        </div>
      </section>
    </>
  );
};
