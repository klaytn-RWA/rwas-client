const NFTProperty: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  return (
    <div>
      <div className="bg-gray-100 border border-none rounded-md text-center">
        <div className="text-[13px] font-bold">{title}</div>
        <div className="text-[13px]">{content}</div>
      </div>
    </div>
  );
};

export default NFTProperty;
