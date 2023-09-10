import { ArrowBack } from "@styled-icons/boxicons-regular";
import { useEffect } from "react";
import { getBorrowReqs, selectIntermediation } from "../../../redux/reducers/intermediationReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Header from "../../Header/Header";
import NFTLendItem from "../../NFT/NFTLendItem";
import SearchInput from "../../Search/SearchInput";

const Lend: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const intermediationRx = useAppSelector(selectIntermediation);

  useEffect(() => {
    dispatch(getBorrowReqs({}));
  }, []);

  const onHandleShowBorrowReqs = () => {
    let temp: Array<any> = [];
    if (!intermediationRx.loading && intermediationRx.allBorrowReqs) {
      intermediationRx.allBorrowReqs.forEach((e, i) => {
        if (!e.borrowedAt && e.amount > 0) {
          temp.push(<NFTLendItem borrowReq={e} key={i} />);
        }
      });
    }
    if (temp.length > 0) {
      return temp;
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className="p-4 md:ml-64 pt-20 bg-gray-100 h-screen">
        <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer">
          <ArrowBack size={24} />
          <div className="text-[18px] font-bold">Lend</div>
        </h2>
        <div>
          <div className="bg-white px-4 py-4 border border-none rounded-xl flex flex-col lg:flex-row justify-between items-center space-x-4">
            <div className="flex-1 pb-2 lg:pb-0">
              <SearchInput />
            </div>
            <div className="flex justify-center items-center space-x-2 max-w-[500px] min-w-[400px]">
              <select className="px-4 py-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value="">All Type</option>
                <option value="for-rent">Low Liquidity Class</option>
                <option value="for-sale">High Liquidity Class</option>
              </select>

              <select className="px-4 py-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value="">Short by</option>
                <option value="fully-furnished">Price</option>
                <option value="partially-furnished">Mint date</option>
              </select>
            </div>
          </div>
          {!onHandleShowBorrowReqs() ? (
            <div className="text-center flex justify-center items-center  border border-none rounded-xl min-h-[600px] bg-white my-4 font-bold">Empty</div>
          ) : (
            <div className="flex jusitfy-center items-center flex-wrap bg-white my-4 border border-none rounded-xl">{onHandleShowBorrowReqs()}</div>
          )}
        </div>
      </div>
    </>
  );
};
export default Lend;
