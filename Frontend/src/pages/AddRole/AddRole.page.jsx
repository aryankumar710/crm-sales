import { useState } from "react";
import { Modal } from "../../components/Modals/Modal.component";
import {
  useCreateRoleMutation,
  useGetRolesQuery,
} from "../../features/API/api.js";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton.component.jsx";
import { PlainInputField } from "../../components/inputFields/PlainInputfield.jsx";
import { Dropdown } from "../../components/InputFields/Dropdown.component.jsx";
import { CrossButton } from "../../components/Buttons/CrossButton.component.jsx";
import styles from "../AddRole/AddRole.page.module.css";
import { roleType } from "../../utils/roleType.js";

export const AddRole = ({ isOpen, onClose }) => {
  const [createRoleData, { isLoading, error, isSuccess }] =
    useCreateRoleMutation();

  const { data: rolesData, isLoading: rolesLoading } = useGetRolesQuery();

  const [form, setForm] = useState({
    roleName: "",
    parentRole: "",
    roleType: "", 
  });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const postApi = async () => {
      try {
        const response = await createRoleData(form).unwrap();
        onClose();
      } catch (error) {
        console.log(error);
      }
    };
    postApi();
  }
  return (
    <Modal isOpen={isOpen}>
      <form
        method="post"
        className={styles.whiteBackground}
        onSubmit={handleSubmit}
      >
        <div className={styles.formText}>
          <h1>Add Employee</h1>
          <CrossButton onClick={() => onClose()} />
        </div>
        <div className={styles.formBox}>
          <Dropdown
            name={"roleName"}
            label={"Select Parent Role"}
            onChange={(e) => setForm({ ...form, parentRole: e.target.value })}
            value={form.parentRole}
            options={rolesData?.data || []}
          />

          <Dropdown
            name={"type"}
            label={"Select Role Type"}
            onChange={(e) => setForm({ ...form, roleType: e.target.value })}
            value={form.roleType}
            options={roleType}
          />

          <PlainInputField
            onChange={onChange}
            type="text"
            placeholder="e.g The Designer"
            name="roleName"
            label="Role Name*"
            value={form.roleName}
            required={true}
          />
        </div>

        <PrimaryButton type={"submit"} text={"Create Role"}>
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
    </Modal>
  );
};
