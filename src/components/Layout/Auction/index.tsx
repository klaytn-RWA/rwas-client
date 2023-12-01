import { ArrowBack } from "@styled-icons/boxicons-regular";
import { useNavigate } from "react-router-dom";
import Header from "../../Header/Header";

const Auction: React.FC<{}> = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="p-4 md:ml-64 pt-20 bg-gray-100 h-screen">
        <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <ArrowBack size={24} />
          <div className="text-[18px] font-bold">Auction</div>
        </h2>
      </div>
    </>
  );
};
export default Auction;
