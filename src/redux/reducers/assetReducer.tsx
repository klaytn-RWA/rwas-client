import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { readContract } from "@wagmi/core";
import abiAsset from "../../abi/TranscaAssetNFT.json";
import { RootState } from "../store";

export type Asset = {
  appraisalPrice: number;
  assetId: number;
  assetType: number;
  expireTime: number;
  image: string;
  indentifierCode: "string";
  oraklPrice: number;
  owner: string;
  startTime: number;
  userDefinePrice: number;
  weight: number;
};

export const getAssets = createAsyncThunk("asset/get", async ({ address }: { address: string }, { getState, dispatch }) => {
  try {
    if (address.length === 0 || !address) {
      return [];
    }
    const listAsset = await readContract({
      address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
      abi: abiAsset,
      functionName: "getAllAssetByUser",
      args: [address],
    });
    if (!listAsset || (listAsset as Array<Asset>).length === 0) {
      return [];
    }
    const list = listAsset as Array<Asset>;

    for (let index = 0; index < list.length; index++) {
      const uri = await readContract({
        address: import.meta.env.VITE_TRANSCA_ASSET_CONTRACT!,
        abi: abiAsset,
        functionName: "tokenURI",
        args: [list[index].assetId],
      });
      if (uri) {
        const response = await fetch(uri as string)
          .then((response) => response.json())
          .catch(() => {
            return null;
          });
        if (response) {
          list[index].image = response.image;
        } else {
          list[index].image = uri as any;
        }
      }
    }

    return list;
  } catch (error: any) {
    return [];
  }
});

export type AssetReducer = {
  assets: Asset[];
  loading: boolean;
};

export const defaultAssetReducer: AssetReducer = {
  assets: [],
  loading: false,
};

const assetReducer = createReducer(defaultAssetReducer, (builder) => {
  builder
    .addCase(getAssets.fulfilled, (state, action) => {
      return { ...state, loading: false, assets: action.payload };
    })
    .addCase(getAssets.rejected, (state) => {
      return { ...state, loading: false };
    })
    .addCase(getAssets.pending, (state) => {
      return { ...state, loading: true };
    });
});

export const selectAsset = (state: RootState) => state.asset;

export default assetReducer;
