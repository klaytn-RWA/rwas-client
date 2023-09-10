import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowBack } from "@styled-icons/boxicons-regular";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useAccount, useContractReads } from "wagmi";
import {} from "../../../../public/icons/diamond1.png";
import abiAsset from "../../../abi/TranscaAssetNFT.json";
import abiBundle from "../../../abi/TranscaBundleNFT.json";
import { getAssets, selectAsset } from "../../../redux/reducers/assetReducer";
import { getBundles, selectBundle } from "../../../redux/reducers/bundleReducer";
import { getBorrowReqs, selectIntermediation } from "../../../redux/reducers/intermediationReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Header from "../../Header/Header";
import BundleNFT from "../../NFT/BundleNFT";
import NFTCard from "../../NFT/NFTCard";
import SearchInput from "../../Search/SearchInput";

console.log(import.meta.env);

const Portfolio: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();

  const assetRx = useAppSelector(selectAsset);
  const bundleRx = useAppSelector(selectBundle);
  const intermediationRx = useAppSelector(selectIntermediation);

  useEffect(() => {
    dispatch(getAssets({ address: address! }));
    dispatch(getBundles({ address: address! }));
    dispatch(getBorrowReqs({}));
  }, [address, dispatch]);

  // TO-DO counter asset,bundle, all-borrow-balance
  const {
    data: contract,
    isError: contractError,
    isLoading: contractLoading,
    isFetched: contractFetched,
  } = useContractReads({
    watch: true,
    contracts: [
      {
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT! as any,
        abi: abiAsset as any,
        functionName: "assetId",
        args: [],
      },
      {
        address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT! as any,
        abi: abiBundle as any,
        functionName: "bundleId",
        args: [],
      },
    ],
  });

  const assetIds = (contract as any)?.[0].result;
  const bundleIds = (contract as any)?.[1].result;

  const onShowNFTs = () => {
    let temp: Array<any> = [];
    if (assetRx.assets.length > 0 && !assetRx.loading) {
      assetRx.assets.forEach((e, i) => {
        temp.push(<NFTCard key={i} nftData={e} />);
      });
    }
    if (temp.length > 0) {
      return temp;
    }
    return null;
  };

  const onShowBundleNFTs = () => {
    let temp: Array<any> = [];
    if (bundleRx.bundles.length > 0 && !bundleRx.loading) {
      bundleRx.bundles.forEach((e, i) => {
        temp.push(<BundleNFT bundle={e} key={i} />);
      });
    }
    if (temp.length > 0) {
      return temp;
    }
    return null;
  };

  const onGetTotalLoanPaid = () => {
    let total = ethers.BigNumber.from(0);
    if (!intermediationRx.loading && intermediationRx.allBorrowReqs.length > 0) {
      intermediationRx.allBorrowReqs.forEach((element) => {
        if (element.borrowedAt > 0 && element.lendOfferReqId > 0) {
          total = total.add(element.amount);
        }
      });
    }
    return total;
  };

  return (
    <>
      <Header />
      <div className="p-4 md:ml-64 mt-14 bg-gray-100 h-screen">
        <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer">
          <ArrowBack size={24} />
          <div className="text-[18px] font-bold">Portfolio</div>
        </h2>
        <div className="py-2 border border-none rounded-xl my-4 flex flex-col space-y-4 lg:space-x-4 lg:space-y-0 lg:flex-row">
          <div className="flex flex-col space-y-4 md:space-x-4 md:space-y-0 md:flex-row">
            <div className="flex justify-between items-center space-x-2 w-[400px] bg-white drop-shadow-xl px-4 py-4 border border-none rounded-xl">
              <div className="text-[20px]">
                <div className="text-[16px] font-normal">Total vault RWAs NFT</div>
                <div className="font-bold">{Number(assetIds) >= 0 ? Number(assetIds) : 0}</div>
              </div>
              <img className="max-w-[90px] max-h-[90px]" src="/icons/bundleNFT.webp" alt="nft" />
            </div>
            <div className="flex justify-between items-center space-x-2 w-[400px] bg-white drop-shadow-xl px-4 py-4 border border-none rounded-xl">
              <div className="text-[20px]">
                <div className="text-[16px] font-normal">Total bundle RWAs NFT</div>
                <div className="font-bold">{Number(bundleIds) >= 0 ? Number(bundleIds) : 0}</div>
              </div>
              <img className="max-w-[90px] max-h-[90px]" src="/icons/nft-box.png" alt="bundle" />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex justify-between items-center space-x-2 w-[400px] bg-white drop-shadow-xl px-4 py-4 border border-none rounded-xl">
              <div className="text-[20px]">
                <div className="text-[16px] font-normal">Total Loan Paid</div>
                <div className="font-bold">{Number(ethers.utils.formatUnits(onGetTotalLoanPaid())).toFixed(2)}$</div>
              </div>
              {/* <ExchangeFunds size={60} /> */}

              <img className="max-w-[80px] max-h-[80px]" src="/icons/lending.png" alt="wallet" />
            </div>
            {/* <div className="flex justify-between items-center space-x-2 w-[300px] bg-white drop-shadow-xl px-4 py-4 border border-none rounded-xl">
              <div className="text-[20px]">
                <div className="text-[16px] font-normal">Total fund</div>
                <div className="font-bold">200$</div>
              </div>
              <img className="max-w-[50px] max-h-[50px]" src="/icons/wallet.png" alt="wallet" />
            </div> */}
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
          {!onShowBundleNFTs() && !onShowNFTs() && (
            <div className="text-center flex justify-center items-center  border border-none rounded-xl min-h-[600px] bg-white my-4 font-bold">
              {address && isConnected ? "Empty" : <ConnectButton />}
            </div>
          )}
          {(onShowBundleNFTs() || onShowNFTs()) && (
            <div className="flex jusitfy-center items-center flex-wrap bg-white my-4 border border-none rounded-xl">
              {onShowBundleNFTs()}
              {onShowNFTs()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Portfolio;
