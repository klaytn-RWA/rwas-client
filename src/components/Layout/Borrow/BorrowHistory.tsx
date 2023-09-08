import { useEffect } from "react";
import { useAccount } from "wagmi";
import { getBorrowReqs, selectIntermediation } from "../../../redux/reducers/intermediationReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import HistoryItem from "./HistoryItem";

const BorrowHistory: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const intermediationRx = useAppSelector(selectIntermediation);
  const { address } = useAccount();

  useEffect(() => {
    dispatch(getBorrowReqs({}));
  }, []);

  const onShowHistory = () => {
    let histories = null;
    if (intermediationRx.allBorrowReqs.length > 0 && !intermediationRx.loading) {
      histories = intermediationRx.allBorrowReqs.map((e, i) => {
        console.log("7s200:e", e);
        if (e.creator === address) {
          return <HistoryItem key={i} data={e} />;
        }
      });
    }
    return histories;
  };

  return <div className="flex flex-col space-y-2 overflow-auto py-2 max-h-[650px] scroll-smooth">{onShowHistory()}</div>;
};

export default BorrowHistory;
