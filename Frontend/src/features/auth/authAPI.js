import {API} from "../../services/axios.js"

export const registerOrganisationApi = async(data) => {
    const response = await API.post("/organisationRegister", data)
    return response.data
}

