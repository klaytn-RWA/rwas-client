const Message: React.FC<{ className: string; title: string; content: string }> = ({ title, content, className }) => {
  return (
    <div className={`${className} flex justify-center items-center w-fit border rounded-2xl text-blue-700 px-4 py-3 space-x-1`} role="alert">
      <p className="font-bold">{title}:</p> <p className="text-sm">{content}</p>
    </div>
  );
};
export default Message;
