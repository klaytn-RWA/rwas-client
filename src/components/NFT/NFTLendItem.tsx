import { ConnectButton } from "@rainbow-me/rainbowkit";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import abiIntermadiation from "../../abi/TranscaIntermediation.json";
import { Asset, getAssetDetail } from "../../redux/reducers/assetReducer";
import { Bundle, getBundleDetail } from "../../redux/reducers/bundleReducer";
import { getBorrowReqs, Intermediation } from "../../redux/reducers/intermediationReducer";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../redux/store";
import Button from "../Button/Button";
import BundleNFT from "./BundleNFT";
import NFTCard from "./NFTCard";

const NFTLendItem: React.FC<{ borrowReq: Intermediation }> = ({ borrowReq }) => {
  const [asset, setAsset] = useState<Asset>();
  const [bundle, setBundle] = useState<Bundle>();
  const dispatch = useAppDispatch();
  const [lendLoading, setLendLoading] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (borrowReq.nftAddress === import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!) {
      dispatch(
        getAssetDetail({
          id: Number(borrowReq.nftId),
          cb: (data) => {
            if (data) {
              setAsset(data);
            }
          },
        }),
      );
    }
    if (borrowReq.nftAddress === import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!) {
      dispatch(
        getBundleDetail({
          id: Number(borrowReq.nftId),
          cb: (data) => {
            if (data) {
              setBundle(data);
            }
          },
        }),
      );
    }
  }, []);

  const onHandleLend = async () => {
    setLendLoading(true);
    if (borrowReq.creator === address) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Can not lending for yourself",
          type: "error",
        }),
      );
      setLendLoading(false);
      return;
    }
    try {
      const createLendOffer = await writeContract({
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
        abi: abiIntermadiation,
        functionName: "createLendOffer",
        args: [Number(borrowReq.borrowReqId), borrowReq.amount],
      });
      if (createLendOffer.hash) {
        const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: createLendOffer.hash });
        if (waitTranscation.status === "success") {
          dispatch(getBorrowReqs({}));

          dispatch(
            setToast({
              show: true,
              title: "",
              message: "Pay loan success",
              type: "success",
            }),
          );
          setLendLoading(false);
          return;
        } else {
          dispatch(
            setToast({
              show: true,
              title: "",
              message: "Transcation wrong!",
              type: "error",
            }),
          );
          return;
        }
      } else {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Something wrong",
            type: "error",
          }),
        );
        setLendLoading(false);
      }
    } catch (error) {
      setLendLoading(false);
    }
  };

  return (
    <div className="px-2 border border shadow-xl rounded-xl m-4">
      {asset && (
        <div className="flex justify-center items-center">
          <NFTCard nftData={asset} />
        </div>
      )}
      {bundle && (
        <div className="flex justify-center items-center">
          <BundleNFT bundle={bundle} />
        </div>
      )}
      <div className="flex flex-col space-y-1 border border-gray-500 rounded-xl p-2 bg-gray-100">
        <div className="flex space-x-1">
          <div className="w-1/2 px-2 py-1 flex space-x-1 text-[13px]">
            <div className="">Id:</div>
            <div className="font-semibold">#{borrowReq.nftId.toString()}</div>
          </div>
          <div className="w-1/2 px-2 py-1 flex space-x-1 text-[13px]">
            <div className="">Dur:</div>
            <div className="font-semibold">{Number(borrowReq.duration)} min(s)</div>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="w-1/2 text-white px-2 py-1 flex justify-between space-x-1 text-[13px] border border-none rounded-xl bg-red-600">
            <div className="">Loan:</div>
            <div className="font-semibold">{ethers.utils.formatUnits(borrowReq.amount.toString()).toString()}$</div>
          </div>
          <div className="w-1/2 text-white px-2 py-1 flex justify-between space-x-1 text-[13px] border border-none rounded-xl bg-green-600">
            <div className="">Rate:</div>
            <div className="font-semibold">{(100 - (Number(borrowReq.minAmount) / Number(borrowReq.amount)) * 100).toFixed(2)}%</div>
          </div>
        </div>
        <div></div>
      </div>
      {address && isConnected ? (
        <div className="flex space-x-4 justify-center items-center my-4">
          <Button
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white leading-[21px]"
            onClick={() => onHandleLend()}
            loading={lendLoading}
          >
            Pay Loan
          </Button>
          <Button className="bg-gray-400 !rounded-3xl font-bold text-white leading-[21px]" disabled={true} onClick={() => onHandleLend()}>
            Offer <span className="text-[13px]">(soon)</span>
          </Button>
        </div>
      ) : (
        <div className="flex space-x-4 justify-center items-center my-4">
          <ConnectButton />
        </div>
      )}
    </div>
  );
};

export default NFTLendItem;
