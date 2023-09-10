import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useContractReads } from "wagmi";
import abiIntermediation from "../../abi/TranscaIntermediation.json";
import abiUSDTSimulator from "../../abi/USDTSimulator.json";
import { transcaIntermediation, usdt } from "../../config";
import { Asset } from "../../redux/reducers/assetReducer";
import { Bundle } from "../../redux/reducers/bundleReducer";
import { getBorrowReqs, Intermediation } from "../../redux/reducers/intermediationReducer";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../redux/store";
import { truncateEthAddress } from "../../services/address";
import Button from "../Button/Button";
import Message from "../Message/Message";
import BundleNFT from "../NFT/BundleNFT";
import NFTCard from "../NFT/NFTCard";
import Popup from "./Popup";
import { usePopups } from "./PopupProvider";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs().format("lll");

const PopupHistoryDetail: React.FC<{ actionType: string; nft?: Asset; bundle?: Bundle; borrowReq: Intermediation }> = ({ actionType, nft, bundle, borrowReq }) => {
  const [returnMoneyLoading, setReturnMoneyLoading] = useState(false);
  const [cancelBorrowRequestLoading, setCancelBorrowRequestLoading] = useState(false);
  const [claimNFTLoading, setClaimNFTLoading] = useState(false);
  const { address } = useAccount();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { removeAll } = usePopups();

  const onShowNFT = () => {
    if (nft) {
      return <NFTCard nftData={nft} />;
    }
    if (bundle) {
      return <BundleNFT bundle={bundle} />;
    }
  };

  const { data: contract } = useContractReads({
    watch: true,
    contracts: [
      {
        address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
        abi: abiIntermediation as any,
        functionName: "isLenderClamable",
        args: [borrowReq.borrowReqId],
      },
    ],
  });

  const isExpireLendCanClaimNFT = (contract as any)?.[0].result;

  const onHandleReturnTheMoney = async () => {
    setReturnMoneyLoading(true);

    if (borrowReq.returned) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "The debt has been successfully repaid before",
          type: "error",
        }),
      );
      setReturnMoneyLoading(false);
      return;
    }

    const data = (await readContract({
      address: usdt,
      abi: abiUSDTSimulator,
      functionName: "allowance",
      args: [address, transcaIntermediation],
    })) as bigint;

    if (data < borrowReq.amount) {
      if (!data) {
        try {
          const approve = await writeContract({
            address: usdt,
            abi: abiUSDTSimulator,
            functionName: "approve",
            args: [transcaIntermediation, borrowReq.amount],
          });

          const data = await waitForTransaction({ hash: approve.hash });
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

            setReturnMoneyLoading(false);
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

          setReturnMoneyLoading(false);
          return;
        }
      }
    }

    if (isExpireLendCanClaimNFT) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Loan expired before can't return back the money to lender ",
          type: "error",
        }),
      );
      setReturnMoneyLoading(false);
      return;
    }

    const returnMoney = await writeContract({
      address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
      abi: abiIntermediation,
      functionName: "returnTheMoney",
      args: [borrowReq.borrowReqId],
    });
    if (returnMoney.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: returnMoney.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Create borrow request success",
            type: "success",
          }),
        );
        dispatch(getBorrowReqs({}));
        setReturnMoneyLoading(false);
        removeAll();
        navigate("/history");
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
        setReturnMoneyLoading(false);
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
      setReturnMoneyLoading(false);
      return;
    }
  };

  const onHandleCancelBorrowRequest = async () => {
    setCancelBorrowRequestLoading(true);
    if (borrowReq.lendOfferReqId > 0 && borrowReq.borrowedAt) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "The debt has been successfully repaid before, can't cancle this borrow",
          type: "error",
        }),
      );
      setCancelBorrowRequestLoading(false);
      return;
    }
    const cancelBorrowRequest = await writeContract({
      address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
      abi: abiIntermediation,
      functionName: "cancelBorrow",
      args: [borrowReq.borrowReqId],
    });
    if (cancelBorrowRequest.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: cancelBorrowRequest.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Create borrow request success",
            type: "success",
          }),
        );
        dispatch(getBorrowReqs({}));
        setCancelBorrowRequestLoading(false);
        removeAll();
        navigate("/history");
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
        setCancelBorrowRequestLoading(false);
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
      setCancelBorrowRequestLoading(false);
      return;
    }
  };

  const onHandleClaimNFT = async () => {
    setClaimNFTLoading(true);
    if (!isExpireLendCanClaimNFT) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "The loan has not expired, you cannot claim nft",
          type: "error",
        }),
      );
      setClaimNFTLoading(false);
      return;
    }
    const claim = await writeContract({
      address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
      abi: abiIntermediation,
      functionName: "lenderClaim",
      args: [borrowReq.borrowReqId],
    });
    if (claim.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: claim.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Claim NFT success",
            type: "success",
          }),
        );
        dispatch(getBorrowReqs({}));
        setClaimNFTLoading(false);
        removeAll();
        navigate("/history");
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
        setClaimNFTLoading(false);
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
      setClaimNFTLoading(false);
      return;
    }
  };

  return (
    <Popup className="bg-gray-50 min-w-[700px]">
      <h1 className="mb-4 text-center font-bold text-[20px]">Details {actionType}</h1>
      <div className="flex space-x-5">
        <div className="w-1/3 flex justify-center">{onShowNFT()}</div>
        {actionType === "LEND" && (
          <div className="mt-5 flex flex-col space-y-3">
            <div className="flex space-x-2">
              <div className="font-semibold">Loan paid:</div>
              <div className="font-bold">{ethers.utils.formatEther(borrowReq.amount.toString()).toString()}$</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">Paid for:</div>
              <div className="font-bold">{truncateEthAddress(borrowReq.creator)}</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">Paid at:</div>
              <div className="font-bold">{dayjs(Number(borrowReq.borrowedAt) * 1000).format("DD/MM/YYYY HH:MM:ss")}</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">Loan expire at:</div>
              <div className="font-bold">{dayjs((Number(borrowReq.borrowedAt) + Number(borrowReq.duration)) * 1000).format("DD/MM/YYYY HH:MM:ss")}</div>
            </div>
          </div>
        )}

        {actionType === "BORROW" && (
          <div className="mt-5 flex flex-col space-y-3">
            <div className="flex space-x-2">
              <div className="font-semibold">Target loan amount:</div>
              <div className="font-bold">{ethers.utils.formatEther(borrowReq.amount.toString()).toString()}$</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">Min loan amount:</div>
              <div className="font-bold">{ethers.utils.formatEther(borrowReq.minAmount.toString()).toString()}$</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">Created at:</div>
              <div className="font-bold">{dayjs(Number(borrowReq.createdAt) * 1000).format("DD/MM/YYYY HH:MM:ss")}</div>
            </div>
            {borrowReq.lendOfferReqId > 0 && (
              <div className="flex space-x-2">
                <div className="font-semibold">Lender:</div>
                <div className="font-bold">{truncateEthAddress(borrowReq.lender)}</div>
              </div>
            )}
            {borrowReq.borrowedAt > 0 && (
              <div className="flex space-x-2">
                <div className="font-semibold">Loan at:</div>
                <div className="font-bold">{dayjs(Number(borrowReq.borrowedAt) * 1000).format("DD/MM/YYYY HH:MM:ss")}</div>
              </div>
            )}
            {borrowReq.returned && (
              <div className="">
                <div className="w-1/2 text-[14px] bg-green-700 px-2 text-center text-white font-bold border border-none rounded-xl">Loan Paid</div>
              </div>
            )}
            {borrowReq.returnedAt > 0 && (
              <div className="flex space-x-2">
                <div className="font-semibold">Repayment at:</div>
                <div className="font-bold">{dayjs(Number(borrowReq.returnedAt) * 1000).format("DD/MM/YYYY HH:MM:ss")}</div>
              </div>
            )}
            {isExpireLendCanClaimNFT && (
              <Message
                className={"flex space-x-2 bg-gray-100 text-gray-500 border-gray-400"}
                title="Expire"
                content="The loan is past due, you cannot transfer the money back to the lender and you will not get the NFT back"
              />
            )}
          </div>
        )}
      </div>
      {actionType === "LEND" && (
        <>
          <Message
            className={"!bg-blue-100 border-blue-400 flex space-x-3"}
            title="Expired"
            content="If the loan is due and the borrower still has not paid back, the lender can claim the borrower's nft"
          />
        </>
      )}
      <div className="flex space-x-4 justify-center items-center my-4">
        {actionType === "BORROW" && (
          <>
            <Button
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
              onClick={() => onHandleCancelBorrowRequest()}
              loading={cancelBorrowRequestLoading}
            >
              Cancel Request
            </Button>
            {borrowReq.borrowedAt > 0 && (
              <Button
                className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
                onClick={() => onHandleReturnTheMoney()}
                loading={returnMoneyLoading}
              >
                {isExpireLendCanClaimNFT ? "Expired" : "Loan Payment"}
              </Button>
            )}
          </>
        )}

        {actionType === "LEND" && (
          <Button
            className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
            onClick={() => onHandleClaimNFT()}
            loading={claimNFTLoading}
          >
            Claim NFT
          </Button>
        )}
        <Button className="bg-gray-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]" onClick={() => removeAll()}>
          Close
        </Button>
      </div>
    </Popup>
  );
};

export default PopupHistoryDetail;
