import { CheckCircleFill } from "@styled-icons/bootstrap";
import { waitForTransaction, writeContract } from "@wagmi/core";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import abiBundle from "../../abi/TranscaBundleNFT.json";
import { getAssets } from "../../redux/reducers/assetReducer";
import { getBundles } from "../../redux/reducers/bundleReducer";
import { setToast } from "../../redux/reducers/toastReducer";
import { useAppDispatch } from "../../redux/store";
import Button from "../Button/Button";
import Popup from "./Popup";
import { usePopups } from "./PopupProvider";

const PopupUnpackBundle: React.FC<{ bundles: Array<any>; loadingData: boolean }> = ({ bundles, loadingData }) => {
  const [activeBundle, setActiveBundle] = useState<Number | null>(null);
  const [unPacking, setUnpacking] = useState(false);

  const { address } = useAccount();

  const dispatch = useAppDispatch();
  const { removeAll } = usePopups();

  const onSelectBundle = (bundleId: Number) => {
    if (bundleId === activeBundle) {
      setActiveBundle(null);
    } else {
      setActiveBundle(bundleId);
    }
    return;
  };

  const onShowNFTs = (nfts: Array<any>) => {
    let temp = null;
    if (nfts.length > 0) {
      temp = nfts.map((e, i) => {
        return <img className="w-[50px] h-[50px] border border-none rounded-xl" src={e.image} />;
      });
    }
    return temp;
  };

  const onShowBundleNFTs = () => {
    let temp = null;
    if (bundles.length > 0) {
      temp = bundles.map((e, i) => {
        return (
          <tr key={i} className={`bg-[#251163] w-full border border-none rounded-xl text-gray-300 cursor-pointer`} onClick={() => onSelectBundle(e.id)}>
            <td className="px-4 py-3 text-center font-bold">#{Number(e.id)} </td>
            <td className="px-4 py-3 text-center">
              <div className="w-full flex justify-center items-center space-x-2">{onShowNFTs(e.nfts)}</div>
            </td>
            <td className="px-4 py-3 text-center">{activeBundle === e.id && <CheckCircleFill size={20} color="green" />}</td>
          </tr>
        );
      });
    }
    return temp;
  };

  const onHanleUnpacking = async () => {
    setUnpacking(true);
    if (activeBundle === null) {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Please select Bundle to UNPACK",
          type: "info",
        }),
      );
      setUnpacking(false);
      return;
    }
    const write = await writeContract({
      address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT! as any,
      abi: abiBundle,
      functionName: "withdraw",
      args: [activeBundle],
    });
    if (write.hash) {
      const waitTranscation = await waitForTransaction({ chainId: import.meta.env.VITE_CHAIN_ID!, hash: write.hash });
      if (waitTranscation.status === "success") {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Unpack bundle success!",
            type: "success",
          }),
        );
        dispatch(getAssets({ address: address! }));
        dispatch(getBundles({ address: address! }));
        setUnpacking(false);
        removeAll();
        return;
      } else {
        dispatch(
          setToast({
            show: true,
            title: "",
            message: "Transcation wrong!",
            type: "error",
          }),
        );
        return;
      }
    } else {
      dispatch(
        setToast({
          show: true,
          title: "",
          message: "Something wrong!",
          type: "error",
        }),
      );
      setUnpacking(false);
      return;
    }
  };

  return (
    <Popup className="bg-gray-50 min-w-[1000px]">
      <h1 className="mb-4 text-center font-bold text-[20px]">Unpack Bundle</h1>
      <div className="relative overflow-x-auto mx-auto border border-none rounded-xl mt-4">
        <table className="w-full text-sm !text-white">
          <thead className="text-xs !text-white uppercase bg-btnprimary">
            <tr>
              <th scope="col" className="w-1/6 px-6 py-3 text-center">
                BundleId
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                NFT
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-center">
                Selected
              </th>
            </tr>
          </thead>
          <tbody>{onShowBundleNFTs()}</tbody>
        </table>
      </div>
      <div className="relative mx-auto border border-none rounded-xl mt-4 flex space-x-4 justify-center items-center">
        <Button
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 !rounded-3xl font-bold text-white min-w-[200px] leading-[21px]"
          loading={unPacking}
          onClick={onHanleUnpacking}
        >
          Unpack Bundle
        </Button>
        <Button className="!rounded-3xl text-black font-bold text-white min-w-[200px] leading-[21px]" type="reset" onClick={() => removeAll()}>
          Cancel
        </Button>
      </div>
    </Popup>
  );
};

export default PopupUnpackBundle;
