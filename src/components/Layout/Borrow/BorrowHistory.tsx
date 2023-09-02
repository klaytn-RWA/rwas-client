import HistoryItem from "./HistoryItem";

const BorrowHistory: React.FC<{}> = () => {
  return (
    <div className="flex flex-col space-y-2 overflow-auto py-2 max-h-[650px] scroll-smooth">
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
    </div>
  );
};
export default BorrowHistory;
