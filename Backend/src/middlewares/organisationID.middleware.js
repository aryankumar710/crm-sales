import { Organisation } from "../models/organisation.model"
import { APIError } from "../utils/APIerror"
import { APIResponse } from "../utils/APIresponse"



const organisationVerification = async(req,res) =>{
   try {
     const {organisationID} = req.body
 
     const organisationExists = await Organisation.findOne(organisationID) 
 
      if(!organisationExists){
         throw new APIError("This organisation doesnt exists")
      }
 
      res.status(200).json(200,new APIResponse(organisationID))
   } catch (error) {
    throw new APIError(500, "Error creating organisation", [error.message]);
   }

}