import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { readContract } from "@wagmi/core";
import abiAsset from "../../abi/TranscaAssetNFT.json";
import abiBundle from "../../abi/TranscaBundleNFT.json";

import { RootState } from "../store";
import { Asset } from "./assetReducer";

export type Bundle = {
  id: number;
  totalOraklValue: number;
  uri: string;
  nfts: Array<Asset>;
};

export type BundleReducer = {
  bundles: Bundle[];
  loading: boolean;
};

export const getBundles = createAsyncThunk("bundle/get", async ({ address }: { address: string }, {}) => {
  try {
    const bundles = await readContract({
      address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!,
      abi: abiBundle,
      functionName: "getAllBundleByOwner",
      args: [address!],
    });
    const _bundles = bundles as Array<Bundle>;
    console.log("7s200:bundles", bundles);
    if (_bundles.length > 0) {
      let res: Array<Bundle> = [];
      for (let index = 0; index < _bundles.length; index++) {
        let nfts = [];
        const totalOraklValue = await readContract({
          address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!,
          abi: abiBundle,
          functionName: "getValue",
          args: [(_bundles[index] as any).bundleId],
        });
        const value = await readContract({
          address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
          abi: abiAsset,
          functionName: "getLatestData",
          args: [],
        });
        console.log("7s200:value", value);

        const uri = await readContract({
          address: import.meta.env.VITE_TRANSCA_BUNDLE_CONTRACT!,
          abi: abiAsset,
          functionName: "tokenURI",
          args: [(_bundles[index] as any).bundleId],
        });
        const resImg = await fetch(uri as string)
          .then((response) => response.json())
          .catch(() => {
            return null;
          });

        for (let j = 0; j < (_bundles[index] as any).assetIds.length; j++) {
          const nftData = await readContract({
            address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
            abi: abiAsset,
            functionName: "getAssetDetail",
            args: [(_bundles[index] as any).assetIds[j]],
          });

          let temp: any = nftData;
          const uri = await readContract({
            address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
            abi: abiAsset,
            functionName: "tokenURI",
            args: [(_bundles[index] as any).assetIds[j]],
          });

          if (uri) {
            await fetch(uri as string)
              .then(async (response) => {
                const a = await response.json();
                temp.image = a.image;
              })
              .catch(() => {
                temp.image = uri;
                return null;
              });
          }
          if (nftData) {
            nfts.push(temp);
          }
        }
        res.push({ id: (_bundles[index] as any).bundleId, nfts: nfts, totalOraklValue: totalOraklValue as number, uri: resImg ? resImg.image : "" });
      }
      return res;
    } else {
      return [];
    }
  } catch (error: any) {
    return [];
  }
});
export const defaultBundleReducer: BundleReducer = {
  bundles: [],
  loading: false,
};

const bundleReducer = createReducer(defaultBundleReducer, (builder) => {
  builder
    .addCase(getBundles.fulfilled, (state, action) => {
      return { ...state, loading: false, bundles: action.payload };
    })
    .addCase(getBundles.rejected, (state) => {
      return { ...state, loading: false };
    })
    .addCase(getBundles.pending, (state) => {
      return { ...state, loading: true };
    });
});

export const selectBundle = (state: RootState) => state.bundle;

export default bundleReducer;
