import { ArrowBack } from "@styled-icons/boxicons-regular";
import { writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import abiIntermadiation from "../../../abi/TranscaIntermediation.json";
import Button from "../../Button/Button";
import Header from "../../Header/Header";

const Lend: React.FC<{}> = () => {
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
