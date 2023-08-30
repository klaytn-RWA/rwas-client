import NFTCard from "../NFT/NFTCard";
import SearchInput from "../Search/SearchInput";

import { ArrowBack } from "@styled-icons/boxicons-regular";
const Portfolio: React.FC<{}> = () => {
  return (
    <>
      <div className="p-4 md:ml-64 mt-14 bg-gray-100 h-screen">
        <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer">
          <ArrowBack size={24} />
          <div className="text-[20px] font-bold">Portfolio</div>
        </h2>
        <div className="py-2 border border-none rounded-xl my-4 flex space-x-4">
          <div className="flex justify-between items-center space-x-2 w-[300px] bg-white drop-shadow-xl px-4 py-4 border border-none rounded-xl">
            <div className="text-[20px]">
              <div className="text-[16px] font-normal">Total vault RWAs NFT</div>
              <div className="font-bold">200$</div>
            </div>
            <img className="max-w-[50px] max-h-[50px]" src="/icons/wallet.png" alt="wallet" />
          </div>
          <div className="flex justify-between items-center space-x-2 w-[300px] bg-white drop-shadow-xl px-4 py-4 border border-none rounded-xl">
            <div className="text-[20px]">
              <div className="text-[16px] font-normal">Total staking RWAs NFT</div>
              <div className="font-bold">200$</div>
            </div>
            <img className="max-w-[50px] max-h-[50px]" src="/icons/wallet.png" alt="wallet" />
          </div>
          <div className="flex justify-between items-center space-x-2 w-[300px] bg-white drop-shadow-xl px-4 py-4 border border-none rounded-xl">
            <div className="text-[20px]">
              <div className="text-[16px] font-normal">Total lending RWAs NFT</div>
              <div className="font-bold">200$</div>
            </div>
            <img className="max-w-[50px] max-h-[50px]" src="/icons/wallet.png" alt="wallet" />
          </div>
          <div className="flex justify-between items-center space-x-2 w-[300px] bg-white drop-shadow-xl px-4 py-4 border border-none rounded-xl">
            <div className="text-[20px]">
              <div className="text-[16px] font-normal">Total fund</div>
              <div className="font-bold">200$</div>
            </div>
            <img className="max-w-[50px] max-h-[50px]" src="/icons/wallet.png" alt="wallet" />
          </div>
        </div>
        <div>
          <div className="bg-white px-4 py-4 border border-none rounded-xl flex flex-col lg:flex-row justify-between items-center space-x-4">
            <div className="flex-1 pb-2 lg:pb-0">
              <SearchInput />
            </div>
            <div className="flex justify-center items-center space-x-2 max-w-[500px] min-w-[400px]">
              <select className="px-4 py-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value="">All Type</option>
                <option value="for-rent">Low Liquidity Class</option>
                <option value="for-sale">High Liquidity Class</option>
              </select>

              <select className="px-4 py-2 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value="">Short by</option>
                <option value="fully-furnished">Price</option>
                <option value="partially-furnished">Mint date</option>
              </select>
            </div>
          </div>
          <div className="flex jusitfy-center items-center flex-wrap bg-white my-4 border border-none rounded-xl">
            <NFTCard nftImg="/nfts/diamond1.png" />
            <NFTCard nftImg="/nfts/diamond2.png" />
            <NFTCard nftImg="/nfts/diamond3.png" />
            <NFTCard nftImg="/nfts/gold1.png" />
            <NFTCard nftImg="/nfts/gold1.png" />
            <NFTCard nftImg="/nfts/gold1.png" />
            <NFTCard nftImg="/nfts/gold1.png" />
            <NFTCard nftImg="/nfts/gold1.png" />
            <NFTCard nftImg="/nfts/gold1.png" />
            <NFTCard nftImg="/nfts/gold1.png" />
          </div>
        </div>
      </div>
    </>
  );
};
export default Portfolio;
