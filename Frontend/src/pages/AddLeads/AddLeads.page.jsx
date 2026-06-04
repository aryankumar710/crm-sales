import { CrossButton } from "../../components/Buttons/CrossButton.component";
import { Dropdown } from "../../components/InputFields/Dropdown.component";
import { PlainInputField } from "../../components/inputFields/PlainInputfield";
import { Modal } from "../../components/Modals/Modal.component";

export const AddLeads = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen}>
      {" "}
      <form
        method="post"
        className={styles.whiteBackground}
        onSubmit={handleSubmit}
      ></form>
      <div className={styles.formText}>
        <h1>New Lead</h1>
        <CrossButton onClick={() => onClose()} />
      </div>
      <div className={styles.formBox}>
        <PlainInputField
          onChange={onChange}
          type="text"
          placeholder="e.g Amazon"
          name="clientName"
          label="Client Name*"
          value={form.roleName}
          required={true}
        />

        <PlainInputField
          onChange={onChange}
          type="text"
          placeholder="e.g Website"
          name="projectInfo"
          label="Project Category*"
          value={form.roleName}
          required={true}
        />

        <Dropdown
          name={"type"}
          label={"Stage in Sales Funnel*"}
          onChange={(e) => setForm({ ...form, roleType: e.target.value })}
          value={form.roleType}
          options={projectStatus}
        />
      </div>
    </Modal>
  );
};
