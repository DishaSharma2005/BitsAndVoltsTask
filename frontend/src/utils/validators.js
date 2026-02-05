import * as yup from "yup";

export const userSchema = yup.object({
  firstName: yup.string().trim().min(2, "Min 2 characters").required("First name is required"),
  lastName: yup.string().trim().min(2, "Min 2 characters").required("Last name is required"),

  email: yup.string().trim().email("Invalid email").required("Email is required"),

  mobile: yup
    .string()
    .trim()
    .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
    .required("Mobile is required"),

  gender: yup.string().oneOf(["M", "F"], "Select gender").required("Gender is required"),

  status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),

  location: yup.string().trim().min(2, "Min 2 characters").required("Location is required"),
});
