import { writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import { useState } from "react";
import { useAccount } from "wagmi";
import abiIntermadiation from "../../abi/TranscaIntermediation.json";
import { Asset, getAssets } from "../../redux/reducers/assetReducer";
import { Bundle, getBundles } from "../../redux/reducers/bundleReducer";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../redux/store";
import cn from "../../services/cn";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Popup from "../Popup/Popup";
import { usePopups } from "../Popup/PopupProvider";
import KanaSelectDropdown, { COINS_DATA } from "../Selector/RadixSelector";
import NFTProperty from "./NFTProperty";

const NFT: React.FC<{ asset?: Asset; bundle?: Bundle }> = ({ asset, bundle }) => {
  const { addPopup } = usePopups();
  console.log("7s200asset", asset);
  let totalOraklPrice = 0;
  let image = "";
  let indentifierCode = "";
  let appraisalPrice = 0;
  let id = 0;
  let userDefinePrice = 0;
  let weight = 0;
  let isQuickRaise = false;
  let contract = "";
  if (asset) {
    totalOraklPrice = asset.oraklPrice;
    image = asset.image;
    appraisalPrice = asset.appraisalPrice;
    id = asset.assetId;
    weight = asset.weight;
    isQuickRaise = asset.assetType === 0;
    indentifierCode = asset.indentifierCode;
    contract = import.meta.env.VITE_TRANSCA_ASSET_CONTRACT! as any;
  }
  if (bundle) {
    totalOraklPrice = bundle.totalOraklValue;
    image = bundle.uri;
    let _weight = 0;
    let _appraisalPrice = 0;
    bundle.nfts.forEach((element) => {
      _weight += element.weight;
      _appraisalPrice += element.appraisalPrice;
    });
    weight = _weight;
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

        const onHandleCreateBorrowReq = async () => {
          setLoadingCreateBorrow(true);
          const createBorrowReq = await writeContract({
            address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
            abi: abiIntermadiation,
            functionName: "createBorrow",
            args: [id, contract, ethers.utils.parseUnits("1000000", 18), ethers.utils.parseUnits("800000", 18), ethers.BigNumber.from(10 * 60)],
          });
          if (createBorrowReq.hash) {
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
            setLoadingCreateBorrow(false);
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
            setLoadingCreateBorrow(false);
          }
        };

        const onHandleQuickBorrow = async () => {
          setLoadingQuickBorrow(true);
          const createBorrowReq = await writeContract({
            address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT! as any,
            abi: abiIntermadiation,
            functionName: "createQuickBorrow",
            args: [id, contract, ethers.BigNumber.from(100 * 60)],
          });
          if (createBorrowReq.hash) {
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
            setLoadingQuickBorrow(false);
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
            <h1 className="mb-4 text-center font-bold text-[20px]">Create Borrow</h1>
            <div className="flex justify-center  space-x-2">
              <div className="h-full w-1/2 shadow-xl border border-none rounded-xl p-2 bg-white">
                <div className="">
                  <div>
                    <img className="mx-auto max-w-[200px] max-h-[300px] border border-none rounded-xl" src={image} alt="nft-icon" />
                    <div className="font-semibold text-center">#{id.toString()}</div>
                  </div>
                  <div>
                    <div className="font-bold text-[14px] m-2">Properties</div>
                    <div className="m-2">
                      <NFTProperty title="code" content={indentifierCode!} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <NFTProperty title="weight" content={`${Number(ethers.utils.formatUnits(weight, 10)).toString()} ${isQuickRaise ? "ounce" : "gram"}`} />
                      <NFTProperty title="ounce" content={Number(ethers.utils.formatUnits(weight, 10)).toString()} />
                    </div>
                  </div>
                  {isQuickRaise && (
                    <div className="my-4">
                      <div className={`bg-green-100 border-green-500 w-fit  border  rounded-2xl text-green-700 px-4 py-3`} role="alert">
                        <p className="font-bold text-[13px]">Quick Raise:</p>{" "}
                        <p className="text-[13px]">{`Your #${id} is in High Liquidity Class, Transca will be fund for your NFT`}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-1/2 bg-blue-200 px-6 bg-white border border-none rounded-xl shadow-xl">
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
                        name={""}
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
                </div>
                {/* Loan Interest */}
                <div className="py-4">
                  <div className="text-[16px] font-bold">Mint Loan Amount</div>
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
                        name={""}
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
                        name={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center space-y-2 my-8">
                  <Button
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white w-[300px] leading-[21px]"
                    onClick={() => onHandleCreateBorrowReq()}
                    loading={loadingCreateBorrow}
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
            </div>
          </Popup>
        );
      },
    });
  };

  if (!asset && !bundle) return;

  return (
    <div className="p-2 border border-2 rounded-xl cursor-pointer shadow-2xl" onClick={() => onOpenPopup()}>
      <div className="flex justify-center items-center">
        <img className="w-[150px] h-[180px] border border-none rounded-xl" src={image} alt="nft" />
      </div>
      <div className="font-normal flex flex-col justify-center items-center space-y-2">
        <div className="font-bold text-[16px]">#{Number(id)}</div>
        {totalOraklPrice && (
          <div className="flex space-x-1">
            <div className="text-gray-900 text-[13px]">Oracl vaule:</div>
            <div className="font-semibold text-[14px]">{Number(ethers.utils.formatUnits(totalOraklPrice, 18)).toString()}$</div>
          </div>
        )}
        {appraisalPrice && (
          <div className="flex space-x-1">
            <div className="text-gray-900 text-[13px]">Appraisal vaule:</div>
            <div className="font-semibold text-[14px]">{appraisalPrice.toString()}$</div>
          </div>
        )}
        <div className="flex space-x-1">
          <div className="text-gray-900 text-[13px]">Weight:</div>
          <div className="font-semibold text-[14px]">
            {Number(ethers.utils.formatUnits(weight, 10)).toString()} {isQuickRaise ? "ounce" : "gram"}
          </div>
        </div>
        {isQuickRaise && <div className="px-6 bg-green-700 font-bold text-white text-center border border-none rounded-2xl w-fit">Quick Raise</div>}
      </div>
    </div>
  );
};
export default NFT;
