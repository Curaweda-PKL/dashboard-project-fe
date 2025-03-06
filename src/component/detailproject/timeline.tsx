import React, { useState, useEffect } from "react";
import HeaderDetail from "./headerdetail"; // Pastikan file ini tersedia
import { getProjectTimelines, updateProjectTimeline } from "../api/timelineApi"; // Sesuaikan path

/*** 1. Interface data ***/
// Ditambahkan properti id agar sinkron dengan data API (jika tersedia)
interface Module {
  id?: number;
  name: string;
  startDate: string; // format "DD/MM/YYYY"
  endDate: string;   // format "DD/MM/YYYY"
  status: string;
  timeline: string;
  color: string;
  duration: string;
}

/*** 2. Fungsi bantu untuk menghitung posisi horizontal (left) & lebar (width) pill ***/
function computeTimelinePosition(startDate: string, endDate: string) {
  const FIXED_LEFT_WIDTH = 850; // Total lebar kolom sebelum kolom bulan
  const MONTH_WIDTH = 120;
  const WEEKS_PER_MONTH = 4;
  const WEEK_WIDTH = MONTH_WIDTH / WEEKS_PER_MONTH; // 30px per minggu

  const [sDay, sMonth] = startDate.split("/").map(Number);
  const [eDay, eMonth] = endDate.split("/").map(Number);

  const startMonthIndex = sMonth - 1;
  const endMonthIndex = eMonth - 1;
  const startWeekIndex = Math.floor((sDay - 1) / 7);
  const endWeekIndex = Math.floor((eDay - 1) / 7);

  const left =
    FIXED_LEFT_WIDTH +
    startMonthIndex * MONTH_WIDTH +
    startWeekIndex * WEEK_WIDTH;

  const totalWeeks =
    (endMonthIndex - startMonthIndex) * WEEKS_PER_MONTH +
    (endWeekIndex - startWeekIndex + 1);
  const width = totalWeeks * WEEK_WIDTH;
  return { left, width };
}

/*** 3. Komponen utama Timeline ***/
const Timeline: React.FC = () => {
  // State modules diinisialisasi sebagai array kosong. Data akan diambil dari API.
  const [modules, setModules] = useState<Module[]>([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // Mengambil data timeline dari API saat komponen pertama kali dirender.
  useEffect(() => {
    async function fetchTimelines() {
      try {
        // Contoh: Mengambil timeline dengan parameter search "1", offset 0, limit 10.
        const data: Module[] = await getProjectTimelines("1", 0, 10);
        // Asumsikan response API sudah sesuai dengan struktur Module
        setModules(data);
      } catch (error) {
        console.error("Gagal mengambil data timeline:", error);
      }
    }
    fetchTimelines();
  }, []);

  // Fungsi handleStatusChange mengupdate status dan properti color, serta mengirim update ke backend.
  const handleStatusChange = async (index: number, newStatus: string) => {
    const updatedModules = [...modules];
    updatedModules[index].status = newStatus;
    if (newStatus === "DONE") updatedModules[index].color = "bg-[#1C148B]";
    else if (newStatus === "ON PROGRESS") updatedModules[index].color = "bg-[#ECA6A6]";
    else if (newStatus === "PENDING") updatedModules[index].color = "bg-[#B20000]";
    setModules(updatedModules);
    setOpenDropdownIndex(null);

    // Jika module memiliki id, kirim update ke backend.
    if (updatedModules[index].id !== undefined) {
      try {
        const module = updatedModules[index];
        const moduleId: number = module.id!; // Pastikan id sudah pasti (non-null)
        // Data update disesuaikan dengan API. Di sini diasumsikan setiap module merupakan detail timeline.
        const updateData = {
          project_id: 1, // Sesuaikan atau ambil dari data module jika ada
          details: [
            {
              module: module.name,
              start_date: module.startDate,
              end_date: module.endDate,
              status: module.status,
            },
          ],
        };
        const res = await updateProjectTimeline(moduleId, updateData);
        console.log("Update timeline di backend:", res);
      } catch (error) {
        console.error("Gagal memperbarui timeline di backend:", error);
      }
    }
  };

  /*** 4. Render tabel ***/
  const renderCombinedTable = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const weeks = [1, 2, 3, 4];

    return (
      <table className="min-w-max text-center border-collapse rounded-lg mb-8">
        <thead className="sticky top-0 bg-[#02CCFF]">
          <tr>
            <th className="p-4 text-white min-w-[200px]">MODULE</th>
            <th className="p-4 text-white min-w-[150px]">START DATE</th>
            <th className="p-4 text-white min-w-[150px]">END DATE</th>
            <th className="p-4 text-white min-w-[150px]">DURATION</th>
            <th className="p-4 text-white min-w-[200px]">STATUS</th>
            {months.map((month, mIndex) => (
              <th
                key={mIndex}
                className="p-4 text-white min-w-[120px] border-l border-black relative"
              >
                <div className="flex flex-col items-center">
                  <span>{month}</span>
                  <div className="grid grid-cols-4 w-full h-full relative">
                    {weeks.map((weekNum, index) => (
                      <div
                        key={index}
                        className={`flex justify-center relative top-[8px] ${
                          index === 0
                            ? "left-[-11px]"
                            : index === 1
                            ? "left-[-3px]"
                            : index === 2
                            ? "left-[5px]"
                            : "left-[12px]"
                        }`}
                      >
                        {weekNum}
                      </div>
                    ))}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-black font-bold">
          {modules.map((module, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-100 transition duration-200"
              style={{ height: "48px" }}
            >
              <td className="p-4 border border-black min-w-[200px]">{module.name}</td>
              <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">
                {module.startDate}
              </td>
              <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">
                {module.endDate}
              </td>
              <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">
                {module.duration}
              </td>
              <td className="p-4 border border-black relative text-center min-w-[200px]">
                <div className="relative">
                  <button
                    className={`rounded-full px-4 py-2 text-white font-bold ${module.color} flex items-center justify-between w-full`}
                    onClick={() =>
                      setOpenDropdownIndex(
                        openDropdownIndex === rowIndex ? null : rowIndex
                      )
                    }
                  >
                    {module.status}
                    <span className="ml-2">&#9662;</span>
                  </button>
                  {openDropdownIndex === rowIndex && (
                    <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-56 p-4 z-10 border border-gray-300">
                      <p className="text-center font-bold mb-4">Edit Status</p>
                      <div className="flex flex-col space-y-2">
                        <button
                          className="py-2 px-4 text-white font-bold bg-[#1C148B] rounded-full hover:bg-opacity-90"
                          onClick={() => handleStatusChange(rowIndex, "DONE")}
                        >
                          DONE
                        </button>
                        <button
                          className="py-2 px-4 text-white font-bold bg-[#ECA6A6] rounded-full hover:bg-opacity-90"
                          onClick={() => handleStatusChange(rowIndex, "ON PROGRESS")}
                        >
                          ON PROGRESS
                        </button>
                        <button
                          className="py-2 px-4 text-white font-bold bg-[#B20000] rounded-full hover:bg-opacity-90"
                          onClick={() => handleStatusChange(rowIndex, "PENDING")}
                        >
                          PENDING
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              {months.map((_, monthIndex) => (
                <td key={monthIndex} className="p-0 border border-black relative">
                  <div className="absolute top-[-30px] left-1/4 w-[1px] bg-black h-[calc(100%+30px)]"></div>
                  <div className="absolute top-[-30px] left-2/4 w-[1px] bg-black h-[calc(100%+30px)]"></div>
                  <div className="absolute top-[-30px] left-3/4 w-[1px] bg-black h-[calc(100%+30px)]"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  /*** 5. Render overlay pill timeline ***/
  const renderTimelineOverlay = () => {
    const HEADER_HEIGHT = 120;
    const ROW_HEIGHT = 48;
    const PILL_HEIGHT = 24;

    // Offset horizontal
    const PILL_LEFT_OFFSET = 10;
    const PILL_RIGHT_OFFSET = 10;

    // Offset vertical default
    const PILL_VERTICAL_OFFSET = 0;

    return (
      <>
        {modules.map((module, rowIndex) => {
          const { left, width } = computeTimelinePosition(
            module.startDate,
            module.endDate
          );

          // Ubah offset vertical khusus berdasarkan timeline (sesuaikan bila perlu)
          let verticalOffset = PILL_VERTICAL_OFFSET;
          if (module.timeline === "5 Jan - 1 Mar") {
            verticalOffset = -25;
          } else if (module.timeline === "25 Feb - 20 Jul") {
            verticalOffset = 20;
          } else if (module.timeline === "21 Mei - 25 Jun") {
            verticalOffset = 45;
          } else if (module.timeline === "14 Mar - 2 May") {
            verticalOffset = 100;
          } else if (module.timeline === "1 Jul - 15 Jul") {
            verticalOffset = 125;
          } else if (module.timeline === "16 Jun - 20 Jul") {
            verticalOffset = 70;
          }

          const top =
            HEADER_HEIGHT +
            rowIndex * ROW_HEIGHT +
            (ROW_HEIGHT - PILL_HEIGHT) / 2 +
            verticalOffset;

          const finalLeft = left + PILL_LEFT_OFFSET;
          const finalWidth = Math.max(0, width - PILL_RIGHT_OFFSET);

          return (
            <div
              key={rowIndex}
              className={`absolute ${module.color} text-white rounded-full text-xs font-bold flex items-center justify-center`}
              style={{
                left: `${finalLeft}px`,
                top: `${top}px`,
                width: `${finalWidth}px`,
                height: `${PILL_HEIGHT}px`,
                whiteSpace: "nowrap",
              }}
            >
              {module.timeline}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <HeaderDetail />
      <div className="mb-6 text-black font-bold">
        <p>
          <strong>Project :</strong> TourO Web Development
        </p>
        <p>
          <strong>PM :</strong> Gustavo Bergson
        </p>
        <p>
          <strong>Date :</strong> 12/12/2024
        </p>
        <p>
          <strong>Client :</strong> Mr.Lorem
        </p>
      </div>

      {/* Container dengan overflow-x-auto dan relative agar overlay dan tabel scroll bersama */}
      <div className="overflow-x-auto relative">
        {renderCombinedTable()}
        {renderTimelineOverlay()}
      </div>
    </div>
  );
};

export default Timeline;
