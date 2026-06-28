import { LeadsForm } from "../../components/Forms/LeadsForm.component.jsx"
import { Modal } from "../../components/Modals/Modal.component.jsx"
import { useEditLeadsMutation } from "../../features/API/api.js"

export const EditLeads = (isOpen, onClose) => {

    const [editLead, {isLoading, isSuccess, error}] = useEditLeadsMutation()

  const [form, setForm] = useState({
    clientName: "",
    projectInfo: "",
    status: "",
    source: "",
    email: "",
    phoneNumber: "",
    dealValue: "",
  });

   if (!isOpen) return null;

     function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

    function handleSubmit(e) {
    e.preventDefault();
    const postApi = async () => {
      try {
        await addLead(form).unwrap();
        onClose();
      } catch (error) {
        console.log(error);
      }
    };

    postApi();
  }
    return (
    <Modal isOpen = {isOpen}>
        <LeadsForm />
    </Modal>    
    )
}