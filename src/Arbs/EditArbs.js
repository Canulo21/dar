import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { X, Save } from "lucide-react";

// Function to format the date string to "yyyy-MM-dd" format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  let day = date.getDate().toString().padStart(2, "0"); // Correctly extract day
  return `${year}-${month}-${day}`;
};

function EditArbs({ setShowModalEdit, handlRefresh, Id }) {
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
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
    setShowModalEdit(false);
    handlRefresh();
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/viewArb/${Id}`)
      .then((res) => {
        const getData = res.data;
        const formattedDate = formatDate(getData.date_registered);
        setFormData({ ...getData, date_registered: formattedDate });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    setErrors(validateValues(formData));

    try {
      const updatedFormData = await axios.put(
        `http://localhost:8080/editArb/${Id}`,
        {
          data: formData,
        }
      );
      if (updatedFormData.data.updated) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Updated Successful!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.log(err);
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
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={modalTransition}
        className="form-holder bg-[#fafafa] p-5 rounded-md shadow-lg w-full">
        <button
          onClick={goBack}
          className="bg-[#58a399] hover:bg-[#2e2e38] py-2 px-4 text-white font-semibold uppercase rounded-md float-right shadow-md">
          <X />
        </button>
        <h1 className="text-[#6b7280]">Edit Arbs</h1>

        <p className="font-semibold text-xl italic text-red-600">
          ID : {formData.id}
        </p>
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
          onClick={handleUpdate}
          className="bg-[#58a399] hover:bg-[#2e2e38] py-2 px-20 text-white text-xl font-semibold uppercase rounded-md shadow-md mt-5 flex gap-2 items-center">
          <Save className="text-xl" />
          Update
        </button>
      </motion.div>
    </>
  );
}

export default EditArbs;
