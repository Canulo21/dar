import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import { UserPlus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Pencil, Trash2 } from "lucide-react";
import AddArbs from "./AddArbs";
import EditArbs from "./EditArbs";
import noData from "../Assets/images/no-data.png";

function ArbsDetails() {
  const [theId, setTheId] = useState(0);
  const [getArb, setGetArb] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  // get Id From SingleArbs
  const location = useLocation();
  const getId = location.state.id;

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This function takes the user back to the previous page
  };

  const fetchArbs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/LandOwner/Arbs/${getId}`
      );
      const listArb = res.data;

      setGetArb(listArb);
    } catch (err) {
      console.log(err);
    }
  };
  const handlRefresh = () => {
    fetchArbs(); // Refresh data when going back
  };

  useEffect(() => {
    fetchArbs();
  }, []);

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/deleteArb/${userId}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            fetchArbs();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Delete Failed",
              text: error.response
                ? error.response.data.error
                : "An unexpected error occurred. Please try again later.",
            });
          });
      }
    });
  };

  // Function to format date
  const formatDate = (dateString) => {
    // Parse the date string
    const date = new Date(dateString);
    // Format the date as desired
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  };

  const goEdit = async (id) => {
    setShowModalEdit(true);
    setTheId(id);
  };

  return (
    <>
      <div className="dashboard-wrapper bg-[#496989] pt-20 pb-5 px-10 relative w-full">
        <div className="mb-8">
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}>
            <p className="uppercase text-white font-semibold text-lg text-center italic">
              EP/CLOA Title No. From Land Owner
            </p>
          </motion.div>
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}>
            <p className="uppercase text-white font-semibold text-3xl italic text-center">
              {" "}
              {getArb.length > 0 ? getArb[0].landowner_cloa_title_no : ""}
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}>
          <h1 className="text-white float-left">ARB's List</h1>
        </motion.div>
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}>
          <button
            onClick={goBack}
            className="flex gap-2 bg-[#2e2e38] hover:bg-[#58a399] py-3 px-4 text-white hover:text-white font-semibold uppercase rounded-md float-right ml-3">
            <X />
          </button>
        </motion.div>
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}>
          <button
            onClick={() => setShowModal(true)}
            className="flex gap-2 bg-[#58a399] hover:bg-[#2e2e38] py-3 px-4 text-white font-semibold uppercase rounded-md  float-right">
            <UserPlus />
            Add ARB
          </button>
        </motion.div>
        {getArb.length > 0 ? (
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
            className="table-holder">
            <table className="table-auto mt-2 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5 ">
              <thead>
                <tr>
                  <th className="border border-slate-300 p-2 text-sm">No.</th>
                  <th className="border border-slate-300 p-2 text-sm">
                    EP/CLOA Title No.
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Lot No.
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">Area</th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Date Of Registration
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">
                    First Name
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Middle Name
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Last Name
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Gender
                  </th>
                  <th className="border border-slate-300 p-2 text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {getArb.map((d, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-slate-300 p-2 uppercase font-bold">
                      {index + 1}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase ">
                      {d.arb_cloa_title_no}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase ">
                      {d.arb_lot_no}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase ">
                      {d.arb_area_individual}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase ">
                      {formatDate(d.date_registered)}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase ">
                      {d.fname}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase ">
                      {d.mname}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase ">
                      {d.lname}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase ">
                      {d.gender}
                    </td>
                    <td className="border border-slate-300 p-2 uppercase">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#12372a]"
                          onClick={() => goEdit(d.arb_id)}>
                          <Pencil />
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                          onClick={() => handleDelete(d.arb_id)}>
                          <Trash2 />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full mt-20 text-center">
            <div className="flex justify-center w-full">
              <img
                className="drop-shadow-2xl no-data-img"
                src={noData}
                alt="no-data"
              />
            </div>
            <h3 className="text-white text-center text-7xl drop-shadow-xl">
              No Data Record
            </h3>
          </motion.div>
        )}

        {/* Show modal for Add landOwner */}
        {showModal ? (
          <div className="absolute inset-10 top-20 bg-[#496989]/75">
            <AddArbs setShowModal={setShowModal} handlRefresh={handlRefresh} />
          </div>
        ) : null}

        {/* Show modal for Add landOwner */}
        {showModalEdit ? (
          <div className="absolute inset-10 top-20 bg-[#496989]/75">
            <EditArbs
              setShowModalEdit={setShowModalEdit}
              handlRefresh={handlRefresh}
              Id={theId}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}

export default ArbsDetails;
