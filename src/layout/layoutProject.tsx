type Props = {
  children?: React.ReactNode;
  bgColor?: string;
};
const layoutProject: React.FC<Props> = ({ children, bgColor = "bg-white" }) => {
  return (
    <>
      <div
        className={` text-black ${bgColor}`}
      >
        {children}
      </div>
    </>
  );
};
export default layoutProject;
