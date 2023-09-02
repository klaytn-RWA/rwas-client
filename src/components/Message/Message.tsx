const Message: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  return (
    <div className="w-fit bg-blue-100 border border-blue-500 rounded-2xl text-blue-700 px-4 py-3" role="alert">
      <p className="font-bold">{title}</p>
      <p className="text-sm">{content}</p>
    </div>
  );
};
export default Message;
