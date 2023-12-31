import { ArrowBack } from "@styled-icons/boxicons-regular";
import { useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import BundleService from "./BundleService";
import SplitService from "./SplitService";

const NFTService: React.FC<{}> = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="p-4 md:ml-64 pt-20 bg-gray-100 h-screen">
        <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <ArrowBack size={24} />
          <div className="text-[18px] font-bold">NFT Services</div>
        </h2>

        <div className="flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0 lg:space-x-6 my-4 border border-none rounded-xl">
          <BundleService />

          <SplitService />
        </div>
      </div>
    </>
  );
};
export default NFTService;
