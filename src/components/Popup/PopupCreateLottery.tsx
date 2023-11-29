import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircleFill } from "@styled-icons/bootstrap";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import transcaAssetAbi from "../../abi/TranscaAssetNFT.json";
import { api } from "../../config";
import { getAssets, selectAsset } from "../../redux/reducers/assetReducer";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import cn from "../../services/cn";
import { resolverError } from "../../utils/form";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Popup from "./Popup";
import { usePopups } from "./PopupProvider";

const PopupCreateLottery: React.FC<{}> = () => {
  const { address, isConnected } = useAccount();

  const [selected, setActives] = useState(0);
  const [isLoadingCreateLottery, setIsLoadingCreateLottery] = useState(false);

  const assetRx = useAppSelector(selectAsset);
  useEffect(() => {
    dispatch(getAssets({ address: address! }));
  }, []);
  const dispatch = useAppDispatch();
  const { removeAll, addPopup } = usePopups();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{ duration: number }>({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    shouldUnregister: false,
    resolver: async (values) => {
      let errors = {};

      if (!values.duration) {
        errors = { ...errors, ...resolverError("duration", "required", "duration is required") };

        return { values, errors };
      }

      if (Number.isNaN(Number(values.duration))) {
        errors = { ...errors, ...resolverError("duration", "required", "duration must be a number") };

        return { values, errors };
      }

      if (!Number.isInteger(Number(values.duration))) {
        errors = { ...errors, ...resolverError("duration", "required", "duration must be integer 1,2,3,4,...") };
      }

      if (Number(values.duration) < 0) {
        errors = { ...errors, ...resolverError("duration", "required", "duration must be more than 0") };
      }

      return { values, errors };
    },
  });
  console.log("rx", assetRx);

  const onSelectNFT = (id: number) => {
    setActives(id);
  };
  const fields = watch();

  const onShowNFT = () => {
    let temp = null;
    if (!assetRx.loading && assetRx.assets.length > 0) {
      temp = assetRx.assets.map((e, i) => {
        return (
          <tr key={i} className={`bg-[#251163] w-full text-gray-300 cursor-pointer`} onClick={() => onSelectNFT(Number(e.assetId))}>
            <td className="px-4 py-3 text-center">
              <div>
                <img className="max-w-[50px] max-h-[50px] border border-none rounded-xl" src={e.image} alt="nft" />
              </div>
            </td>
            <td className="px-4 py-3 text-center">{Number(ethers.utils.formatUnits(e.oraklPrice, 18)).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(ethers.utils.formatUnits(e.appraisalPrice, 18)).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(ethers.utils.formatUnits(e.userDefinePrice, 18)).toFixed(2)}</td>
            <td className="px-4 py-3 text-center">{Number(e.assetId) === selected && <CheckCircleFill size={20} color="green" />}</td>
          </tr>
        );
      });
    }
    return temp;
  };
  const onHandleCreateLottery = async () => {
    if (fields.duration === 0) {
      return;
    }
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
        assetId: selected,
        duration: fields.duration,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )) as any;
    if (!res.error) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Create Lottery success",
          type: "success",
        }),
      );
      setIsLoadingCreateLottery(false);
      removeAll();
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
      setIsLoadingCreateLottery(false);
      removeAll();
      return;
    }
  };

  return (
    <Popup className="bg-gray-50 min-w-[800px]">
      <h1 className="mb-4 text-center font-bold text-[20px]">Select NFT to create Lottery</h1>
      <form className="flex justify-center space-x-2">
        <div className="w-2/3 px-6 bg-white border border-none rounded-xl shadow-xl">
          <div className="py-1 flex justify-center items-center h-full">
            <table className="w-full text-sm !text-white border border-none rounded-xl">
              <thead className="text-xs !text-white uppercase bg-btnprimary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">
                    NFT
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Real Time Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Appraisal Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    User Define Price
                  </th>

                  <th scope="col" className="px-4 py-3 text-center">
                    Selected
                  </th>
                </tr>
              </thead>
              <tbody>{onShowNFT()}</tbody>
            </table>
          </div>
        </div>
        <div className="w-1/3 px-6 bg-white border border-none rounded-xl shadow-xl">
          <div className="py-2">
            <div className="text-[16px] font-bold">Duration</div>
            <div className="text-[13px]">Enter the duration of lottery</div>

            <div className="max-w-[400px] flex justify-between items-center border rounded-xl my-2">
              <div className="px-2">
                <Input
                  type="number"
                  className={cn("transca--input-hide-arrows border-none border-transparent focus:border-transparent focus:!ring-0 !text-[14px] !pl-0 !pt-1 !pb-1 !leading-[30px]")}
                  placeholder="0.00"
                  autoComplete="off"
                  {...register("duration", { required: { value: true, message: "Please fill duration" } })}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center space-y-2 my-8">
            {isConnected && address ? (
              <Button
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white leading-[21px]"
                onClick={() => onHandleCreateLottery()}
                loading={isLoadingCreateLottery}
              >
                Create Lottery
              </Button>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </form>
    </Popup>
  );
};
export default PopupCreateLottery;
