import Popup from "../Popup/Popup";
import { usePopups } from "../Popup/PopupProvider";

const NFT: React.FC<{}> = () => {
  const { addPopup } = usePopups();

  const onOpenPopup = () => {
    addPopup({
      Component: () => {
        return <Popup className="bg-white"></Popup>;
      },
    });
  };
  return (
    <div className="p-2 border border-2 rounded-xl cursor-pointer" onClick={() => onOpenPopup()}>
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
