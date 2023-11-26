import { Lottery } from "@styled-icons/fluentui-system-regular";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import axios from "axios";
import { useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import lotteryAbi from "../../../abi/Lottery.json";
import transcaAssetAbi from "../../../abi/TranscaAssetNFT.json";
import transcaBundleAbi from "../../../abi/TranscaBundleNFT.json";
import transcaIAbi from "../../../abi/TranscaIntermediation.json";
import { api } from "../../../config";
import { setToast } from "../../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../../redux/store";
import { truncateSuiTx } from "../../../services/address";
import Button from "../../Button/Button";
import HeaderAdmin from "../../Header/HeaderAdmin";

const Admin: React.FC<{}> = () => {
  const { address } = useAccount();
  const [isLoadingCreateLottery, setIsLoadingCreateLottery] = useState(false);
  const [isLoadingUnPauseLottery, setIsLoadingUnpauseLottery] = useState(false);
  const [isLoadingSetLotteryAsset, setIsLoadingSetLotteryAsset] = useState(false);
  const [isLoadingSetLotteryToken, setIsLoadingSetLotteryToken] = useState(false);
  const [isLoadingUpdateWinner, setIsLoadingUpdateWiner] = useState(false);
  const [isLoadingUnPauseTranscaAsset, setIsLoadingUnPauseTranscaAsset] = useState(false);
  const [isLoadingSetAggregator, setIsLoadingSetAggregator] = useState(false);
  const [isLoadingUnpauseTranscaBundle, setIsLoadingUnpauseTranscaBundle] = useState(false);
  const [isLoadingSetTranscaAssetBundle, setIsLoadingSetTranscaAssetBundle] = useState(false);
  const [isLoadingSetUnpauseIntermediation, setIsLoadingUnpauseIntermediation] = useState(false);

  const dispatch = useAppDispatch();
  const onHandleCreateLottery = async () => {
    setIsLoadingCreateLottery(true);
    const approveData = await readContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: transcaAssetAbi,
      functionName: "isApprovedForAll",
      args: [address, import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!],
    });
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
    const res = (await axios.post(
      `${api}/v1/create-lottery`,
      {
        assetId: 2,
        duration: 10000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )) as any;
    console.log("7s200:res", res);
    if (!res.error) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Create Lottery success",
          type: "success",
        }),
      );
      return;
    } else {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Create Lottery failed",
          type: "error",
        }),
      );
      return;
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
  const onHandleUpadteWinner = async () => {
    setIsLoadingUpdateWiner(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
      abi: lotteryAbi,
      functionName: "updateWinNumber",
      args: [1, 1],
    });
    if (sign.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Update winner success",
            type: "success",
          }),
        );
        setIsLoadingUpdateWiner(false);
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
        setIsLoadingUpdateWiner(false);
        return;
      }
    }
  };
  const onHandleUnPauseTranscaAsset = async () => {
    setIsLoadingUnPauseTranscaAsset(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: transcaAssetAbi,
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
            message: "Unpause Transca asset success",
            type: "success",
          }),
        );
        setIsLoadingUnPauseTranscaAsset(false);
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
        setIsLoadingUnPauseTranscaAsset(false);
        return;
      }
    }
  };
  const onHandleSetAggregator = async () => {
    setIsLoadingSetAggregator(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: transcaAssetAbi,
      functionName: "setAggregator",
      args: [import.meta.env.VITE_TRANSCA_ORAKL_AGGREGATOR!],
    });
    if (sign.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: sign.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Unpause Transca aggregator success",
            type: "success",
          }),
        );
        setIsLoadingSetAggregator(false);
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
        setIsLoadingSetAggregator(false);
        return;
      }
    }
  };
  const onHandleSetMultiSign = async () => {};

  const onHandleUnPauseBundle = async () => {
    setIsLoadingUnpauseTranscaBundle(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!,
      abi: transcaBundleAbi,
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
            message: "Unpause Transca bundle success",
            type: "success",
          }),
        );
        setIsLoadingUnpauseTranscaBundle(false);
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
        setIsLoadingUnpauseTranscaBundle(false);
        return;
      }
    }
  };
  const onHandleSetAssetBundle = async () => {
    setIsLoadingSetTranscaAssetBundle(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!,
      abi: transcaBundleAbi,
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
            message: "Unpause Transca bundle set asset success",
            type: "success",
          }),
        );
        setIsLoadingSetTranscaAssetBundle(false);
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
        setIsLoadingSetTranscaAssetBundle(false);
        return;
      }
    }
  };
  const onHandleUnPauseIntermediation = async () => {
    setIsLoadingUnpauseIntermediation(true);
    const sign = await writeContract({
      address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT!,
      abi: transcaIAbi,
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
            message: "Unpause Transca intermediation success",
            type: "success",
          }),
        );
        setIsLoadingUnpauseIntermediation(false);
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
        setIsLoadingUnpauseIntermediation(false);
        return;
      }
    }
  };

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
        abi: transcaAssetAbi as any,
        functionName: "paused",
      },
      {
        address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!,
        abi: transcaBundleAbi as any,
        functionName: "paused",
      },
      {
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT!,
        abi: transcaIAbi as any,
        functionName: "paused",
      },
      {
        address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
        abi: lotteryAbi as any,
        functionName: "paused",
      },
      {
        address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
        abi: lotteryAbi as any,
        functionName: "assetNft",
      },
      {
        address: import.meta.env.VITE_TRANSCA_LOTTERY_CONTRACT!,
        abi: lotteryAbi as any,
        functionName: "token",
      },
      {
        address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!,
        abi: lotteryAbi as any,
        functionName: "assetNft",
      },
      {
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT!,
        abi: transcaIAbi as any,
        functionName: "assetNft",
      },
      {
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT!,
        abi: transcaIAbi as any,
        functionName: "bundleNft",
      },
      {
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT!,
        abi: transcaIAbi as any,
        functionName: "token",
      },
      {
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
        abi: transcaAssetAbi as any,
        functionName: "getLatestData",
      },
      {
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
        abi: transcaAssetAbi as any,
        functionName: "audit",
      },
      {
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
        abi: transcaAssetAbi as any,
        functionName: "stocker",
      },
      {
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
        abi: transcaAssetAbi as any,
        functionName: "transca",
      },
    ],
  });
  const isTranscaAssetPaused = data ? data![0].result : 0;
  const isTranscaBundlePaused = data ? data![1].result : 0;
  const isTranscaIPaused = data ? data![2].result : 0;
  const isLotteryPaused = data ? data![3].result : 0;
  const lotteryAsset = data ? data![4].result : "";
  const lotteryToken = data ? data![5].result : "";
  const bundleAsset = data ? data![6].result : "";
  const intermediationAsset = data ? data![7].result : "";
  const intermediationBundle = data ? data![8].result : "";
  const intermediationToken = data ? data![9].result : "";
  const latestData = data && data![10].error ? "0x0000000000000000000000000000000000000000" : import.meta.env.VITE_TRANSCA_ORAKL_AGGREGATOR!;
  const auditor = data ? data![11].result : "0x0000000000000000000000000000000000000000";
  const stocker = data ? data![12].result : "0x0000000000000000000000000000000000000000";
  const transca = data ? data![13].result : "0x0000000000000000000000000000000000000000";

  return (
    <>
      <HeaderAdmin />
      <div className="p-4 md:ml-40 mt-14 bg-gray-100 h-screen w-full">
        <div className="w-full bg-white px-4 py-4 border border-none rounded-xl flex flex-col lg:flex-row justify-between items-center space-x-4">
          <div className="w-full flex flex-col space-y-6">
            <div className="w-full flex flex-col justify-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <div className="">
                <h1 className="text-32 leading-24 font-bold mx-4">Transca Asset Contract</h1>
                <div className="overflow-x-auto max-w-[550px] mx-auto border border-none rounded-xl mt-4">
                  <table className="w-full text-sm !text-white">
                    <thead className="text-xs !text-white uppercase bg-btnprimary">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                          Smart contract
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* transca paused */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Transca assest paused</td>
                        <td className="px-4 py-3 text-center">{isTranscaAssetPaused?.toString()}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            onClick={() => onHandleUnPauseTranscaAsset()}
                            loading={isLoadingUnPauseTranscaAsset}
                          >
                            {isTranscaAssetPaused ? "Unpause" : "Pause"}
                          </Button>
                        </td>
                      </tr>
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Orakl aggregator</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(latestData?.toString())}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            onClick={() => onHandleSetAggregator()}
                            loading={isLoadingSetAggregator}
                          >
                            Set aggregator
                          </Button>
                        </td>
                      </tr>
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Auditor</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(auditor ? auditor.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            // onClick={() => onHandleCreateLottery()}
                            // loading={isLoadingCreateLottery}
                          >
                            Set auditor
                          </Button>
                        </td>
                      </tr>
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Stocker</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(stocker ? stocker.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            // onClick={() => onHandleCreateLottery()}
                            // loading={isLoadingCreateLottery}
                          >
                            Set stocker
                          </Button>
                        </td>
                      </tr>
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Transca</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(transca ? transca.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            // onClick={() => onHandleCreateLottery()}
                            // loading={isLoadingCreateLottery}
                          >
                            Set transca
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="">
                <h1 className="text-32 leading-24 font-bold mx-4">Lottery Contract</h1>
                <div className="overflow-x-auto max-w-[550px] mx-auto border border-none rounded-xl mt-4">
                  <table className="w-full text-sm !text-white">
                    <thead className="text-xs !text-white uppercase bg-btnprimary">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                          Smart contract
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* lottery paused */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Lottery paused</td>
                        <td className="px-4 py-3 text-center">{isLotteryPaused?.toString()}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            onClick={() => onHandleUnPauseLottery()}
                            loading={isLoadingUnPauseLottery}
                          >
                            {isLotteryPaused ? "Unpause" : "Pause"}
                          </Button>
                        </td>
                      </tr>
                      {/* lottery asset */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Lottery assest address</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(lotteryAsset ? lotteryAsset.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            onClick={() => onHandleSetLotteryAsset()}
                            loading={isLoadingSetLotteryAsset}
                          >
                            Set Asset
                          </Button>
                        </td>
                      </tr>
                      {/* lottery token */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Lottery token address</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(lotteryToken ? lotteryToken.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            onClick={() => onHandleSetLotteryToken()}
                            loading={isLoadingSetLotteryToken}
                          >
                            Set Token
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h1 className="text-32 leading-24 font-bold mx-4">Lottery monitor</h1>
                <div
                  className="cursor-pointer flex justify-center items-center space-x-2 p-4 border boder-1 rounded-xl bg-blue-200 w-[200px] font-bold"
                  onClick={() => onHandleCreateLottery()}
                >
                  <div className="">Create Lottery</div>
                  <div>
                    <Lottery size={30} />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col justify-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <div>
                <h1 className="text-32 leading-24 font-bold mx-4">Bundle Contract</h1>
                <div className="overflow-x-auto max-w-[550px] mx-auto border border-none rounded-xl mt-4">
                  <table className="w-full text-sm !text-white">
                    <thead className="text-xs !text-white uppercase bg-btnprimary">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                          Smart contract
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* bundle paused */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Bundle paused</td>
                        <td className="px-4 py-3 text-center">{isTranscaBundlePaused?.toString()}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            onClick={() => onHandleUnPauseBundle()}
                            loading={isLoadingUnpauseTranscaBundle}
                          >
                            {isTranscaBundlePaused ? "Unpause" : "Pause"}
                          </Button>
                        </td>
                      </tr>
                      {/* bundle asset */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Asset address</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(bundleAsset ? bundleAsset.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            onClick={() => onHandleSetAssetBundle()}
                            loading={isLoadingSetTranscaAssetBundle}
                          >
                            Set Asset
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h1 className="text-32 leading-24 font-bold mx-4">Intermediation Contract</h1>
                <div className="overflow-x-auto max-w-[550px] mx-auto border border-none rounded-xl mt-4">
                  <table className="w-full text-sm !text-white">
                    <thead className="text-xs !text-white uppercase bg-btnprimary">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                          Smart contract
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* lend/borrow paused */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Intermediation paused</td>
                        <td className="px-4 py-3 text-center">{isTranscaIPaused?.toString()}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            onClick={() => onHandleUnPauseIntermediation()}
                            loading={isLoadingSetUnpauseIntermediation}
                          >
                            {isTranscaIPaused ? "Unpause" : "Pause"}
                          </Button>
                        </td>
                      </tr>
                      {/* lend/borrow asset */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Intermediation assest address</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(intermediationAsset ? intermediationAsset.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            // onClick={() => onHandleCreateLottery()}
                            // loading={isLoadingCreateLottery}
                          >
                            Set Asset
                          </Button>
                        </td>
                      </tr>
                      {/* lend/borrow bundle */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Intermediation bundle address</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(intermediationBundle ? intermediationBundle.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            // onClick={() => onHandleCreateLottery()}
                            // loading={isLoadingCreateLottery}
                          >
                            Set Bundle
                          </Button>
                        </td>
                      </tr>
                      {/* lend/borrow token */}
                      <tr className="bg-[#251163] w-full border border-none rounded-xl text-gray-300">
                        <td className="px-4 py-3 text-center">Intermediation token address</td>
                        <td className="px-4 py-3 text-center">{truncateSuiTx(intermediationToken ? intermediationToken.toString() : "")}</td>
                        <td className="px-4 py-3 text-center flex justify-center items-center">
                          <Button
                            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                            size="small"
                            // onClick={() => onHandleCreateLottery()}
                            // loading={isLoadingCreateLottery}
                          >
                            Set Token
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 py-12">
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
              <Button
                className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                onClick={() => onHandleUpadteWinner()}
                loading={isLoadingUpdateWinner}
              >
                Update Win Number
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
