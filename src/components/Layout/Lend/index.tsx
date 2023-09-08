import { ArrowBack } from "@styled-icons/boxicons-regular";
import { writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import { useEffect } from "react";
import abiIntermadiation from "../../../abi/TranscaIntermediation.json";
import { getBorrowReqs, selectIntermediation } from "../../../redux/reducers/intermediationReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Button from "../../Button/Button";
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
    let temp = null;
    if (!intermediationRx.loading && intermediationRx.allBorrowReqs) {
      console.log("7s201:allBorrowReqs", intermediationRx.allBorrowReqs);
      temp = intermediationRx.allBorrowReqs.map((e, i) => {
        if (!e.borrowedAt) {
          return <NFTLendItem borrowReq={e} />;
        }
      });
    }
    return temp;
  };

  const onHandleLend = async () => {
    const createLendOffer = await writeContract({
      address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
      abi: abiIntermadiation,
      functionName: "createLendOffer",
      args: [1, ethers.utils.parseUnits("1000000", 18)],
    });
    console.log("7s200:createOffer", createLendOffer);
  };
  const onHandleReturnTheMoney = async () => {
    const returnMoney = await writeContract({
      address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
      abi: abiIntermadiation,
      functionName: "returnTheMoney",
      args: [1],
    });
    console.log("7s200:createOffer", returnMoney);
  };
  const onHandleClaimNFT = async () => {};

  return (
    <>
      <Header />
      <div className="p-4 md:ml-64 mt-14 bg-gray-100 h-screen">
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
          <div className="flex jusitfy-center items-center flex-wrap bg-white my-4 border border-none rounded-xl">{onHandleShowBorrowReqs()}</div>
        </div>

        <div className="flex space-x-4 justify-center items-center my-4">
          <Button
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
            onClick={() => onHandleLend()}
          >
            Lend
          </Button>
          <Button
            className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
            onClick={() => onHandleReturnTheMoney()}
          >
            Return Money
          </Button>
          <Button
            className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
            onClick={() => onHandleClaimNFT()}
          >
            Claim NFT
          </Button>
        </div>
      </div>
    </>
  );
};
export default Lend;
