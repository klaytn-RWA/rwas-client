import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircleFill } from "@styled-icons/bootstrap";
import { waitForTransaction, writeContract } from "@wagmi/core";
import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import abiTranscaAsset from "../../abi/TranscaAssetNFT.json";
import { api } from "../../config";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../redux/store";
import cn from "../../services/cn";
import { resolverError } from "../../utils/form";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Popup from "./Popup";
import { usePopups } from "./PopupProvider";
type GetRWAsNFTType = {
  weight: string;
  userDefinePrice: string;
  appraisalPrice: string;
};

const NFTSampleData = [
  {
    id: 0,
    img: "./nfts/diamond-1.png",
    code: "DIAMOND1",
    content: "Karat",
    assetType: 1,
  },
  {
    id: 1,
    img: "./nfts/diamond-2.png",
    code: "DIAMOND2",
    content: "Karat",
    assetType: 1,
  },
  {
    id: 2,
    img: "./nfts/diamond-3.png",
    code: "DIAMOND3",
    content: "Karat",
    assetType: 1,
  },
  {
    id: 3,
    img: "./nfts/gold-1.png",
    code: "GOLD1",
    content: "Ounce",
    assetType: 0,
  },
  {
    id: 4,
    img: "./nfts/gold-2.png",
    code: "GOLD2",
    content: "Ounce",
    assetType: 0,
  },
  {
    id: 5,
    img: "./nfts/gold-3.png",
    code: "GOLD3",
    content: "Ounce",
    assetType: 0,
  },
  {
    id: 6,
    img: "./nfts/patek-philippe-nautilus-1.png",
    code: "PATEK1",
    content: "Weight",
    assetType: 2,
  },
  {
    id: 7,
    img: "./nfts/audemars-piguet-royal-oak-1.png",
    code: "AP1",
    content: "Weight",
    assetType: 2,
  },
  {
    id: 8,
    img: "./nfts/audemars-piguet-royal-oak-2.png",
    code: "AP2",
    content: "Weight",
    assetType: 2,
  },
];

const PopupGetRWAsNFT: React.FC<{}> = () => {
  const [nft, setNFT] = useState<{ id: number; img: string; code: string; content: string; assetType: number }>();
  const [isShipping, setIsShipping] = useState(false);
  const [getting, setGetting] = useState(false);
  const { address, isConnected } = useAccount();
  const dispatch = useAppDispatch();
  const { removeAll, addPopup } = usePopups();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GetRWAsNFTType>({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    shouldUnregister: false,
    resolver: async (values) => {
      let errors = {};

      if (!values.weight) {
        errors = { ...errors, ...resolverError("weight", "required", "Weight is required") };

        return { values, errors };
      }

      if (Number.isNaN(Number(values.weight))) {
        errors = { ...errors, ...resolverError("weight", "required", "Weight must be a number") };

        return { values, errors };
      }

      if (!Number.isInteger(Number(values.weight))) {
        errors = { ...errors, ...resolverError("weight", "required", "Weight must be integer 1,2,3,4,...") };
      }

      if (Number(values.weight) < 0) {
        errors = { ...errors, ...resolverError("weight", "required", "Weight must be more than 0") };
      }

      return { values, errors };
    },
  });

  const onShowNFTSample = () => {
    let temp = null;
    temp = NFTSampleData.map((e, i) => {
      return (
        <div key={i} className="cursor-pointer relative" onClick={() => setNFT(e)}>
          <img className="w-[100px] h-[120px] border border-none rounded-xl" src={e.img} key={e.id} />
          {e.id === nft?.id && <CheckCircleFill className="absolute top-2 left-2" size={20} color="green" />}
        </div>
      );
    });
    return temp;
  };

  const onOpenPopUpSipping = () => {
    return addPopup({
      Component: () => {
        return (
          <Popup className="bg-gray-50 min-w-[800px]">
            <h1 className="mb-4 text-center font-bold text-[20px]">Confirm transcation to Get RWAs NFT by shiping asset</h1>
            <div className="flex justify-center space-x-2">
              <img className="w-[100px] h-[150px] border border-none rounded-2xl" src={"https://ipfs.io/ipfs/QmaW2mCroyKNTRyeDY756ok7DGLwSaL74J8vsrK81dwnLM"} />
            </div>
            {/* Shipping */}
            <div className="flex justify-center items-center w-full my-4 border boder-2 rounded-2xl py-3">
              <div className="w-1/5 flex flex-col justify-center items-center">
                <div className="relative border border-none rounded-full p-4 bg-blue-500 text-white text-sm">
                  <p className="absolute top-[14px] left-7 w-[130px] h-[8px] bg-blue-500"></p>
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
                  <p className="absolute top-[14px] left-7 w-[130px] h-[8px] bg-blue-500"></p>
                </div>
                <div>Stock Sign</div>
              </div>

              <div className="w-1/5 flex flex-col justify-center items-center">
                <div className="relative border border-none rounded-full p-4 bg-blue-500 text-white text-sm">
                  <p className="absolute top-[14px] left-7 w-[130px] h-[8px] bg-blue-500"></p>
                </div>
                <div>Audit sign</div>
              </div>

              <div className="w-1/5 flex flex-col justify-center items-center">
                <div className="border border-none rounded-full p-4 bg-blue-500 text-white text-sm"></div>
                <div>Enter Warehouse</div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center space-y-2 my-8">
              {isConnected && address ? (
                <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white w-[300px] leading-[21px]" loading={getting}>
                  Confirm transcation
                </Button>
              ) : (
                <ConnectButton />
              )}
            </div>
          </Popup>
        );
      },
    });
  };

  const onSubmit: SubmitHandler<GetRWAsNFTType> = async (data) => {
    setGetting(true);
    if (!isShipping) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Please approve shipping rule",
          type: "error",
        }),
      );
      setGetting(false);
      return;
    }
    try {
      const res = await axios.post(
        `${api}/v1/create-mint-request`,
        {
          to: address!,
          weight: data.weight,
          asset_type: nft?.assetType,
          indentifier_code: `${nft?.code}-`,
          user_define_price: data.userDefinePrice.length > 0 ? data.userDefinePrice : null,
          appraisal_price: data.appraisalPrice.length > 0 ? data.appraisalPrice : null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      if (res.status === 200) {
        // call request
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Please confirm transcation to create request get RWAs NFT",
            type: "info",
          }),
        );
        addPopup({
          Component: () => {
            const [isLoading, setIsLoading] = useState(false);
            const { ipfs_hash, expireTime, to, weight, asset_type, indentifier_code, user_define_price, appraisal_price } = res.data;
            const onConfirmTranscation = async () => {
              setIsLoading(true);
              const requestCreateMintRWAs = await writeContract({
                address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT! as any,
                abi: abiTranscaAsset,
                functionName: "requestMintRWA",
                args: [
                  ethers.utils.parseUnits(weight.toString(), 18),
                  ethers.BigNumber.from(expireTime),
                  ethers.BigNumber.from(asset_type),
                  indentifier_code,
                  ipfs_hash,
                  ethers.utils.parseUnits(user_define_price, 18),
                  ethers.utils.parseUnits(appraisal_price, 18),
                ],
              });
              if (requestCreateMintRWAs.hash) {
                const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: requestCreateMintRWAs.hash });
                if (waitTranscation.status === "success") {
                  dispatch(
                    setToast({
                      show: true,
                      title: "",
                      message: "Create request success",
                      type: "success",
                    }),
                  );

                  setIsLoading(false);
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
                  setIsLoading(false);
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
                setIsLoading(false);
              }
            };

            return (
              <Popup className="bg-gray-50 min-w-[700px]">
                <h1 className="mb-4 text-center font-bold text-[20px]">Confirm transcation to Get RWAs NFT by shiping asset</h1>
                <div className="flex justify-center space-x-2">
                  <img className="w-[100px] h-[150px] border border-none rounded-2xl" src={res.data.img} />
                </div>
                <div className="flex flex-col justify-center items-center space-y-2 my-8">
                  {isConnected && address ? (
                    <Button
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white w-[300px] leading-[21px]"
                      onClick={onConfirmTranscation}
                      loading={isLoading}
                    >
                      Confirm transcation
                    </Button>
                  ) : (
                    <ConnectButton />
                  )}
                </div>
              </Popup>
            );
          },
        });
        // dispatch(getAssets({ address: address! }));
        // setGetting(false);
        // removeAll();
        // return;
      } else {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Get RWA NFT error ",
            type: "error",
          }),
        );
        setGetting(false);
        return;
      }
    } catch (error) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Get RWA NFT error ",
          type: "error",
        }),
      );
      setGetting(false);
    }
  };

  return (
    <Popup className="bg-gray-50 min-w-[700px]">
      <h1 className="mb-4 text-center font-bold text-[20px]" onClick={onOpenPopUpSipping}>
        Get RWAs NFT by shiping asset
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center space-x-2">
        <div className="w-1/2 px-6 bg-white border border-none rounded-xl shadow-xl">
          <div className="py-1 flex justify-center items-center h-full">
            <div className="grid grid-cols-3 gap-4">{onShowNFTSample()}</div>
          </div>
        </div>
        <div className="w-1/2 px-6 bg-white border border-none rounded-xl shadow-xl">
          <div className="py-2">
            <div className="text-[16px] font-bold">{nft?.content ? nft.content : "Weight"}</div>
            <div className="text-[13px]">Enter the {nft?.content ? nft.content : "Weight"} of asset</div>

            <div className="max-w-[400px] flex justify-between items-center border rounded-xl my-2">
              <div className="px-2">
                <Input
                  type="number"
                  className={cn("transca--input-hide-arrows border-none border-transparent focus:border-transparent focus:!ring-0 !text-[14px] !pl-0 !pt-1 !pb-1 !leading-[30px]")}
                  placeholder="0.00"
                  autoComplete="off"
                  {...register("weight", { required: { value: true, message: "Please fill weight" } })}
                />
              </div>
            </div>
            <div className="text-red-500">{errors.weight?.message}</div>
          </div>
          <div className="py-1">
            <div className="text-[16px] font-bold">User define price (Optional)</div>
            <div className="text-[13px]">Enter your define price for asset</div>
            <div className="max-w-[400px] flex justify-between items-center border rounded-xl my-2">
              <div className="px-2">
                <Input
                  type="number"
                  className={cn("transca--input-hide-arrows border-none border-transparent focus:border-transparent focus:!ring-0 !text-[14px] !pl-0 !pt-1 !pb-1 !leading-[30px]")}
                  placeholder="0.00"
                  autoComplete="off"
                  {...register("userDefinePrice", { required: { value: true, message: "Please fill user define price" } })}
                />
              </div>
            </div>
          </div>
          <div className="py-1">
            <div className="text-[16px] font-bold">Appraisal price (Optional)</div>
            <div className="text-[13px]">Enter the appraisal price of third party</div>
            <div className="max-w-[400px] flex justify-between items-center border rounded-xl my-2">
              <div className="px-2">
                <Input
                  type="number"
                  className={cn("transca--input-hide-arrows border-none border-transparent focus:border-transparent focus:!ring-0 !text-[14px] !pl-0 !pt-1 !pb-1 !leading-[30px]")}
                  placeholder="0.00"
                  autoComplete="off"
                  {...register("appraisalPrice", { required: { value: true, message: "Please fill appraisal price" } })}
                />
              </div>
            </div>
            <div className="text-red-500">{errors.appraisalPrice?.message}</div>
          </div>
          <div className="py-1">
            <div className="text-[16px] font-bold">Shiping service</div>
            <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <input
                onChange={() => setIsShipping(!isShipping)}
                checked={isShipping}
                id="bordered-checkbox-2"
                type="checkbox"
                value=""
                name="bordered-checkbox"
                className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="w-full px-2 py-4 text-[13px]">Shipping rule</label>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center space-y-2 my-8">
            {isConnected && address ? (
              <Button
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white w-[300px] leading-[21px]"
                type="submit"
                loading={getting}
              >
                Get NFT
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
export default PopupGetRWAsNFT;
