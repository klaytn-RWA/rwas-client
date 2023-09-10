import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircleFill } from "@styled-icons/bootstrap";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { api } from "../../config";
import { getAssets } from "../../redux/reducers/assetReducer";
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
  const [getting, setGetting] = useState(false);
  const { address, isConnected } = useAccount();
  const dispatch = useAppDispatch();
  const { removeAll } = usePopups();
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
    temp = NFTSampleData.map((e) => {
      return (
        <div className="cursor-pointer relative" onClick={() => setNFT(e)}>
          <img className="w-[100px] h-[120px] border border-none rounded-xl" src={e.img} key={e.id} />
          {e.id === nft?.id && <CheckCircleFill className="absolute top-2 left-2" size={20} color="green" />}
        </div>
      );
    });
    return temp;
  };

  const onSubmit: SubmitHandler<GetRWAsNFTType> = async (data) => {
    setGetting(true);
    try {
      // "to": "0x294003a3Dcf34B046D367147752e2B57141ABc6C",
      // "weight": 4,
      // "asset_type": 0,
      // "indentifier_code" : "GOLD1-0002",
      // "user_define_price": null,
      // "appraisal_price": null
      const res = await axios.post(
        `${api}/v1/mint`,
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
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Get RWA NFT success ",
            type: "success",
          }),
        );
        dispatch(getAssets({ address: address! }));
        setGetting(false);
        removeAll();
        return;
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
      <h1 className="mb-4 text-center font-bold text-[20px]">Get RWAs NFT</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center  space-x-2">
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
          {/* {nft?.assetType === 2 && (
            <div className="py-1">
              <div className="text-[16px] font-bold">Indentifier code</div>
              <div className="text-[13px]">Enter the indentifier code</div>

              <div className="max-w-[400px] flex justify-between items-center border rounded-xl my-2">
                <div className="px-2">
                  <Input
                    className={cn(
                      "transca--input-hide-arrows border-none border-transparent focus:border-transparent focus:!ring-0 !text-[14px] !pl-0 !pt-1 !pb-1 !leading-[30px]",
                    )}
                    placeholder="indenrifier code"
                    autoComplete="off"
                    {...register("indentifierCode", { required: { value: true, message: "Please fill indentifier code" } })}
                  />
                </div>
              </div>
              <div className="text-red-500">{errors.indentifierCode?.message}</div>
            </div>
          )} */}
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
