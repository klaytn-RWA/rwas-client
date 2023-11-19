import { waitForTransaction, writeContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import abiTranscaAsset from "../../../abi/TranscaAssetNFT.json";
import { getRequestMint, selectAsset } from "../../../redux/reducers/assetReducer";
import { setToast } from "../../../redux/reducers/toastReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Button from "../../Button/Button";
import HeaderAdmin from "../../Header/HeaderAdmin";
import { AdminAddress } from "./data";

const MultiSign: React.FC<{}> = () => {
  const { address, isConnected } = useAccount();
  const [isLoadingAduitSign, setIsLoadingAuditSign] = useState(false);
  const [isLoadingStockerSign, setIsLoadingStockerSign] = useState(false);
  const [isLoadingTranscaSign, setIsLoadingTrascaSign] = useState(false);
  const [isLoadingExecuteMint, setIsLoadingExecuteMint] = useState(false);

  const dispatch = useAppDispatch();
  const assetRx = useAppSelector(selectAsset);

  useEffect(() => {
    dispatch(getRequestMint({}));
  }, [dispatch]);

  const onSign = async (signer: any, index: number, btn: string) => {
    if (!isConnected && (signer !== AdminAddress.stocker || signer !== AdminAddress.audit || signer !== AdminAddress.transca)) {
      setIsLoadingAuditSign(false);
      setIsLoadingStockerSign(false);
      setIsLoadingTrascaSign(false);
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Please connect admin account",
          type: "error",
        }),
      );
      return;
    }
    if (signer == AdminAddress.stocker && btn === "STOCKER") {
      setIsLoadingStockerSign(true);
    }
    if (signer == AdminAddress.audit && btn === "AUDIT") {
      setIsLoadingAuditSign(true);
    }
    if (signer == AdminAddress.transca && btn === "TRANSCA") {
      setIsLoadingTrascaSign(true);
    }
    try {
      const sign = await writeContract({
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT! as any,
        abi: abiTranscaAsset,
        functionName: "confirmTransaction",
        args: [index],
      });
      if (sign.hash) {
        const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
        if (waitTranscation.status === "success") {
          dispatch(
            setToast({
              show: true,
              title: "",
              message: "Confirm request success",
              type: "success",
            }),
          );
          dispatch(getRequestMint({}));
          setIsLoadingAuditSign(false);
          setIsLoadingStockerSign(false);
          setIsLoadingTrascaSign(false);
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
          setIsLoadingAuditSign(false);
          setIsLoadingStockerSign(false);
          setIsLoadingTrascaSign(false);
          return;
        }
      } else {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Something wrong!",
            type: "error",
          }),
        );
        setIsLoadingAuditSign(false);
        setIsLoadingStockerSign(false);
        setIsLoadingTrascaSign(false);
        return;
      }
    } catch (error) {
      setIsLoadingAuditSign(false);
      setIsLoadingStockerSign(false);
      setIsLoadingTrascaSign(false);
      return;
    }
  };

  const onHandleMint = async (reqIndex: number) => {
    setIsLoadingExecuteMint(true);
    if (!isConnected && address !== AdminAddress.transca) {
      setIsLoadingExecuteMint(false);
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Please connect transca account to mint",
          type: "error",
        }),
      );
      return;
    }
    try {
      const sign = await writeContract({
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT! as any,
        abi: abiTranscaAsset,
        functionName: "executeMint",
        args: [reqIndex],
      });
      if (sign.hash) {
        const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
        if (waitTranscation.status === "success") {
          dispatch(
            setToast({
              show: true,
              title: "",
              message: "Confirm request success",
              type: "success",
            }),
          );
          dispatch(getRequestMint({}));
          setIsLoadingExecuteMint(false);

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
          setIsLoadingExecuteMint(false);
          return;
        }
      } else {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Something wrong!",
            type: "error",
          }),
        );
        setIsLoadingExecuteMint(false);
        return;
      }
    } catch (error) {
      setIsLoadingExecuteMint(false);
      return;
    }
  };

  const onShowRequest = () => {
    let temp = null;
    if (!assetRx.loading && assetRx.reqs.length > 0) {
      temp = assetRx.reqs.map((e, i) => {
        return (
          <div key={i} className="flex space-x-2">
            <img className="w-[50px] h-[75px] border border-none rounded-xl" src={e.image} alt="asset" />
            {e.isAuditSign && e.isStockerSign && e.isTranscaSign ? (
              <div className="flex space-x-2 items-center">
                <Button
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-xl font-bold text-white w-[150px] text-[13px] leading-[21px] !px-1 disabled:opacity-80"
                  onClick={() => onHandleMint(i)}
                  loading={isLoadingExecuteMint}
                  disabled={e.executed}
                >
                  {e.executed ? "Minted" : "Execute mint"}
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2 items-center">
                <Button
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-xl font-bold text-white w-[150px] text-[13px] leading-[21px] !px-1 disabled:opacity-80"
                  onClick={() => onSign(address, i, "STOCKER")}
                  loading={isLoadingStockerSign}
                  disabled={e.isStockerSign}
                >
                  {e.isStockerSign ? "Stocker confirmed" : "Stocker confirm"}
                </Button>
                <Button
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-xl font-bold text-white w-[150px] text-[13px] leading-[21px] !px-1 disabled:opacity-80"
                  onClick={() => onSign(address, i, "AUDIT")}
                  disabled={e.isAuditSign}
                  loading={isLoadingAduitSign}
                >
                  {e.isAuditSign ? "Audit confirmed" : "Audit confirm"}
                </Button>

                <Button
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-xl font-bold text-white w-[150px] text-[13px] leading-[21px] !px-1 disabled:opacity-80"
                  onClick={() => onSign(address, i, "TRANSCA")}
                  disabled={e.isTranscaSign}
                  loading={isLoadingTranscaSign}
                >
                  {e.isTranscaSign ? "Transca confirmed" : "Transca confirm"}
                </Button>
              </div>
            )}
          </div>
        );
      });
    }
    return temp;
  };

  return (
    <>
      <HeaderAdmin />
      <div className="p-4 md:ml-64 mt-14 bg-gray-100 h-screen">
        <div className="bg-white px-4 py-4 border border-none rounded-xl">
          <div>Multi-Sign</div>
          <div className="flex flex-col space-y-4">{onShowRequest()}</div>
        </div>
      </div>
    </>
  );
};
export default MultiSign;
