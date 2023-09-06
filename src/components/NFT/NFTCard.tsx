import * as ethers from "ethers";

const NFTCard: React.FC<{ nftData: any }> = ({ nftData }) => {
  // console.log("7s200:nft", nftData);
  return (
    <div className="nft-body">
      <div className="nft-container">
        <div className="card">
          <div className={`nft-front bg-cover bg-center`} style={{ backgroundImage: `url(${nftData._image})` }}>
            {Number(ethers.utils.formatUnits(nftData._oraklPrice, 26)) > 0 && (
              <div className="bg-green-600 text-white text-sm font-bold m-2 w-fit px-2 border border-none rounded-2xl">
                {Number(ethers.utils.formatUnits(nftData._oraklPrice, 26)).toFixed(2)} $
              </div>
            )}
            {Number(nftData._appraisalPrice) > 0 && (
              <div className="bg-blue-600 text-white text-sm font-bold m-2 w-fit px-2 border border-none rounded-2xl">{Number(nftData._appraisalPrice).toFixed(2)} $</div>
            )}
          </div>
          <div className="nft-back text-[12px]">
            <div>
              <div className="flex space-x-1">
                <div>Code:</div>
                <div className="font-semibold">{nftData._indentifierCode}</div>
              </div>
              <div className="flex space-x-1">
                <div>Price define:</div>
                <div className="font-semibold">{nftData._userDefinePrice.toString()}$</div>
              </div>
              <div className="flex space-x-1">
                <div>Price appraisal:</div>
                <div className="font-semibold">{nftData._appraisalPrice.toString()}$</div>
              </div>
              <div className="flex space-x-1">
                <div>Weight:</div>
                <div className="font-semibold">{ethers.utils.formatEther(nftData._weight)}</div>
              </div>
              <div className="flex space-x-1">
                <div>Expire:</div>
                <div className="font-semibold">{nftData._expireTime.toString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NFTCard;
