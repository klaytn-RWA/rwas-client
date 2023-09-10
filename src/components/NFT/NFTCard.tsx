import * as ethers from "ethers";
import { useState } from "react";
import { Asset } from "../../redux/reducers/assetReducer";

const NFTCard: React.FC<{ nftData: Asset }> = ({ nftData }) => {
  const [asset] = useState(nftData);

  return (
    <div className="nft-body">
      <div className="nft-container">
        <div className="card">
          <div className={`nft-front bg-cover bg-center`} style={{ backgroundImage: `url(${asset.image!})` }}>
            {Number(ethers.utils.formatUnits(asset.oraklPrice, 18)) > 0 && (
              <div className="bg-green-600 text-white text-sm font-bold m-2 w-fit px-2 border border-none rounded-2xl">
                {Number(ethers.utils.formatUnits(asset.oraklPrice!, 18)).toFixed(2)} $
              </div>
            )}
            {Number(asset.appraisalPrice) > 0 && (
              <div className="bg-blue-600 text-white text-sm font-bold m-2 w-fit px-2 border border-none rounded-2xl">{Number(asset.appraisalPrice!).toFixed(2)} $</div>
            )}
          </div>
          <div className="nft-back text-[12px]">
            <div>
              <div className="flex space-x-1">
                <div>Code:</div>
                <div className="font-semibold">{asset.indentifierCode!}</div>
              </div>
              <div className="flex space-x-1">
                <div>Price define:</div>
                <div className="font-semibold">{asset.userDefinePrice!.toString()}$</div>
              </div>
              <div className="flex space-x-1">
                <div>Price appraisal:</div>
                <div className="font-semibold">{asset.appraisalPrice!.toString()}$</div>
              </div>
              <div className="flex space-x-1">
                <div>Weight:</div>
                <div className="font-semibold">
                  {ethers.utils.formatUnits(asset.weight!, 10)} <span> {asset.assetType === 0 && "ounce"}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <div>Expire:</div>
                <div className="font-semibold">{asset.expireTime!.toString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NFTCard;
