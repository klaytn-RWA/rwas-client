import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";

import { readContract } from "@wagmi/core";
import abi from "../../abi/TranscaIntermediation.json";
import { RootState } from "../store";

export type Intermediation = {
  amount: number;
  borrowReqId: number;
  borrowedAt: number;
  cancelled: boolean;
  createdAt: number;
  creator: string;
  duration: number;
  lendOfferReqId: number;
  lender: string;
  lenderWithdrawed: boolean;
  lenderWithdrawedAt: number;
  minAmount: number;
  nftAddress: string;
  nftId: number;
  returned: boolean;
  returnedAt: number;
  withdrawed: boolean;
  withdrawedAt: number;
};

export type IntermediationReducer = {
  allBorrowReqs: Intermediation[];
  allBorrowWithAcepted: Intermediation[];
  allDoneBorrow: Intermediation[];
  loading: boolean;
};

export const getBorrowReqs = createAsyncThunk("borrow/get", async ({}: {}, {}) => {
  try {
    const borrowReqs = await readContract({
      address: import.meta.env.VITE_TRANSCA_INTERMEDIATION_CONTRACT!,
      abi: abi,
      functionName: "getAllBorrows",
      args: [],
    });
    const _borrowReqs = borrowReqs as Array<Intermediation>;
    if (_borrowReqs.length > 0) {
      return _borrowReqs;
    }
    return [];
  } catch (error: any) {
    return [];
  }
});

export const defaultIntermediationReducer: IntermediationReducer = {
  allBorrowReqs: [],
  allBorrowWithAcepted: [],
  allDoneBorrow: [],
  loading: false,
};

const intermediationReducer = createReducer(defaultIntermediationReducer, (builder) => {
  builder
    .addCase(getBorrowReqs.fulfilled, (state, action) => {
      return { ...state, loading: false, allBorrowReqs: action.payload };
    })
    .addCase(getBorrowReqs.rejected, (state) => {
      return { ...state, loading: false };
    })
    .addCase(getBorrowReqs.pending, (state) => {
      return { ...state, loading: true };
    });
});

export const selectIntermediation = (state: RootState) => state.intermediation;

export default intermediationReducer;
