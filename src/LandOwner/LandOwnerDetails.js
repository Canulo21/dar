import { useState, useEffect } from "react";
import noData from "../Assets/images/no-data.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import AddLandOwner from "./AddLandOwner";
import {
  UserPlus,
  Pencil,
  Trash2,
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
} from "lucide-react";

function LandOwnerDetails() {
  const [isLastEntryActive, setIsLastEntryActive] = useState(false);
  const [isLastNameActive, setIsLastNameActive] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [sortToggle, setSortToggle] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [landOwner, setLandOwner] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    dataShowLength: 20,
  });

  const handleSort = () => {
    setSortToggle(!sortToggle);
  };

  const getAllOwner = async () => {
    try {
      const res = await axios.get("http://localhost:8080/getLandOwner");
      const land_owner = res.data;
      setLandOwner(land_owner);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

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
          .delete(`http://localhost:8080/deleteLandOwner/${userId}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            getAllOwner();
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

  const fetchUpdatedData = async () => {
    try {
      await getAllOwner();
    } catch (err) {
      console.error("Error fetching updated data:", err);
    }
  };

  useEffect(() => {
    getAllOwner();
  }, []);

  useEffect(() => {
    const newFilteredData = landOwner.filter(
      (d) =>
        d.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.mname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.corporate_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [searchTerm, landOwner]);

  const totalPage = Math.ceil(filteredData.length / pagination.dataShowLength);

  const paginationPage = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const paginationNext = () => {
    if (pagination.currentPage < totalPage) {
      setPagination({
        ...pagination,
        currentPage: pagination.currentPage + 1,
      });
    } else {
      setPagination({ ...pagination, currentPage: totalPage });
    }
  };

  const paginationPrev = () => {
    if (pagination.currentPage > 1) {
      setPagination({
        ...pagination,
        currentPage: pagination.currentPage - 1,
      });
    } else {
      setPagination({ ...pagination, currentPage: 1 });
    }
  };

  // for sorting data
  const handleLastEntry = () => {
    setTimeout(() => {
      setSortToggle(!sortToggle); // Toggle the sorting state after 2 seconds
    }, 1000);

    setIsLastEntryActive(true);
    setIsLastNameActive(false);
    const sortedArray = filteredData.slice().sort((a, b) => b.id - a.id);
    setSortedData(sortedArray);
  };

  // Sorting function for last name
  const handleLastName = () => {
    setTimeout(() => {
      setSortToggle(!sortToggle); // Toggle the sorting state after 2 seconds
    }, 1000);

    setIsLastNameActive(true);
    setIsLastEntryActive(false);
    const sortedArray = filteredData
      .slice()
      .sort((a, b) => a.lname.localeCompare(b.lname));
    setSortedData(sortedArray);
  };

  useEffect(() => {
    setSortedData(filteredData);
  }, [filteredData]);

  return (
    <>
      <div className="dashboard-wrapper bg-[#496989] h-full pt-20 pb-5 px-10 relative w-full">
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}>
          <h1 className="text-white float-left">LandOwnerDetails</h1>
        </motion.div>

        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}>
          <button
            className="flex gap-2 bg-[#58a399] hover:bg-[#2e2e38] py-3 px-4 text-white font-semibold uppercase rounded-md float-right"
            onClick={() => setShowModal(true)}>
            <UserPlus />
            Add Owner
          </button>
        </motion.div>

        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="flex gap-3 items-center float-right mr-3 text-white">
          <Search />
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </motion.div>
        {filteredData.length > 0 ? (
          <div>
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
                      Region
                    </th>
                    <th className="border border-slate-300 p-2 text-sm">
                      Province
                    </th>
                    <th className="border border-slate-300 p-2 text-sm">
                      Municipality
                    </th>
                    <th className="border border-slate-300 p-2 text-sm">
                      Barangay
                    </th>
                    <th className="border border-slate-300 p-2 text-sm">
                      Corporate Name
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData
                    .slice(
                      (pagination.currentPage - 1) * pagination.dataShowLength,
                      pagination.currentPage * pagination.dataShowLength
                    )
                    .map((d, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-slate-300 p-2 uppercase font-bold">
                          {index + 1}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase ">
                          {d.region}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase">
                          {d.province}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase">
                          {d.municipality}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase">
                          {d.barangay}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase">
                          {d.corporate_name}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase">
                          {d.fname}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase">
                          {d.mname}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase">
                          {d.lname}
                        </td>
                        <td className="border border-slate-300 p-2 uppercase">
                          <div className="flex gap-2 justify-center">
                            <Link
                              className="bg-[#2296c5] text-white hover:text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#0a3a4e]"
                              to={`/Arbs/${d.id}`}>
                              <UserPlus />
                              Add Arb
                            </Link>
                            <Link
                              className="bg-green-500 text-white hover:text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#12372a]"
                              to={`/editLandOwner/${d.id}`}>
                              <Pencil />
                              Edit
                            </Link>
                            <button
                              className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                              onClick={() => handleDelete(d.id)}>
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

            {/* Pagination controls */}
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: true, amount: 0.3 }}
              className="pagination flex gap-2 justify-center">
              <button
                className="bg-[#58a399] hover:bg-[#2e2e38] py-1 px-2 rounded-md text-white flex items-center gap-2 shadow-lg"
                onClick={() => paginationPrev()}>
                <ChevronLeft />
                Prev
              </button>
              {Array.from({ length: totalPage }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginationPage(index + 1)}
                  className={
                    pagination.currentPage === index + 1
                      ? "active btn-paginate"
                      : "btn-paginate"
                  }>
                  {index + 1}
                </button>
              ))}
              <button
                className="bg-[#58a399] hover:bg-[#2e2e38] py-1 px-2 rounded-md text-white flex items-center gap-2 shadow-lg"
                onClick={() => paginationNext()}>
                Next
                <ChevronRight />
              </button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full mt-20 text-center">
            <div className="flex justify-center">
              <img
                className="drop-shadow-2xl no-data-img"
                src={noData}
                alt="no-data"
              />
            </div>
            <h3 className="text-white text-7xl drop-shadow-xl">
              No Data Record
            </h3>
          </motion.div>
        )}

        {/* Show modal for Add landOwner */}
        {showModal ? (
          <div className="absolute inset-10 top-20 bg-[#496989]/75">
            <AddLandOwner
              setShowModal={setShowModal}
              fetchUpdatedData={fetchUpdatedData}
            />
          </div>
        ) : null}

        {/* for sorting */}
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="fixed right-9 bottom-10 text-center ">
          <div
            className={`flex flex-col w-fit gap-5 sort-holder ${
              sortToggle ? "show" : ""
            } `}>
            <button
              className={`text-white bg-[#58a399] hover:bg-[#2e2e38] py-2 px-5 rounded-xl w-auto ${
                isLastNameActive ? "active" : ""
              }`}
              onClick={handleLastName}>
              Last Name
            </button>
            <button
              className={`text-white bg-[#58a399] hover:bg-[#2e2e38] py-2 px-5 rounded-xl w-auto ${
                isLastEntryActive ? "active" : ""
              }`}
              onClick={handleLastEntry}>
              Last Entry
            </button>
          </div>
          <div
            className={`flex justify-center mt-8 sort-handler ${
              sortToggle ? "active" : ""
            }`}>
            <button
              className={`bg-[#2e2e38] text-white rounded-full w-20 h-20 flex flex-col items-center justify-center uppercase font-medium sort hover:bg-[#58a399] ${
                sortToggle ? "active bg-[#58a399]" : ""
              }`}
              onClick={handleSort}>
              <ArrowUpDown /> Sort
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default LandOwnerDetails;
