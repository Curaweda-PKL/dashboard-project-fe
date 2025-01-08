
import React from 'react';

interface HeaderDetailProps {
  onClick: (page: string) => void;
}

const HeaderDetail: React.FC<HeaderDetailProps> = ({ onClick }) => {
  return (
    <div className="flex gap-4 mb-14">
      <button
        className="py-2 px-5 bg-[#02CCFF] text-black font-bold rounded-full shadow-md"
        onClick={() => onClick('Task')}
      >
        Task
      </button>
      <button
        className="py-2 px-5 bg-gray-200 text-black font-bold rounded-full"
        onClick={() => onClick('Timeline')}
      >
        Timeline
      </button>
      <button
        className="py-2 px-5 bg-gray-200 text-black font-bold rounded-full"
        onClick={() => onClick('Summary')}
      >
        Summary
      </button>
    </div>
  );
};

export default HeaderDetail;
