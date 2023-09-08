import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContractReads } from "wagmi";
import abiIntermediation from "../../../abi/TranscaIntermediation.json";
import { Asset, getAssetDetail } from "../../../redux/reducers/assetReducer";
import { Intermediation } from "../../../redux/reducers/intermediationReducer";
import { useAppDispatch } from "../../../redux/store";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs().format("lll");

// const BorrowHistoryItem: React.FC<{ data: Intermediation }> = ({ data }) => {
//   return (
//     <div className="w-full flex justify-between items-center border border-gray-300 rounded-xl p-2 cursor-pointer hover:bg-gray-100">
//       <div className="flex items-center space-x-2">
//         <div className="w-[50px] h-[50px] bg-blue-200 border border-none rounded-xl"></div>
//         <div>
//           <div className="flex space-x-1 text-[16px] leading-[20px]">
//             <div className="font-normal text-gray-900">{ethers.utils.formatUnits(data.amount.toString(), 18).toString()}</div>
//             <span className="font-semibold text-gray-900">USDT</span>
//           </div>
//           <div className="text-[13px] text-gray-600 leading-[16px]">
//             {data.borrowedAt > 0 ? dayjs(Number(data.borrowedAt) * 1000).format("DD/MM/YYYY HH:MM:ss") : dayjs(Number(data.createdAt) * 1000).format("DD/MM/YYYY HH:MM:ss")}
//           </div>
//           <div className="flex space-x-3">
//             <div className="text-[13px] font-normal text-gray-700">
//               Id: <span className="font-bold text-gray-900">#{Number(data.borrowReqId)}</span>
//             </div>
//             <div className="text-[13px] font-normal text-gray-700">
//               Duration: <span className="font-bold text-gray-900">{Number(data.duration) / 60} min(s)</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {data.returned && data.returnedAt > 0 && (
//         <div className="flex flex-col justify-end items-end">
//           <div className="text-[14px] bg-green-700 px-2 text-center text-white font-bold border border-none rounded-xl">Loan Paid</div>
//         </div>
//       )}

//       {!data.returned && data.lendOfferReqId > 0 && (
//         <div className="flex flex-col justify-end items-end">
//           <div className="text-[14px] font-semibold">Expire Loan</div>
//           <div className="text-[13px] text-gray-600 leading-[16px]">{dayjs((Number(data.borrowedAt) + Number(data.duration) * 60) * 1000).format("DD/MM/YYYY HH:MM:ss")}</div>
//           <div className="text-[14px] bg-[#413c69] px-2 text-center text-white font-bold border border-none rounded-xl">10 Days</div>
//         </div>
//       )}
//     </div>
//   );
// };

export const HistoryItem: React.FC<{ data: Intermediation; actionType: string }> = ({ data, actionType }) => {
  const [asset, setAsset] = useState<Asset>();

  const dispatch = useAppDispatch();
  const [lendLoading, setLendLoading] = useState(false);

  useEffect(() => {
    if (data.nftAddress === import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!) {
      dispatch(
        getAssetDetail({
          id: Number(data.nftId),
          cb: (data) => {
            if (data) {
              setAsset(data);
            }
          },
        }),
      );
    }
    if (data.nftAddress === import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!) {
    }
  }, []);

  const onHandleOpenPopUp = () => {};

  const {
    data: contract,
    isError: contractError,
    isLoading: contractLoading,
    isFetched: contractFetched,
  } = useContractReads({
    watch: true,
    contracts: [
      {
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
        abi: abiIntermediation as any,
        functionName: "borrowDuration",
        args: [3n],
      },
    ],
  });
  console.log("7s2003:contract", contract);

  return (
    <div
      className="w-full flex justify-between items-center border border-gray-300 rounded-xl p-2 cursor-pointer hover:bg-gray-100"
      onClick={() => {
        onHandleOpenPopUp();
      }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-[50px] h-[50px] bg-cover border border-none rounded-xl" style={{ backgroundImage: `url(${asset?.image!})` }}></div>
        <div>
          <div className="flex space-x-1 text-[16px] leading-[20px]">
            <div className="font-normal text-gray-900">{ethers.utils.formatUnits(data.amount.toString(), 18).toString()}</div>
            <span className="font-semibold text-gray-900">USDT</span>
          </div>
          <div className="text-[13px] text-gray-600 leading-[16px]">
            {data.borrowedAt > 0 ? dayjs(Number(data.borrowedAt) * 1000).format("DD/MM/YYYY HH:MM:ss") : dayjs(Number(data.createdAt) * 1000).format("DD/MM/YYYY HH:MM:ss")}
          </div>
          <div className="flex space-x-3">
            <div className="text-[13px] font-normal text-gray-700">
              Id: <span className="font-bold text-gray-900">#{Number(data.borrowReqId)}</span>
            </div>
            <div className="text-[13px] font-normal text-gray-700">
              Duration: <span className="font-bold text-gray-900">{Number(data.duration)} min(s)</span>
            </div>
          </div>
        </div>
      </div>

      {data.returned && data.returnedAt > 0 && (
        <div className="flex flex-col justify-end items-end">
          <div className="text-[14px] bg-green-700 px-2 text-center text-white font-bold border border-none rounded-xl">Loan Paid</div>
        </div>
      )}

      {!data.returned && data.lendOfferReqId > 0 && (
        <div className="flex flex-col justify-end items-end">
          <div className="text-[14px] font-semibold">Expire Loan</div>
          <div className="text-[13px] text-gray-600 leading-[16px]">{dayjs((Number(data.borrowedAt) + Number(data.duration) * 60) * 1000).format("DD/MM/YYYY HH:MM:ss")}</div>
          <div className="text-[14px] bg-[#413c69] px-2 text-center text-white font-bold border border-none rounded-xl">{Number(data.duration)} min(s)</div>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;
