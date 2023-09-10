import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContractReads } from "wagmi";
import abiIntermediation from "../../../abi/TranscaIntermediation.json";
import { Asset, getAssetDetail } from "../../../redux/reducers/assetReducer";
import { Bundle, getBundleDetail } from "../../../redux/reducers/bundleReducer";
import { Intermediation } from "../../../redux/reducers/intermediationReducer";
import { useAppDispatch } from "../../../redux/store";
import PopupHistoryDetail from "../../Popup/PopupHistoryDetail";
import { usePopups } from "../../Popup/PopupProvider";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs().format("lll");

export const HistoryItem: React.FC<{ data: Intermediation; actionType: string }> = ({ data, actionType }) => {
  const [asset, setAsset] = useState<Asset>();
  const [bundle, setBundle] = useState<Bundle>();

  const dispatch = useAppDispatch();
  const { addPopup } = usePopups();

  const { data: contract } = useContractReads({
    watch: true,
    contracts: [
      {
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
        abi: abiIntermediation as any,
        functionName: "isLenderClamable",
        args: [data.borrowReqId],
      },
      {
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
        abi: abiIntermediation as any,
        functionName: "borrowDuration",
        args: [data.borrowReqId],
      },
    ],
  });

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
      dispatch(
        getBundleDetail({
          id: Number(data.nftId),
          cb: (data) => {
            if (data) {
              setBundle(data);
            }
          },
        }),
      );
    }
  }, [data.nftAddress, data.nftId, dispatch]);

  const onHandleOpenPopUp = () => {
    addPopup({
      Component: () => {
        return <PopupHistoryDetail actionType={actionType} nft={asset} bundle={bundle} borrowReq={data} />;
      },
    });
  };

  const isExpireLendCanClaimNFT = (contract as any)?.[0].result;
  const duration = (contract as any)?.[1].result;

  return (
    <div
      className="w-full flex justify-between items-center border border-gray-300 rounded-xl p-2 cursor-pointer hover:bg-gray-100"
      onClick={() => {
        onHandleOpenPopUp();
      }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-[50px] h-[50px] bg-cover border border-none rounded-xl" style={{ backgroundImage: `url(${asset ? asset.image : bundle?.uri})` }}></div>
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

      {!data.returned && data.lendOfferReqId > 0 && !isExpireLendCanClaimNFT && (
        <div className="flex flex-col justify-end">
          <div className="text-[14px] font-semibold">Expired Time:</div>

          <div className="text-[13px] text-gray-600 leading-[16px] mb-4">
            {dayjs(Number(duration) * 1000)
              .add(data.duration, "minutes")
              .toString()}
          </div>

          <div className="text-[14px] bg-[#413c69] px-2 text-center text-white font-bold border border-none rounded-xl">{Number(data.duration)} min(s)</div>
        </div>
      )}
      {isExpireLendCanClaimNFT && data.borrowedAt && (
        <div className="flex flex-col space-y-2 justify-end items-end">
          <div className="text-[14px] bg-[#413c69] px-2 text-center text-white font-bold border border-none rounded-xl">Expired</div>
          {actionType === "BORROW" && data.lenderWithdrawed && data.lenderWithdrawedAt > 0 && (
            <div className="text-[14px] bg-[#413c69] px-2 text-center text-white font-bold border border-none rounded-xl">Lender claimed your NFT</div>
          )}
          {actionType === "LEND" && data.lenderWithdrawed && data.lenderWithdrawedAt > 0 && (
            <div className="text-[14px] bg-green-500 px-2 text-center text-white font-bold border border-none rounded-xl">Claimed</div>
          )}
          {actionType === "LEND" && !data.lenderWithdrawed && isExpireLendCanClaimNFT && (
            <div className="text-[14px] bg-green-500 px-2 text-center text-white font-bold border border-none rounded-xl">You can claim NFT</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryItem;
