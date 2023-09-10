import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import abiTranscaAssetNFT from "../../abi/TranscaAssetNFT.json";
import abiIntermadiation from "../../abi/TranscaIntermediation.json";
import { transcaIntermediation } from "../../config";
import { Asset, getAssets } from "../../redux/reducers/assetReducer";
import { Bundle, getBundles } from "../../redux/reducers/bundleReducer";
import { getBorrowReqs } from "../../redux/reducers/intermediationReducer";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../redux/store";
import cn from "../../services/cn";
import { resolverError } from "../../utils/form";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Popup from "../Popup/Popup";
import { usePopups } from "../Popup/PopupProvider";
import KanaSelectDropdown, { COINS_DATA } from "../Selector/RadixSelector";
import BundleNFT from "./BundleNFT";
import NFTCard from "./NFTCard";
import NFTProperty from "./NFTProperty";

type BrrowType = {
  loanAmount: string;
  minLoanAmount: string;
  duration: string;
};

const NFTBorrowItem: React.FC<{ asset?: Asset; bundle?: Bundle }> = ({ asset, bundle }) => {
  const { addPopup } = usePopups();
  const navigate = useNavigate();

  let totalOraklPrice = 0;
  let indentifierCode = "";
  let appraisalPrice = 0;
  let id = 0;
  let weight = 0;
  let isQuickRaise = false;
  let contract = "";

  let ounceGold = 0;

  if (asset) {
    totalOraklPrice = asset.oraklPrice;
    appraisalPrice = asset.appraisalPrice;
    id = asset.assetId;
    weight = asset.weight;
    isQuickRaise = asset.assetType === 0;
    indentifierCode = asset.indentifierCode;
    contract = import.meta.env.VITE_TRANSCA_ASSET_CONTRACT! as any;
  }

  if (bundle) {
    totalOraklPrice = bundle.totalOraklValue;
    isQuickRaise = bundle.totalOraklValue > 0;

    let _weight = 0;
    let _appraisalPrice = 0;
    let _ounceGold = 0;
    bundle.nfts.forEach((element) => {
      if (Number(element.assetType) === 0) {
        _ounceGold += Number(element.weight);
      }
      _weight += Number(element.weight);
      _appraisalPrice += Number(element.appraisalPrice);
    });
    weight = _weight;
    ounceGold = _ounceGold;
    appraisalPrice = _appraisalPrice;
    id = bundle.id;
    contract = import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT! as any;
  }

  const onOpenPopup = () => {
    addPopup({
      Component: () => {
        const [currentCoin, setCurrentCoin] = useState(COINS_DATA[0].address);

        const [loadingCreateBorrow, setLoadingCreateBorrow] = useState(false);
        const [loadingQuickBorrow, setLoadingQuickBorrow] = useState(false);

        const { address } = useAccount();
        const { removeAll } = usePopups();
        const dispatch = useAppDispatch();

        const {
          register,
          handleSubmit,

          formState: { errors },
        } = useForm<BrrowType>({
          mode: "onChange",
          reValidateMode: "onChange",
          shouldFocusError: true,
          shouldUnregister: false,
          resolver: async (values) => {
            let errors = {};

            if (!values.loanAmount) {
              errors = { ...errors, ...resolverError("loanAmount", "required", "Amount is required") };

              return { values, errors };
            }

            if (Number.isNaN(Number(values.loanAmount))) {
              errors = { ...errors, ...resolverError("loanAmount", "required", "Amount must be a number") };

              return { values, errors };
            }

            if (Number(values.loanAmount) < 0) {
              errors = { ...errors, ...resolverError("loanAmount", "required", "Amount must be more than 0") };
            }

            if (!values.minLoanAmount) {
              errors = { ...errors, ...resolverError("minLoanAmount", "required", "Amount is required") };

              return { values, errors };
            }

            if (Number.isNaN(Number(values.minLoanAmount))) {
              errors = { ...errors, ...resolverError("minLoanAmount", "required", "Amount must be a number") };

              return { values, errors };
            }

            if (Number(values.minLoanAmount) < 0) {
              errors = { ...errors, ...resolverError("minLoanAmount", "required", "Amount must be more than 0") };

              return { values, errors };
            }

            if (Number(values.minLoanAmount) > Number(values.loanAmount)) {
              errors = { ...errors, ...resolverError("minLoanAmount", "required", "Min amount must be less than amount") };

              return { values, errors };
            }

            if (!values.duration) {
              errors = { ...errors, ...resolverError("duration", "required", "Amount is required") };

              return { values, errors };
            }

            if (Number.isNaN(Number(values.duration))) {
              errors = { ...errors, ...resolverError("duration", "required", "Amount must be a number") };

              return { values, errors };
            }

            if (Number(values.duration) < 0) {
              errors = { ...errors, ...resolverError("duration", "required", "Amount must be more than 0") };

              return { values, errors };
            }

            return { values, errors };
          },
        });

        const onSubmit: SubmitHandler<BrrowType> = async (data) => {
          await onHandleCreateBorrowReq(data);
        };

        const onHandleCreateBorrowReq = async (data: BrrowType) => {
          setLoadingCreateBorrow(true);

          const approveData = await readContract({
            address: contract as `0x${string}`,
            abi: abiTranscaAssetNFT,
            functionName: "isApprovedForAll",
            args: [address, transcaIntermediation],
          });

          if (!approveData) {
            try {
              const approveAllNFTs = await writeContract({
                address: contract as `0x${string}`,
                abi: abiTranscaAssetNFT,
                functionName: "setApprovalForAll",
                args: [transcaIntermediation, true],
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

                setLoadingQuickBorrow(false);
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

              setLoadingQuickBorrow(false);
              return;
            }
          }

          const createBorrowReq = await writeContract({
            address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
            abi: abiIntermadiation,
            functionName: "createBorrow",
            args: [id, contract, ethers.utils.parseUnits(data.loanAmount, 18), ethers.utils.parseUnits(data.minLoanAmount, 18), ethers.BigNumber.from(Number(data.duration))],
          });
          if (createBorrowReq.hash) {
            const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: createBorrowReq.hash });
            if (waitTranscation.status === "success") {
              dispatch(
                setToast({
                  show: true,
                  title: "",
                  message: "Create borrow request success",
                  type: "success",
                }),
              );
              dispatch(getAssets({ address: address! }));
              dispatch(getBundles({ address: address! }));
              dispatch(getBorrowReqs({}));
              setLoadingCreateBorrow(false);
              navigate("/history");
              removeAll();
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
              setLoadingCreateBorrow(false);
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
            setLoadingCreateBorrow(false);
          }
        };

        const onHandleQuickBorrow = async () => {
          setLoadingQuickBorrow(true);

          const data = await readContract({
            address: contract as `0x${string}`,
            abi: abiTranscaAssetNFT,
            functionName: "isApprovedForAll",
            args: [address, transcaIntermediation],
          });

          if (!data) {
            try {
              const approveAllNFTs = await writeContract({
                address: contract as `0x${string}`,
                abi: abiTranscaAssetNFT,
                functionName: "setApprovalForAll",
                args: [transcaIntermediation, true],
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

                setLoadingQuickBorrow(false);
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

              setLoadingQuickBorrow(false);
              return;
            }
          }

          const createBorrowReq = await writeContract({
            address: transcaIntermediation,
            abi: abiIntermadiation,
            functionName: "createQuickBorrow",
            args: [id, contract, ethers.BigNumber.from(100 * 60)],
          });

          if (createBorrowReq.hash) {
            await waitForTransaction({ hash: createBorrowReq.hash });

            dispatch(
              setToast({
                show: true,
                title: "",
                message: "Create quick borrow request success",
                type: "success",
              }),
            );

            dispatch(getAssets({ address: address! }));
            dispatch(getBundles({ address: address! }));
            dispatch(getBorrowReqs({}));
            setLoadingQuickBorrow(false);
            navigate("/history");
            removeAll();
          } else {
            dispatch(
              setToast({
                show: true,
                title: "",
                message: "Something wrong!",
                type: "error",
              }),
            );

            setLoadingQuickBorrow(false);
          }
        };

        return (
          <Popup className="bg-gray-50 min-w-[800px] min-h-[700px]">
            <h1 className="mb-4 text-center font-bold text-[20px]">Create Borrow Request</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center  space-x-2">
              <div className="h-full w-1/2 shadow-xl border border-none rounded-xl p-2 bg-white">
                <div className="">
                  <div>
                    <div className="flex justify-center items-center">
                      {asset && <NFTCard nftData={asset} />}
                      {bundle && <BundleNFT bundle={bundle} />}
                    </div>
                    <div className="font-semibold text-center">#{id.toString()}</div>
                  </div>
                  <div>
                    <div className="font-bold text-[14px] m-2">Properties</div>
                    {asset && (
                      <div className="mb-2">
                        <NFTProperty title="code" content={indentifierCode!} />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <NFTProperty title="weight" content={`${Number(ethers.utils.formatUnits(weight, 10)).toString()} gram`} />
                      {asset?.assetType === 0 ||
                        (bundle?.totalOraklValue && (
                          <NFTProperty title="Total gold value" content={`${Number(ethers.utils.formatEther(asset ? asset.oraklPrice : bundle.totalOraklValue)).toFixed(2)}$`} />
                        ))}
                      {bundle && ounceGold > 0 && <NFTProperty title="Gold" content={`${Number(ethers.utils.formatUnits(ounceGold, 10)).toString()} ounce`} />}
                    </div>
                  </div>
                  {isQuickRaise && (
                    <div className="mt-4">
                      <div className={`bg-green-100 border-green-500 w-fit  border  rounded-2xl text-green-700 px-4 py-3`} role="alert">
                        <p className="font-bold text-[13px]">Quick Raise:</p>{" "}
                        <p className="text-[13px]">{`Your #${id} is in High Liquidity Class, Transca will be fund for your NFT`}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-1/2 px-6 bg-white border border-none rounded-xl shadow-xl">
                {/* Loan Amount */}
                <div className="py-4">
                  <div className="text-[16px] font-bold">Loan Amount</div>
                  <div className="text-[13px]">Enter the loan amount and currency you wish to request</div>

                  <div className="max-w-[400px] flex justify-between items-center border rounded-xl my-2">
                    <div className="px-2">
                      <Input
                        type="number"
                        className={cn(
                          "transca--input-hide-arrows border-none border-transparent focus:border-transparent focus:!ring-0 !text-[20px] !pl-0 !pt-1 !pb-1 !leading-[40px]",
                        )}
                        placeholder="0.00"
                        autoComplete="off"
                        {...register("loanAmount", { required: { value: true, message: "Please fill loanAmount" } })}
                      />
                    </div>

                    <div className="px-2">
                      <KanaSelectDropdown
                        data={COINS_DATA}
                        currentCoin={currentCoin}
                        onSelectCoin={(data: string) => {
                          setCurrentCoin(data);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-red-500">{errors.loanAmount?.message}</div>
                </div>

                {/* Loan Interest */}
                <div className="py-4">
                  <div className="text-[16px] font-bold">Min Loan Amount</div>
                  <div className="text-[13px]">Enter the lowest price you can accept to borrow</div>

                  <div className="max-w-[400px] flex justify-between items-center border rounded-xl my-2">
                    <div className="px-2">
                      <Input
                        type="number"
                        className={cn(
                          "transca--input-hide-arrows border-none border-transparent focus:border-transparent focus:!ring-0 !text-[20px] !pl-0 !pt-1 !pb-1 !leading-[40px]",
                        )}
                        placeholder="0.00"
                        autoComplete="off"
                        {...register("minLoanAmount", { required: { value: true, message: "Please fill min loan amount" } })}
                      />
                    </div>

                    <div className="px-2">
                      <KanaSelectDropdown
                        data={COINS_DATA}
                        currentCoin={currentCoin}
                        onSelectCoin={(data: string) => {
                          setCurrentCoin(data);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-red-500">{errors.minLoanAmount?.message}</div>
                </div>

                {/* Loan Duration */}
                <div className="py-4">
                  <div className="text-[16px] font-bold">Loan Duration</div>
                  <div className="text-[13px]">Enter the duration of the loan. You can toggle between hours and days</div>
                  <div className="max-w-[400px] flex justify-between items-center border rounded-xl my-2">
                    <div className="px-2">
                      <Input
                        type="number"
                        className={cn(
                          "transca--input-hide-arrows border-none border-transparent focus:border-transparent focus:!ring-0 !text-[20px] !pl-0 !pt-1 !pb-1 !leading-[40px]",
                        )}
                        placeholder="0.00"
                        autoComplete="off"
                        {...register("duration", { required: { value: true, message: "Please fill duration" } })}
                      />
                    </div>
                  </div>
                  <div className="text-red-500">{errors.duration?.message}</div>
                </div>
                <div className="flex flex-col justify-center items-center space-y-2 my-8">
                  <Button
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white w-[300px] leading-[21px]"
                    loading={loadingCreateBorrow}
                    type="submit"
                  >
                    Create Borrow Request
                  </Button>
                  {isQuickRaise && (
                    <Button
                      className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% !rounded-3xl font-bold text-white w-[300px] leading-[21px]"
                      onClick={() => onHandleQuickBorrow()}
                      loading={loadingQuickBorrow}
                    >
                      Quick Raise
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Popup>
        );
      },
    });
  };

  if (!asset && !bundle) return;

  return (
    <div className="p-2 border rounded-xl cursor-pointer shadow-md" onClick={() => onOpenPopup()}>
      <div className="flex justify-center items-center">
        {asset && <NFTCard nftData={asset} />}
        {bundle && <BundleNFT bundle={bundle} />}
      </div>
      <div className="font-normal flex flex-col justify-center items-center space-y-2">
        <div className="font-bold text-[16px]">#{Number(id)}</div>
        {totalOraklPrice && (
          <div className="flex space-x-1">
            <div className="text-gray-900 text-[13px]">Oracle vaule:</div>
            <div className="font-semibold text-[14px]">{Number(ethers.utils.formatUnits(totalOraklPrice, 18)).toFixed(2)}$</div>
          </div>
        )}
        {appraisalPrice > 0 && (
          <div className="flex space-x-1">
            <div className="text-gray-900 text-[13px]">Appraisal vaule:</div>
            <div className="font-semibold text-[14px]">{appraisalPrice.toString()}$</div>
          </div>
        )}
        <div className="flex space-x-1">
          <div className="text-gray-900 text-[13px]">Weight:</div>
          <div className="font-semibold text-[14px]">{Number(ethers.utils.formatUnits(weight, 10)).toString()} gram</div>
        </div>
        {isQuickRaise && <div className="px-6 bg-green-700 font-bold text-white text-center border border-none rounded-2xl w-fit">Quick Raise</div>}
      </div>
    </div>
  );
};
export default NFTBorrowItem;
