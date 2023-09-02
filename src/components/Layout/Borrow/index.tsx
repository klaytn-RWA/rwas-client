import { ArrowBack } from "@styled-icons/boxicons-regular";
import Header from "../../Header/Header";
import Message from "../../Message/Message";
import NFT from "../../NFT/NFT";
import SearchInput from "../../Search/SearchInput";
import BorrowHistory from "./BorrowHistory";

const Borrow: React.FC<{}> = () => {
  return (
    <div className="">
      <Header />
      <div className="p-4 md:ml-64 mt-14 bg-gray-100">
        <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer">
          <ArrowBack size={24} />
          <div className="text-[18px] font-bold">Borrow</div>
        </h2>
        <div className="mb-2">
          <Message title="Borrow a fund" content="Assets you own. Pick one for create a borrow request!" />
        </div>
        <div className="flex flex-col lg:flex-row justify-center space-y-4 lg:space-x-4 lg:space-y-0 mt-4">
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-4 mb-4 border border-none rounded-xl flex justify-between items-center space-x-4">
              <div className="flex-1">
                <SearchInput />
              </div>
              <div className="flex justify-center items-center space-x-2 w-1/5">
                <select className="px-4 py-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                  <option value="">Top rate</option>
                  <option value="for-rent">Low Liquidity Class</option>
                  <option value="for-sale">High Liquidity Class</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-white  border border-none rounded-xl max-h-[650px] overflow-auto p-4">
              <NFT />
              <NFT />
              <NFT />
              <NFT />
              <NFT />
            </div>
          </div>
          <div className="w-full lg:w-1/3 bg-white border border-none rounded-xl">
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
export default Borrow;
