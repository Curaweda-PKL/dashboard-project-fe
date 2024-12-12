type Props = {
  children?: React.ReactNode;
  bgColor?: string;
};
const layoutProject: React.FC<Props> = ({ children, bgColor = "bg-white" }) => {
  return (
    <>
      <div
        className={`justify-between w-full overflow-x-auto rounded-lg  text-slate-800 ${bgColor}`}
      >
        {children}
      </div>
    </>
  );
};
export default layoutProject;
