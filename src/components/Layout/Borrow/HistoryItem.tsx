import { txTruncateEthAddress } from "../../../services/address";

const HistoryItem: React.FC<{}> = ({}) => {
  return (
    <div className="w-full flex justify-between items-center border border-gray-300 rounded-xl p-2 cursor-pointer hover:bg-gray-100">
      <div className="flex items-center space-x-2">
        <div className="w-[50px] h-[50px] bg-blue-200 border border-none rounded-xl"></div>
        <div>
          <div className="flex space-x-1 text-[16px] leading-[20px]">
            <div className="font-normal text-gray-900">750</div>
            <span className="font-semibold text-gray-900">USDT</span>
          </div>
          <div className="text-[13px] text-gray-600 leading-[16px]">31 Aug 2023 • 12:28:13 GMT+7</div>
          <div>
            <div className="text-[13px] font-normal text-gray-700">
              Txn: <span className="font-bold text-gray-900">{txTruncateEthAddress("0xf93ae2640888575a53bea886d1560f34f0f3ee8a4d2ee338c3155a80e0539afd")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-end items-end">
        <div className="text-[14px] font-semibold">Expire Loan</div>
        <div className="text-[13px] text-gray-600 leading-[16px]">09 Sep 2023 • 12:28:13 GMT+7</div>
        <div className="text-[14px] bg-[#413c69] px-2 text-center text-white font-bold border border-none rounded-xl">10 Days</div>
      </div>
    </div>
  );
};
export default HistoryItem;
