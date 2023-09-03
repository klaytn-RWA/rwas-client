import { useState } from "react";
import cn from "../../services/cn";
import Input from "../Input/Input";
import Popup from "../Popup/Popup";
import { usePopups } from "../Popup/PopupProvider";
import KanaSelectDropdown, { COINS_DATA } from "../Selector/RadixSelector";
import NFTDefault from "./NFTDefault";

const NFT: React.FC<{}> = () => {
  const { addPopup } = usePopups();

  const onOpenPopup = () => {
    addPopup({
      Component: () => {
        const [currentCoin, setCurrentCoin] = useState(COINS_DATA[0].address);
        return (
          <Popup className="bg-gray-50 min-w-[1200px] min-h-[700px]">
            <h1 className="mb-4 text-center font-bold text-[20px]">Create Borrow</h1>
            <div className="flex justify-center  space-x-2">
              <div className="h-full w-1/4 shadow-xl border border-none rounded-xl p-2 bg-white">
                <NFTDefault />
              </div>
              <div className="w-3/4 bg-blue-200 px-6 bg-white border border-none rounded-xl shadow-xl">
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
                  <div className="text-[16px] font-bold">Loan Interest</div>
                  <div className="text-[13px]">Enter the interest rate</div>

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
                          console.log("7s200:data", data);
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
              </div>
            </div>
          </Popup>
        );
      },
    });
  };
  return (
    <div className="p-2 border border-2 rounded-xl cursor-pointer shadow-2xl" onClick={() => onOpenPopup()}>
      <div className="flex justify-center items-center">
        <img className="max-w-[200px] max-h-[350px] object-contain border border-none rounded-xl" src="/icons/gold1.png" alt="nft" />
      </div>
      <div className="font-normal flex flex-col justify-center items-center space-y-2">
        <div className="font-bold text-[16px]">#GOLD-01</div>
        <div className="flex space-x-1">
          <div className="text-gray-900 text-[13px]">Value:</div>
          <div className="font-semibold text-[14px]">1500$</div>
        </div>
        <div className="flex space-x-1">
          <div className="text-gray-900 text-[13px]">Weight:</div>
          <div className="font-semibold text-[14px]">0.5 gram</div>
        </div>
        <div className="px-6 bg-green-700 font-bold text-white text-center border border-none rounded-2xl w-fit">Quick Raise</div>
      </div>
    </div>
  );
};
export default NFT;
