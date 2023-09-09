import { useEffect } from "react";
import { useAccount } from "wagmi";
import { getBorrowReqs, selectIntermediation } from "../../../redux/reducers/intermediationReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import HistoryItem from "./HistoryItem";
const LendHistory: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const intermediationRx = useAppSelector(selectIntermediation);
  const { address } = useAccount();

  useEffect(() => {
    dispatch(getBorrowReqs({}));
  }, []);

  const onShowHistory = () => {
    let histories: Array<any> = [];
    if (intermediationRx.allBorrowReqs.length > 0 && !intermediationRx.loading) {
      intermediationRx.allBorrowReqs.forEach((e, i) => {
        if (e.lender === address) {
          histories.push(<HistoryItem key={i} data={e} actionType="LEND" />);
        }
      });
    }
    if (histories.length > 0) {
      return histories;
    }
    return null;
  };

  return (
    <>
      {!onShowHistory() ? (
        <div className="flex justify-center items-center min-h-[650px] font-bold">Empty</div>
      ) : (
        <div className="flex flex-col space-y-2 overflow-auto py-2 max-h-[650px] scroll-smooth">{onShowHistory()}</div>
      )}
    </>
  );
};

export default LendHistory;
