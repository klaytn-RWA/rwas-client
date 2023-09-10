import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import BorrowHistory from "./BorrowHistory";
import LendHistory from "./LendHistory";

const History: React.FC<{}> = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div className="p-4 md:ml-64 pt-20 bg-gray-100 h-screen">
        <div className="flex space-x-2 items-center">
          <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <ArrowBack size={24} />
            <div className="text-[18px] font-bold">History</div>
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row justify-center space-y-4 lg:space-x-4 lg:space-y-0 mt-4">
          <div className="w-full lg:w-1/2 bg-white border border-none rounded-xl">
            <h3 className="text-[16px] font-bold mx-4 my-4">Your Loans</h3>
            <div className="mx-4">
              <LendHistory />
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-white border border-none rounded-xl">
            <h3 className="text-[16px] font-bold mx-4 my-4">Your Borrowing</h3>
            <div className="mx-4">
              <BorrowHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default History;
