import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetMeQuery } from "../features/API/api.js";
import { setEmployee } from "../features/API/slice";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const employee = useSelector((state) => state.auth.employee);
  const { data, isLoading, isError } = useGetMeQuery();


  useEffect(() => {
    if (data) {
      dispatch(setEmployee(data.data));
      
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!employee && isError) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
