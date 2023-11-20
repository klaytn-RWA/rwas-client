import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { useState } from "react";
import { useAccount } from "wagmi";
import lotteryAbi from "../../../abi/Lottery.json";
import transcaAssetAbi from "../../../abi/TranscaAssetNFT.json";
import { setToast } from "../../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../../redux/store";
import Button from "../../Button/Button";
import HeaderAdmin from "../../Header/HeaderAdmin";

const Admin: React.FC<{}> = () => {
  const { address } = useAccount();
  const [isLoadingCreateLottery, setIsLoadingCreateLottery] = useState(false);
  const [isLoadingUnPauseLottery, setIsLoadingUnpauseLottery] = useState(false);
  const [isLoadingSetLotteryAsset, setIsLoadingSetLotteryAsset] = useState(false);
  const [isLoadingSetLotteryToken, setIsLoadingSetLotteryToken] = useState(false);

  const dispatch = useAppDispatch();
  const onHandleCreateLottery = async () => {
    setIsLoadingCreateLottery(true);
    console.log("7s200:contract:", address, import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!);
    const approveData = await readContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: transcaAssetAbi,
      functionName: "isApprovedForAll",
      args: [address, import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!],
    });

    const asset = await readContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "assetNft",
      args: [],
    });
    const token = await readContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "token",
      args: [],
    });
    console.log("7s200:asset", asset, token);

    console.log("7s200:appreove,", approveData);

    if (!approveData) {
      try {
        const approveAllNFTs = await writeContract({
          address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
          abi: transcaAssetAbi,
          functionName: "setApprovalForAll",
          args: [import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!, true],
        });

        const data = await waitForTransaction({ hash: approveAllNFTs.hash });
        if (data.status === "reverted") {
          console.log(data);
          dispatch(
            setToast({
              show: true,
              title: "",
              message: "Approve failed",
              type: "error",
            }),
          );

          setIsLoadingCreateLottery(false);
          return;
        }
      } catch (error) {
        console.error(error);
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Approve failed",
            type: "error",
          }),
        );

        setIsLoadingCreateLottery(false);
        return;
      }
    }
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "createLottery",
      args: [1, 100000],
    });
    if (sign.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Create Lottery success",
            type: "success",
          }),
        );
        setIsLoadingCreateLottery(false);
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
        setIsLoadingCreateLottery(false);
        return;
      }
    }
  };
  const onHandleUnPauseLottery = async () => {
    setIsLoadingUnpauseLottery(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "unpause",
      args: [],
    });
    if (sign.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Unpause Lottery success",
            type: "success",
          }),
        );
        setIsLoadingUnpauseLottery(false);
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
        setIsLoadingUnpauseLottery(false);
        return;
      }
    }
  };
  const onHandleSetLotteryAsset = async () => {
    setIsLoadingSetLotteryAsset(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "setAsset",
      args: [import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!],
    });
    if (sign.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Set Lottery Assest success",
            type: "success",
          }),
        );
        setIsLoadingSetLotteryAsset(false);
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
        setIsLoadingSetLotteryAsset(false);
        return;
      }
    }
  };
  const onHandleSetLotteryToken = async () => {
    setIsLoadingSetLotteryToken(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "setToken",
      args: [import.meta.env.VITE_TRANSCA_TOKEN_CONTRACT!],
    });
    if (sign.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Set Lottery Token success",
            type: "success",
          }),
        );
        setIsLoadingSetLotteryToken(false);
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
        setIsLoadingSetLotteryToken(false);
        return;
      }
    }
  };
  return (
    <>
      <HeaderAdmin />
      <div className="p-4 md:ml-64 mt-14 bg-gray-100 h-screen">
        <div className="bg-white px-4 py-4 border border-none rounded-xl flex flex-col lg:flex-row justify-between items-center space-x-4">
          <div>
            <h1>Lottery</h1>
            <div className="flex space-x-2">
              <Button
                className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                onClick={() => onHandleCreateLottery()}
                loading={isLoadingCreateLottery}
              >
                Create Lottery
              </Button>
              <Button
                className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                onClick={() => onHandleUnPauseLottery()}
                loading={isLoadingUnPauseLottery}
              >
                Unpause Lottery
              </Button>
              <Button
                className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                onClick={() => onHandleSetLotteryAsset()}
                loading={isLoadingSetLotteryAsset}
              >
                Set Lottery Asset
              </Button>
              <Button
                className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                onClick={() => onHandleSetLotteryToken()}
                loading={isLoadingSetLotteryToken}
              >
                Set Lottery Token
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
