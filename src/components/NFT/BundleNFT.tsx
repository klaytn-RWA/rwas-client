import { ethers } from "ethers";
import { Bundle } from "../../redux/reducers/bundleReducer";
import Popup from "../Popup/Popup";
import { usePopups } from "../Popup/PopupProvider";
import NFTCard from "./NFTCard";

const BundleNFT: React.FC<{ bundle: Bundle }> = ({ bundle }) => {
  const { addPopup } = usePopups();

  const totalOraklPrice = () => {
    let price = ethers.BigNumber.from(0);
    if (bundle.nfts) {
      if (bundle.nfts.length > 0) {
        bundle.nfts.forEach((e: any) => {
          price = price.add(e.oraklPrice);
        });
      }
    }
    return Number(ethers.utils.formatEther(price)).toFixed(2);
  };

  const onOpenBundleDetail = () => {
    addPopup({
      Component: () => {
        const onShowNFTs = () => {
          let nfts = null;
          if (bundle.nfts.length > 0) {
            nfts = bundle.nfts.map((e: any, i: number) => {
              return <NFTCard key={i} nftData={e} />;
            });
          }
          return nfts;
        };

        return (
          <Popup className="bg-gray-50">
            <h1 className="mb-4 text-center font-bold text-[20px]">Bundle #{bundle.id.toString()}</h1>
            <div className="flex justify-center items-center">
              <div className="grid grid-cols-2 gap-1">{onShowNFTs()}</div>
            </div>
          </Popup>
        );
      },
    });
  };

  return (
    <div className="nft-body" onClick={() => onOpenBundleDetail()}>
      <div className="nft-container">
        <div className="card">
          <div className={`nft-front bg-cover bg-center`} style={{ backgroundImage: `url(${bundle.uri})` }}>
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-bold m-2 w-fit px-2 border border-none rounded-2xl">Bundle</div>
            <div className="bg-green-600 text-white text-sm font-bold m-2 w-fit px-2 border border-none rounded-2xl">{totalOraklPrice()} $</div>
          </div>
          <div className="nft-back text-[12px]">
            <div>
              <div className="flex space-x-1">
                <div>Click to show more info</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BundleNFT;
