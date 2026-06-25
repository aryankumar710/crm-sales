import { CrossButton } from "../Buttons/CrossButton.component.jsx";
import { PlainInputField } from "../InputFields/PlainInputField.jsx";
import { Dropdown } from "../InputFields/Dropdown.component.jsx";
import { PhoneInputField } from "../InputFields/PhoneInputField.jsx";
import { PrimaryButton } from "../Buttons/PrimaryButton.component.jsx";

export const LeadsForm = ({onChange, form, onSubmit, onClose}) => {
  return (
    <>
      <form
        method="post"
        className={styles.whiteBackground}
        onSubmit={handleSubmit}
      >
        <div className={styles.formText}>
          <h1>New Lead</h1>
          <CrossButton onClick={() => onClose()} />
        </div>
        <PlainInputField
          onChange={onChange}
          type="text"
          placeholder="e.g Amazon"
          name="clientName"
          label="Client Name*"
          value={form.clientName}
          required={true}
        />
        <div className={styles.formBox}>
          <PlainInputField
            onChange={onChange}
            type="text"
            placeholder="e.g Website"
            name="projectInfo"
            label="Project Category*"
            value={form.projectInfo}
            required={true}
          />

          <Dropdown
            name={"status"}
            label={"Stage in Sales Funnel*"}
            onChange={onChange}
            value={form.status}
            options={projectStatus}
          />

          <PlainInputField
            onChange={onChange}
            type="text"
            placeholder="e.g LinkedIn"
            name="source"
            label="Source of lead*"
            value={form.source}
            required={true}
          />

          <PlainInputField
            type="email"
            placeholder="e.g aryan@gmail.com"
            value={form.email}
            name="email"
            onChange={onChange}
            label="Client Email*"
          />

          <PhoneInputField
            type={"tel"}
            value={form.phoneNumber}
            name={"phoneNumber"}
            onChange={onChange}
            placeholder={"e.g 82993146XX"}
            label={"Client Phone Number*"}
          />

          <PlainInputField
            type="number"
            placeholder="e.g 3,00,000"
            value={form.dealValue}
            name="dealValue"
            onChange={onChange}
            label="Deal Value*"
          />
        </div>

        <PrimaryButton type={"submit"} text={"Save Lead"}>
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
      </form>
    </>
  );
};
