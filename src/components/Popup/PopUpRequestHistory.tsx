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
  console.log("7s200:", assetRx);

  const onShowReqs = () => {
    let temp = null;
    if (!assetRx.loading && assetRx.reqs.length > 0) {
      temp = assetRx.reqs.map((e, i) => {
        if (address && isConnected) {
          return (
            <div key={i} className="flex space-x-2 border border-2 rounded-2xl p-4 shadow-xl my-4">
              <div className="flex justify-center space-x-2 w-1/7">
                <img className="w-[100px] h-[150px] border border-none rounded-2xl" src={e.image} />
              </div>
              {/* Shipping */}
              <div className="flex justify-center items-center w-full my-4 border boder-2 rounded-2xl py-3">
                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className="relative border border-none rounded-full p-4 bg-blue-500 text-white text-sm">
                    <p className="absolute top-[14px] left-7 w-[125px] h-[8px] bg-blue-500"></p>
                  </div>
                  <div>Shipping</div>
                </div>

                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className="relative border border-none rounded-full p-4 bg-blue-500 text-white text-sm">
                    <p className="absolute top-[14px] left-7 w-[125px] h-[8px] bg-blue-500"></p>
                  </div>
                  <div>HaNoi Vault</div>
                </div>

                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className="relative border border-none rounded-full p-4 bg-blue-500 text-white text-sm">
                    <p className="absolute top-[14px] left-7 w-[125px] h-[8px] bg-blue-500"></p>
                  </div>
                  <div>Stock Sign</div>
                </div>

                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className="relative border border-none rounded-full p-4 bg-blue-500 text-white text-sm">
                    <p className="absolute top-[14px] left-7 w-[125px] h-[8px] bg-blue-500"></p>
                  </div>
                  <div>Audit sign</div>
                </div>

                <div className="w-1/5 flex flex-col justify-center items-center">
                  <div className="border border-none rounded-full p-4 bg-blue-500 text-white text-sm"></div>
                  <div>NFT</div>
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
