import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { X, Save } from "lucide-react";

function AddArbs({ setShowModal, handlRefresh }) {
  // get LandOwnerCloa From SingleArbs
  const location = useLocation();
  const getLandOwnerCloa = location.state.getLandOwnerCloa;

  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    landowner_cloa_title_no: getLandOwnerCloa,
    arb_cloa_title_no: "",
    arb_lot_no: "",
    arb_area_individual: "",
    date_registered: "",
    fname: "",
    mname: "",
    lname: "",
    gender: "",
  });

  const goBack = () => {
    setShowModal(false);
    handlRefresh();
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

  const handleRegistration = async (e) => {
    setErrors(validateValues(formData));
    try {
      await axios.post("http://localhost:8080/addArbs", formData);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registration Successful!",
        showConfirmButton: false,
        timer: 1500,
      });

      setFormData({
        landowner_cloa_title_no: getLandOwnerCloa,
        arb_cloa_title_no: "",
        arb_lot_no: "",
        arb_area_individual: "",
        date_registered: "",
        fname: "",
        mname: "",
        lname: "",
        gender: "",
      });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: err.response.data.error,
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateValues = (inputValues) => {
    let errors = {};

    if (
      !inputValues.arb_cloa_title_no ||
      inputValues.arb_cloa_title_no.trim() === ""
    ) {
      errors.arb_cloa_title_no = "Provide Cloa Title No.";
    }
    if (!inputValues.arb_lot_no || inputValues.arb_lot_no.trim() === "") {
      errors.arb_lot_no = "Provide Lot No";
    }
    if (
      !inputValues.arb_area_individual ||
      inputValues.arb_area_individual.trim() === ""
    ) {
      errors.arb_area_individual = "Provide Area Individual";
    }
    if (
      !inputValues.date_registered ||
      inputValues.date_registered.trim() === ""
    ) {
      errors.date_registered = "Provide Date registered";
    }
    if (!inputValues.fname || inputValues.fname.trim() === "") {
      errors.fname = "Provide First Name";
    }
    if (!inputValues.lname || inputValues.lname.trim() === "") {
      errors.lname = "Provide Last Name";
    }
    if (!inputValues.gender || inputValues.gender.trim() === "") {
      errors.gender = "Provide Gender";
    }

    return errors;
  };

  return (
    <>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={modalTransition}
        className="form-holder bg-[#fafafa] p-5 rounded-md shadow-lg">
        <button
          onClick={goBack}
          className="bg-[#58a399] hover:bg-[#2e2e38] py-2 px-4 text-white font-semibold uppercase rounded-md float-right shadow-md">
          <X />
        </button>
        <h1 className="text-[#6b7280]">Add Arbs</h1>

        <input
          type="text"
          id="arb_cloa_title_no"
          name="arb_cloa_title_no"
          className="border rounded-md px-4 py-2 w-auto uppercase text-center text-gray-600 italic cursor-not-allowed"
          value={formData.landowner_cloa_title_no}
          disabled
        />
        <p className="italic text-sm text-[#6b7280] mt-5">
          All input that has{" "}
          <span className="text-red-600 font-bold text-xl"> *</span> are
          required
        </p>
        <div className="info-wrap pb-5 px-2 border border-gray-500 mt-2">
          <p className="text-base font-semibold uppercase px-2 pt-4 pb-2 italic">
            Land Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
            <div className="w-full">
              <p className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                EP/CLOA Title No.
                <span className="text-red-600 font-bold text-sm"> *</span>
              </p>
              <input
                type="text"
                id="arb_cloa_title_no"
                name="arb_cloa_title_no"
                className="border rounded-md px-4 py-2 w-full uppercase"
                placeholder="Input.."
                value={formData.arb_cloa_title_no}
                onChange={handleChange}
              />
              {errors.arb_cloa_title_no && (
                <p className="error text-red-600 font-bold text-sm mt-3">
                  {errors.arb_cloa_title_no}
                </p>
              )}
            </div>

            <div className="w-full">
              <p className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                Lot No.
                <span className="text-red-600 font-bold text-sm"> *</span>
              </p>
              <input
                type="text"
                id="arb_lot_no"
                name="arb_lot_no"
                className="border rounded-md px-4 py-2 w-full uppercase"
                placeholder="Input.."
                value={formData.arb_lot_no}
                onChange={handleChange}
              />
              {errors.arb_lot_no && (
                <p className="error text-red-600 font-bold text-sm mt-3">
                  {errors.arb_lot_no}
                </p>
              )}
            </div>

            <div className="w-full">
              <p className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                Area Obtained
                <span className="text-red-600 font-bold text-sm"> *</span>
              </p>
              <input
                type="number"
                id="arb_area_individual"
                name="arb_area_individual"
                className="border rounded-md px-4 py-2 w-full"
                placeholder="Input.."
                value={formData.arb_area_individual}
                onChange={handleChange}
              />
              {errors.arb_area_individual && (
                <p className="error text-red-600 font-bold text-sm mt-3">
                  {errors.arb_area_individual}
                </p>
              )}
            </div>
            <div className="w-full">
              <p className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                Date
                <span className="text-red-600 font-bold text-sm"> *</span>
              </p>
              <input
                type="date"
                id="date_registered"
                name="date_registered"
                className="border rounded-md px-4 py-2 w-full uppercase"
                placeholder="Input.."
                value={formData.date_registered}
                onChange={handleChange}
              />
              {errors.date_registered && (
                <p className="error text-red-600 font-bold text-sm mt-3">
                  {errors.date_registered}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="info-wrap pb-5 px-2 border border-gray-500 mt-5">
          <p className="text-base font-semibold uppercase px-2 pt-4 pb-2 italic ">
            ARB's Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
            <div className="w-full">
              <p className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                First Name
                <span className="text-red-600 font-bold text-sm"> *</span>
              </p>
              <input
                type="text"
                id="fname"
                name="fname"
                className="border rounded-md px-4 py-2 w-full"
                placeholder="Input First Name"
                value={formData.fname}
                onChange={handleChange}
              />
              {errors.fname && (
                <p className="error text-red-600 font-bold text-sm mt-3">
                  {errors.fname}
                </p>
              )}
            </div>
            <div className="w-full">
              <p className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                Middle Name
              </p>
              <input
                type="text"
                id="mname"
                name="mname"
                className="border rounded-md px-4 py-2 w-full"
                placeholder="Input Middle Name"
                value={formData.mname}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <p className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                Last Name
                <span className="text-red-600 font-bold text-sm"> *</span>
              </p>
              <input
                type="text"
                id="lname"
                name="lname"
                className="border rounded-md px-4 py-2 w-full"
                placeholder="Input Last Name"
                value={formData.lname}
                onChange={handleChange}
              />
              {errors.lname && (
                <p className="error text-red-600 font-bold text-sm mt-3">
                  {errors.lname}
                </p>
              )}
            </div>
            <div className="w-full">
              <p className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                Gender
                <span className="text-red-600 font-bold text-sm"> *</span>
              </p>
              <select
                id="gender"
                name="gender"
                className="border rounded-md px-4 py-2 w-full"
                value={formData.gender}
                onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="error text-red-600 font-bold text-sm mt-3">
                  {errors.gender}
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleRegistration}
          className="bg-[#58a399] hover:bg-[#2e2e38] py-2 px-20 text-white text-xl font-semibold uppercase rounded-md shadow-md mt-5 flex gap-2 items-center">
          <Save className="text-xl" />
          Save
        </button>
      </motion.div>
    </>
  );
}

export default AddArbs;
