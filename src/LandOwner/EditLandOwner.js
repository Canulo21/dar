import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { NavLink, useParams } from "react-router-dom";
import phil from "phil-reg-prov-mun-brgy";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import axios from "axios";
// import SingleArbs from "../Arbs/SingleArbs";

function EditLandOwner() {
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    landowner_cloa_title_no: "",
    landowner_lot_no: "",
    area_amended: "",
    fname: "",
    mname: "",
    lname: "",
    corporate_name: "",
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    prog_type: "",
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/viewLandOwner/${id}`)
      .then((res) => {
        const getData = res.data;
        setFormData(getData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors(validateValues(formData));

    try {
      const updateFormData = await axios.put(
        `http://localhost:8080/editLandOwner/${id}`,
        {
          data: formData,
        }
      );

      if (updateFormData.data.updated) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Updated Successful!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: err.response.data.error,
        });
      }
    }
  };

  const [getProv, setGetProv] = useState("");
  const [getMun, setGetMun] = useState("");
  const [getBrgy, setGetBrgy] = useState("");
  const [filterProvince, setFilterProvince] = useState([]);
  const [filterMun, setFilterMun] = useState([]);
  const [filterBrgy, setFilterBrgy] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Find the selected option within the select element
    const selectedOption = e.target.querySelector("option:checked");
    if (selectedOption) {
      const selectedProvinceCode = selectedOption.getAttribute("data-reg-code");
      const selectMuniCode = selectedOption.getAttribute("data-prov-code");
      const selectBrgyCode = selectedOption.getAttribute("data-mun-code");
      setGetProv(selectedProvinceCode);
      setGetMun(selectMuniCode);
      setGetBrgy(selectBrgyCode);
    }
  };

  useEffect(() => {
    // Update filterProvince when getProv changess
    if (getProv) {
      const provinces = phil.getProvincesByRegion(getProv);
      setFilterProvince(provinces);
    }

    if (getMun) {
      const municipalities = phil.getCityMunByProvince(getMun);
      setFilterMun(municipalities);
    }
    if (getBrgy) {
      const barangays = phil.getBarangayByMun(getBrgy);
      setFilterBrgy(barangays);
    }
  }, [getProv, getMun, getBrgy]);

  const validateValues = (inputValues) => {
    let errors = {};

    if (!inputValues.region || inputValues.region.trim() === "") {
      errors.region = "Provide Region";
    }
    if (!inputValues.province || inputValues.province.trim() === "") {
      errors.province = "Provide Province";
    }
    if (!inputValues.municipality || inputValues.municipality.trim() === "") {
      errors.municipality = "Provide Municipality";
    }
    if (!inputValues.barangay || inputValues.barangay.trim() === "") {
      errors.barangay = "Provide Barangay";
    }
    if (
      !inputValues.landowner_cloa_title_no ||
      inputValues.landowner_cloa_title_no.trim() === ""
    ) {
      errors.landowner_cloa_title_no = "Provide CLOA Title No.";
    }
    if (!inputValues.area_amended || inputValues.area_amended.trim() === "") {
      errors.area_amended = "Provide Area Amended";
    }
    if (!inputValues.prog_type || inputValues.prog_type.trim() === "") {
      errors.prog_type = "Provide Type";
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
    <div className="pt-20 px-10 pb-5 w-full h-fit">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={modalTransition}
        className="form-holder bg-[#fafafa] p-5 rounded-md shadow-lg col-span-3">
        <NavLink
          to={"/land-owner"}
          className="bg-[#58a399] hover:bg-[#2e2e38] py-2 px-4 text-white font-semibold uppercase rounded-md float-right shadow-md">
          <X />
        </NavLink>
        <div>
          <h1 className="text-[#6b7280]">Update Owner here</h1>
          <p className="italic text-sm text-[#6b7280]">
            All input that has{" "}
            <span className="text-red-600 font-bold text-xl"> *</span> are
            required
          </p>
          <div className="info-wrap pb-5 px-2 border border-gray-500">
            <p className="text-base font-semibold uppercase px-2 pt-4 pb-2 italic">
              Address:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              <div className="w-full">
                <label
                  htmlFor="region"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Region
                  <span className="text-red-600 font-bold text-sm"> *</span>
                </label>
                <select
                  className="border rounded-md px-4 py-2 w-full"
                  name="region"
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleChange(e)}>
                  {phil.regions.map((region, index) => (
                    <option
                      key={index}
                      value={region.name}
                      data-reg-code={region.reg_code}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.region}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="province"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Province
                  <span className="text-red-600 font-bold text-sm"> *</span>
                </label>
                <select
                  className="border rounded-md px-4 py-2 w-full"
                  name="province"
                  id="province"
                  value={formData.province}
                  onChange={(e) => handleChange(e)}>
                  <option value={formData.province}>{formData.province}</option>
                  {filterProvince.map((province, index) => (
                    <option
                      key={index}
                      value={province.name}
                      data-prov-code={province.prov_code}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.province}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="municipality"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Municipality
                  <span className="text-red-600 font-bold text-sm"> *</span>
                </label>
                <select
                  className="border rounded-md px-4 py-2 w-full"
                  name="municipality"
                  id="municipality"
                  value={formData.municipality}
                  onChange={(e) => handleChange(e)}>
                  <option value={formData.municipality}>
                    {formData.municipality}
                  </option>
                  {filterMun.map((mun, index) => (
                    <option
                      key={index}
                      value={mun.name}
                      data-mun-code={mun.mun_code}>
                      {mun.name}
                    </option>
                  ))}
                </select>
                {errors.municipality && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.municipality}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="barangay"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Barangay
                  <span className="text-red-600 font-bold text-sm"> *</span>
                </label>
                <select
                  className="border rounded-md px-4 py-2 w-full"
                  name="barangay"
                  id="barangay"
                  value={formData.barangay}
                  onChange={(e) => handleChange(e)}>
                  <option value={formData.barangay}>{formData.barangay}</option>
                  {filterBrgy.map((brgy, index) => (
                    <option
                      key={index}
                      value={brgy.name}
                      data-brgy-code={brgy.mun_code}>
                      {brgy.name}
                    </option>
                  ))}
                </select>
                {errors.barangay && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.barangay}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="info-wrap pb-5 px-2 border border-gray-500 mt-5">
            <p className="text-base font-semibold uppercase px-2 pt-4 pb-2 italic ">
              Owner/Corporate Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              <div className="w-full">
                <label
                  htmlFor="fname"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  First Name
                </label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  className="border rounded-md px-4 py-2 w-full"
                  placeholder="Input First Name"
                  value={formData.fname}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="mname"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Middle Name
                </label>
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
                <label
                  htmlFor="lname"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  className="border rounded-md px-4 py-2 w-full"
                  placeholder="Input Last Name"
                  value={formData.lname}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="corporate_name"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Corporate
                </label>
                <input
                  type="text"
                  id="corporate_name"
                  name="corporate_name"
                  value={formData.corporate_name}
                  onChange={handleChange}
                  className="border rounded-md px-4 py-2 w-full"
                  placeholder="Input Corporate (if corporate)"
                />
              </div>
            </div>
          </div>
          <div className="info-wrap pb-5 px-2 border border-gray-500 mt-5">
            <p className="text-base font-semibold uppercase px-2 pt-4 pb-2 italic">
              Land Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              <div className="w-full">
                <label
                  htmlFor="prog_type"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Prog Type/Claim Class
                  <span className="text-red-600 font-bold text-sm"> *</span>
                </label>
                <input
                  type="text"
                  id="prog_type"
                  name="prog_type"
                  className="border rounded-md px-4 py-2 w-full uppercase"
                  placeholder="Input.."
                  value={formData.prog_type}
                  onChange={handleChange}
                />
                {errors.prog_type && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.prog_type}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="landowner_cloa_title_no"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  EP/CLOA Title No.
                  <span className="text-red-600 font-bold text-sm"> *</span>
                </label>
                <input
                  type="text"
                  id="landowner_cloa_title_no"
                  name="landowner_cloa_title_no"
                  className="border rounded-md px-4 py-2 w-full uppercase"
                  placeholder="Input.."
                  value={formData.landowner_cloa_title_no}
                  onChange={handleChange}
                />
                {errors.landowner_cloa_title_no && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.landowner_cloa_title_no}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="landowner_lot_no"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Lot No.
                </label>
                <input
                  type="text"
                  id="landowner_lot_no"
                  name="landowner_lot_no"
                  className="border rounded-md px-4 py-2 w-full uppercase"
                  placeholder="Input.."
                  value={formData.landowner_lot_no}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="area_amended"
                  className="text-sm font-semibold uppercase px-2 pt-4 pb-2 text-[#6b7280]">
                  Area Amended
                  <span className="text-red-600 font-bold text-sm"> *</span>
                </label>
                <input
                  type="number"
                  id="area_amended"
                  name="area_amended"
                  className="border rounded-md px-4 py-2 w-full"
                  placeholder="Input.."
                  value={formData.area_amended}
                  onChange={handleChange}
                />
                {errors.area_amended && (
                  <p className="error text-red-600 font-bold text-sm mt-3">
                    {errors.area_amended}
                  </p>
                )}
              </div>
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
    </div>
  );
}

export default EditLandOwner;
