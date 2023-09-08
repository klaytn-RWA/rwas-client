import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import { Intermediation } from "../../../redux/reducers/intermediationReducer";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const HistoryItem: React.FC<{ data: Intermediation }> = ({ data }) => {
  return (
    <div className="w-full flex justify-between items-center border border-gray-300 rounded-xl p-2 cursor-pointer hover:bg-gray-100">
      <div className="flex items-center space-x-2">
        <div className="w-[50px] h-[50px] bg-blue-200 border border-none rounded-xl"></div>
        <div>
          <div className="flex space-x-1 text-[16px] leading-[20px]">
            <div className="font-normal text-gray-900">{ethers.utils.formatUnits(data.amount.toString(), 18).toString()}</div>
            <span className="font-semibold text-gray-900">USDT</span>
          </div>
          <div className="text-[13px] text-gray-600 leading-[16px]">
            {data.borrowedAt > 0 ? new Date(Number(data.borrowedAt) * 1000).toUTCString() : new Date(Number(data.createdAt) * 1000).toUTCString()}
          </div>
          <div className="flex space-x-3">
            <div className="text-[13px] font-normal text-gray-700">
              Id: <span className="font-bold text-gray-900">#{Number(data.borrowReqId)}</span>
            </div>
            <div className="text-[13px] font-normal text-gray-700">
              Duration: <span className="font-bold text-gray-900">{Number(data.duration) / 60} min(s)</span>
            </div>
          </div>
        </div>
      </div>

      {data.returned && data.returnedAt > 0 && (
        <div className="flex flex-col justify-end items-end">
          <div className="text-[14px] bg-green-700 px-2 text-center text-white font-bold border border-none rounded-xl">Loan Paid</div>
        </div>
      )}
      {!data.returned && data.lendOfferReqId > 0 && (
        <div className="flex flex-col justify-end items-end">
          <div className="text-[14px] font-semibold">Expire Loan</div>
          <div className="text-[13px] text-gray-600 leading-[16px]">{new Date(Number(Number(data.borrowedAt + data.duration) * 1000)).toUTCString()}</div>
          <div className="text-[14px] bg-[#413c69] px-2 text-center text-white font-bold border border-none rounded-xl">10 Days</div>
        </div>
      )}
    </div>
  );
};
export default HistoryItem;
