import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { getAssets, selectAsset } from "../../../redux/reducers/assetReducer";
import { getBundles, selectBundle } from "../../../redux/reducers/bundleReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Button from "../../Button/Button";
import Message from "../../Message/Message";
import PopupCreateBundle from "../../Popup/PopupCreateBundle";
import { usePopups } from "../../Popup/PopupProvider";
import PopupUnpackBundle from "../../Popup/PopupUnpackBundle";

const BundleService: React.FC = () => {
  const { addPopup } = usePopups();
  const { address, isConnected } = useAccount();

  const onOpenPopUpCreateBundle = () => {
    addPopup({
      Component: () => {
        const dispatch = useAppDispatch();
        const assetRx = useAppSelector(selectAsset);
        useEffect(() => {
          dispatch(getAssets({ address: address! }));
        }, [dispatch]);

        return <PopupCreateBundle nfts={assetRx.assets} loadingData={assetRx.loading} />;
      },
    });
  };

  const onOpenPopUpUnpackBundle = () => {
    addPopup({
      Component: () => {
        const dispatch = useAppDispatch();
        const bundleRx = useAppSelector(selectBundle);
        useEffect(() => {
          dispatch(getBundles({ address: address! }));
        }, [dispatch]);
        return <PopupUnpackBundle bundles={bundleRx.bundles} loadingData={bundleRx.loading} />;
      },
    });
  };

  return (
    <div className="bg-white flex-1 border border-none rounded-xl shadow-xl">
      <h3 className="text-center my-4 font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Create NFT Bundle</h3>
      <div className="w-full mx-auto">
        <img src="/icons/bundleNFT.webp" className="mx-auto max-w-[400px] max-h-[400px]" alt="" />
      </div>
      <div className="mx-4 my-4">
        <Message
          className={"space-x-2"}
          title={"Bundle"}
          content={
            "This is a solution that allows users to combine multiple RWAs NFTs into a single package - a unique RWAs NFT which has an overall value equal to the sum of the individual RWA NFT's values. The purpose of this is to create a NFTs package and minimize the number of transactions that users need to make when using RWA NFTs in financial platforms. Furthermore, users can take the advantage of adjusting the number of NFTs used to generate the package and putting it into an RWA NFT Bundle."
          }
        />
      </div>
      {address && isConnected && (
        <div className="flex space-x-4 justify-center items-center my-4">
          <Button
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
            onClick={() => onOpenPopUpCreateBundle()}
          >
            Create Bundle
          </Button>
          <Button
            className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
            onClick={() => onOpenPopUpUnpackBundle()}
          >
            Unpack Bundle
          </Button>
        </div>
      )}
      {!isConnected && (
        <div className="flex space-x-4 justify-center items-center my-4">
          <ConnectButton />
        </div>
      )}
    </div>
  );
};
export default BundleService;
