import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SquareGanttChart } from "lucide-react";

function SingleArbs(props) {
  const [getLandOwnerCloa, setGetLandOwnerCloa] = useState("");
  const [totalArbs, setTotalArbs] = useState(0);
  const [count, setCount] = useState(0); // State for the running count
  const { id } = props;

  const navigate = useNavigate();
  const goToAbr = () => {
    navigate(`/LandOwner/Arbs/${id}`, {
      state: { id: id, getLandOwnerCloa: getLandOwnerCloa },
    });
  };

  useEffect(() => {
    const fetchLandOnwer = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/viewLandOwner/${id}`
        );
        console.log("data here", res.data.landowner_cloa_title_no);
        setGetLandOwnerCloa(res.data.landowner_cloa_title_no);
      } catch (err) {}
    };

    fetchLandOnwer();
  }, [id]);

  useEffect(() => {
    const fetchArbs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/LandOwner/Arbs/${id}`
        );
        console.log("data here", res);
        const total = res.data.length;
        setTotalArbs(total);
      } catch (err) {
        console.log(err);
      }
    };

    fetchArbs();
  }, [id]); // Include id in the dependency array

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < totalArbs) {
        setCount((prevCount) => prevCount + 1);
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust the interval duration as needed

    return () => clearInterval(interval); // Cleanup function
  }, [count, totalArbs]); // Include count and totalArbs in the dependency array

  return (
    <>
      <div className="h-full">
        <div className="form-holder bg-[#fafafa] p-5 rounded-md shadow-lg h-full flex justify-center items-center flex-col">
          <div>
            <h2 className="text-[#6b7280] text-center text-5xl">Total ARB's</h2>
          </div>
          <div className="wrapper inline-block">
            <div className="text-center mt-5">
              <span className="count text-9xl">{count}</span>{" "}
            </div>
          </div>
          <div className="button-holder w-full mt-5">
            <button
              onClick={goToAbr}
              className="bg-[#58a399] hover:bg-[#2e2e38] py-2 px-20 text-white  text-3xl font-semibold uppercase rounded-md shadow-md mt-5 w-full flex gap-2 justify-center items-center">
              <SquareGanttChart />
              View List
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleArbs;
