import { ArrowBack } from "@styled-icons/boxicons-regular";
import { readContract } from "@wagmi/core";
import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import {} from "../../../../public/icons/diamond1.png";
import abiAsset from "../../../abi/TranscaAssetNFT.json";
import abiBundle from "../../../abi/TranscaBundleNFT.json";

import { useAppDispatch } from "../../../redux/store";
import Header from "../../Header/Header";
import BundleNFT from "../../NFT/BundleNFT";
import NFTCard from "../../NFT/NFTCard";
import { usePopups } from "../../Popup/PopupProvider";
import SearchInput from "../../Search/SearchInput";

const Portfolio: React.FC<{}> = () => {
  const [listNFTs, setListNFTs] = useState<Array<any>>([]);
  const [bundles, setBundles] = useState<Array<any>>([]);
  const { addPopup } = usePopups();
  const dispatch = useAppDispatch();
  const { address, isConnecting, isDisconnected } = useAccount();

  const {} = useContractRead({
    address: import.meta.env.VITE_TRANSCA_NFT_CONTRACT!,
    abi: abiAsset,
    functionName: "getAllAssetByUser",
    args: [address],
    onSuccess: async (data: Array<any>) => {
      for (let index = 0; index < data.length; index++) {
        const uri = await readContract({
          address: import.meta.env.VITE_TRANSCA_NFT_CONTRACT!,
          abi: abiAsset,
          functionName: "tokenURI",
          args: [data[index]._assetId],
        });
        if (uri) {
          const response = await fetch(uri as string)
            .then((response) => response.json())
            .catch(() => {
              return null;
            });
          if (response) {
            data[index]._image = response.image;
          } else {
            data[index]._image = uri;
          }
        }
      }
      setListNFTs(data);
    },
  });

  const {} = useContractRead({
    address: import.meta.env.VITE_TRANSCA_BUNDLE_NFT_CONTRACT!,
    abi: abiBundle,
    functionName: "getAllBunelByOwner",
    args: [address],
    onSuccess: async (data: Array<any>) => {
      if (data.length > 0) {
        let res: Array<any> = [];
        for (let index = 0; index < data.length; index++) {
          let nfts = [];
          const uri = await readContract({
            address: import.meta.env.VITE_TRANSCA_BUNDLE_NFT_CONTRACT!,
            abi: abiAsset,
            functionName: "tokenURI",
            args: [data[index]._bundleId],
          });
          const resImg = await fetch(uri as string)
            .then((response) => response.json())
            .catch(() => {
              return null;
            });

          for (let j = 0; j < data[index]._assetIds.length; j++) {
            const nftData = await readContract({
              address: import.meta.env.VITE_TRANSCA_NFT_CONTRACT!,
              abi: abiAsset,
              functionName: "getAssetDetail",
              args: [data[index]._assetIds[j]],
            });

            let temp: any = nftData;
            const uri = await readContract({
              address: import.meta.env.VITE_TRANSCA_NFT_CONTRACT!,
              abi: abiAsset,
              functionName: "tokenURI",
              args: [data[index]._assetIds[j]],
            });
            if (uri) {
              await fetch(uri as string)
                .then(async (response) => {
                  const a = await response.json();
                  temp._image = a.image;
                })
                .catch(() => {
                  temp._image = uri;
                  return null;
                });
            }
            if (nftData) {
              nfts.push(temp);
            }
          }
          res.push({ id: data[index]._bundleId, nfts: nfts, uri: resImg ? resImg.image : "" });
        }
        setBundles(res);
      }
    },
  });

  // tokenURI

  const onShowNFTs = () => {
    let nfts = null;
    if (listNFTs.length > 0) {
      nfts = listNFTs.map((e, i) => {
        return <NFTCard key={i} nftData={e} />;
      });
    }
    return nfts;
  };

  const onShowBundleNFTs = () => {
    let temp = null;
    if (bundles.length > 0) {
      temp = bundles.map((e, i) => {
        return <BundleNFT bundle={e} key={i} />;
      });
    }
    return temp;
  };

  return (
    <>
      <Header />
      <div className="p-4 md:ml-64 mt-14 bg-gray-100 h-screen">
        <h2 className="w-fit bg-white border border-none rounded-xl px-6 py-1 my-4 flex justify-center items-center space-x-2 cursor-pointer">
          <ArrowBack size={24} />
          <div className="text-[18px] font-bold">Portfolio</div>
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
            {onShowBundleNFTs()}
            {onShowNFTs()}
          </div>
        </div>
      </div>
    </>
  );
};
export default Portfolio;
