import { useState } from "react";
import axios from "axios";
import bg from "../../../Assets/images/login-logo.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

function RegistrationForm() {
  const [errors, setErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    username: "",
    password: "",
  });

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrors(validateValues(formData));

    try {
      // Send registration request to the server
      await axios.post("http://localhost:8080/register", formData);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registration Successful!",
        showConfirmButton: false,
        timer: 1500,
      });

      setFormData({
        fname: "",
        mname: "",
        lname: "",
        username: "",
        password: "",
      });

      // Handle successful registration (e.g., redirect user to login)
    } catch (error) {
      // Handle registration errors
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.response.data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  const showEyePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateValues = (inputValues) => {
    let errors = {};

    if (inputValues.fname.trim() === "") {
      errors.fname = "Provide First Name";
    }
    if (inputValues.lname.trim() === "") {
      errors.lname = "Provide Last Name";
    }
    if (inputValues.username.trim() === "") {
      errors.username = "Provide Username";
    }
    if (inputValues.password.trim() === "") {
      errors.password = "Provide Password";
    }

    return errors;
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const modalTransition = {
    type: "spring",
    stiffness: 260,
    damping: 20,
  };

  return (
    <>
      <div className="forms-login bg-[#496989] flex justify-center items-center">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={modalTransition}
          className="wrapper flex justify-center h-fit shadow-2xl">
          <div className="p-5 bg-[#A8CD9F] flex items-center">
            <img src={bg} style={{ width: "500px" }} alt="Login Logo" />
          </div>
          <div className="bg-[#f8f8f8] p-5 flex flex-col justify-center">
            <h1 className="text-center pb-9">Registration Form</h1>
            <form onSubmit={handleRegistration}>
              <div>
                <label className="font-semibold" htmlFor="fname">
                  First Name:
                </label>
                <input
                  className="p-1 w-full mt-1"
                  type="text"
                  id="fname"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                />
                {errors.fname && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.fname}
                  </p>
                )}
              </div>
              <div className="pt-3">
                <label className="font-semibold" htmlFor="mname">
                  Middle Name:
                </label>
                <input
                  className="p-1 w-full mt-1"
                  type="text"
                  id="mname"
                  name="mname"
                  value={formData.mname}
                  onChange={handleChange}
                />
              </div>
              <div className="pt-3">
                <label className="font-semibold" htmlFor="lname">
                  Last Name:
                </label>
                <input
                  className="p-1 w-full mt-1"
                  type="text"
                  id="lname"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                />
                {errors.lname && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.lname}
                  </p>
                )}
              </div>
              <div className="pt-3">
                <label className="font-semibold" htmlFor="username">
                  Username:
                </label>
                <input
                  className="p-1 w-full mt-1"
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.username}
                  </p>
                )}
              </div>
              <div className="pt-3 relative">
                <label className="font-semibold" htmlFor="password">
                  Password:
                </label>
                <div className="input-with-icon">
                  <input
                    className="p-1 w-full mt-1 pr-8"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <p
                    onClick={showEyePassword}
                    className="absolute right-2 top-2 text-gray-500">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </p>
                </div>
                {errors.password && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.password}
                  </p>
                )}
              </div>
              <button
                className="btn-1 font-semibold mt-5 bg-[#58A399] w-full py-2 text-white"
                type="submit">
                Register
              </button>
            </form>
            <p className="pt-2">
              Already have an account? <Link to={"/"}>Login</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default RegistrationForm;
