import { CheckCircle, Circle } from "@styled-icons/bootstrap";
import { FileSignature, Warehouse } from "@styled-icons/fa-solid";
import { LocalShipping } from "@styled-icons/material-outlined";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { getRequestMint, selectAsset } from "../../redux/reducers/assetReducer";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import Popup from "./Popup";

const PopUpRequestHistory: React.FC<{}> = () => {
  const { address, isConnected } = useAccount();
  const dispatch = useAppDispatch();
  const assetRx = useAppSelector(selectAsset);

  useEffect(() => {
    dispatch(getRequestMint({}));
  }, [dispatch]);

  console.log("7s200:asset", assetRx);

  const onShowReqs = () => {
    let temp = null;
    if (!assetRx.loading && assetRx.reqs.length > 0) {
      temp = assetRx.reqs.map((e, i) => {
        if (address && isConnected && address === e.owner) {
          return (
            <div key={i} className="flex space-x-2 border border-2 rounded-2xl p-4 shadow-xl my-4">
              <div className="flex justify-center space-x-2 w-1/7">
                <img className="w-[100px] h-[150px] border border-none rounded-2xl" src={e.image} />
              </div>
              {/* Shipping */}
              <div className="flex justify-center items-center w-full my-4 border boder-2 rounded-xl py-3">
                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className="relative border border-none rounded-full p-2 bg-blue-500 text-white text-sm">
                    <CheckCircle className="flex justify-center items-center mx-auto" size={20} />
                    <p className="absolute top-[14px] left-7 w-[125px] h-[8px] bg-blue-500"></p>
                  </div>
                  <div className="max-w-[100px] flex justify-center items-center space-x-1 mt-2 font-bold">
                    <LocalShipping size={26} />
                    <p className="text-[13px]">Shipping to Ha Noi</p>
                  </div>
                </div>

                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className="relative border border-none rounded-full p-2 bg-blue-500 text-white text-sm">
                    <CheckCircle className="flex justify-center items-center mx-auto" size={20} />
                    <p className="absolute top-[14px] left-7 w-[125px] h-[8px] bg-blue-500"></p>
                  </div>
                  <div className="max-w-[100px] flex justify-center items-center space-x-1 mt-2 font-bold">
                    <Warehouse size={26} />
                    <p className="text-[13px]">Enter the warehouse</p>
                  </div>
                </div>

                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className={`relative border border-none rounded-full p-2 text-white text-sm ${e.isStockerSign ? "bg-blue-500" : "bg-gray-300"}`}>
                    {e.isStockerSign ? (
                      <CheckCircle className="flex justify-center items-center mx-auto" size={20} />
                    ) : (
                      <Circle className="flex justify-center items-center mx-auto" size={20} />
                    )}
                    <p className={`absolute top-[14px] left-7 w-[125px] h-[8px] ${e.isStockerSign ? "bg-blue-500" : "bg-gray-300"}`}></p>
                  </div>
                  <div className={`max-w-[100px] flex justify-center items-center space-x-1 mt-2 ${e.isStockerSign && "font-bold"}`}>
                    <FileSignature size={26} />
                    <p className="text-[13px]">Stocker signed</p>
                  </div>
                </div>

                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className={`relative border border-none rounded-full p-2 text-white text-sm ${e.isAuditSign ? "bg-blue-500" : "bg-gray-300"}`}>
                    {e.isAuditSign ? (
                      <CheckCircle className="flex justify-center items-center mx-auto" size={20} />
                    ) : (
                      <Circle className="flex justify-center items-center mx-auto" size={20} />
                    )}
                    <p className={`absolute top-[14px] left-7 w-[100px] h-[8px] z-0 ${e.isAuditSign ? "bg-blue-500" : "bg-gray-300"}`}></p>
                  </div>
                  <div className={`max-w-[100px] flex justify-center items-center space-x-1 mt-2 ${e.isAuditSign && "font-bold"}`}>
                    <FileSignature size={26} />
                    <p className="text-[13px]">Auditer signed</p>
                  </div>
                </div>

                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className={`border border-none rounded-full z-50 p-2 text-white text-sm ${e.executed ? "bg-blue-500" : "bg-gray-300"}`}>
                    {e.executed ? (
                      <CheckCircle className="flex justify-center items-center mx-auto" size={20} />
                    ) : (
                      <Circle className="flex justify-center items-center mx-auto" size={20} />
                    )}
                  </div>
                  <div className={`max-w-[100px] flex justify-center items-center space-x-1 mt-2 ${e.executed && "font-bold"}`}>
                    <img src="/icons/card.png" className="h-[24px] w-[24px]" alt="" />
                    <p className="text-[13px]">RWAs NFT minted</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      });
    }
    return temp;
  };

  return (
    <Popup className="bg-gray-50 min-w-[800px]">
      <h1 className="mb-4 text-center font-bold text-[20px]">Your Requests</h1>
      {assetRx.loading ? <></> : <div>{onShowReqs()}</div>}
    </Popup>
  );
};

export default PopUpRequestHistory;
