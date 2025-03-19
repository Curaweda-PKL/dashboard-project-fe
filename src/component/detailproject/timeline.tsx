import React, { useState, useEffect } from "react";
import HeaderDetail from "./headerdetail";
import { useLocation, useParams } from "react-router-dom";
import projectTimelineAPI, { ProjectTimeline, TimelineDetail } from "../api/timelineApi";
import projectApi from "../api/projectApi";
// import teamApi from "../api/TeamApi";

/*** 1. Interface data ***/
// Ditambahkan properti id agar sinkron dengan data API (jika tersedia)
interface Module {
  id?: number; // ID timeline detail untuk update status
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
  const FIXED_LEFT_WIDTH = 850;
  const MONTH_WIDTH = 120;
  const WEEKS_PER_MONTH = 4;
  const WEEK_WIDTH = MONTH_WIDTH / WEEKS_PER_MONTH;
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

// Helper untuk mengonversi data dari backend ke format module
const mapBackendDataToModules = (backendData: ProjectTimeline): Module[] => {
  if (!backendData || !backendData.details || !Array.isArray(backendData.details)) {
    return [];
  }
  
  return backendData.details.map((item: TimelineDetail) => {
    const statusColor = 
      item.status === "DONE" ? "bg-[#1C148B]" : 
      item.status === "ON PROGRESS" ? "bg-[#ECA6A6]" : 
      "bg-[#B20000]";
    
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateString}`);
        return "";
      }
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };
    
    const calculateDuration = (startDate: string, endDate: string) => {
      if (!startDate || !endDate) return "0 DAY";
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error(`Invalid date range: ${startDate} - ${endDate}`);
        return "0 DAY";
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} DAY`;
    };
    
    const formatTimelineString = (startDate: string, endDate: string) => {
      if (!startDate || !endDate) return "";
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error(`Invalid date range for timeline: ${startDate} - ${endDate}`);
        return "";
      }
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
    };
    
    const startDateStr = formatDate(item.startDate);
    const endDateStr = formatDate(item.endDate);
    
    return {
      id: item.id, // mapping id untuk keperluan update
      name: item.module,
      startDate: startDateStr,
      endDate: endDateStr,
      status: item.status,
      timeline: formatTimelineString(item.startDate, item.endDate),
      color: statusColor,
      duration: calculateDuration(item.startDate, item.endDate)
    };
  });
};

/*** 3. Komponen utama Timeline ***/
const Timeline: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const routeState = (location.state as {
    projectName?: string;
    pic?: string;
    date?: string;
    client?: string;
  }) || {};

  const [projectData, setProjectData] = useState({
    projectName: "Default Project Name",
    pic: "Default PM",
    date: "Default Date",
    client: "Default Client",
  });

  const [timelineData, setTimelineData] = useState<ProjectTimeline | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
        // Fetch project data first to get pic_id
        const projectDetails = await projectApi.getProjectById(parseInt(projectId));
        console.log("Project details:", projectDetails);
        
        // Fetch team members
        // const teams = await teamApi.getAllTeams();
        // console.log("Team members:", teams);
        
        // Find the team member that matches the pic_id
        // const picMember = teams.find(member => member.id === projectDetails.pic_id);
        // const picName = picMember ? picMember.name : "Unknown";
        
        // Format the date untuk display
        const formattedDate = `${new Date(projectDetails.start_date).toLocaleDateString()} - ${new Date(projectDetails.end_date).toLocaleDateString()}`;
        
        // Set project data dengan nilai dari API
        setProjectData({
          projectName: projectDetails.title || "Default Project Name",
          pic: "",
          date: formattedDate,
          client: projectDetails.client || "Default Client",
        });
        
        // Memanggil getAllTimelines dengan projectId
        const timelineDataArray = await projectTimelineAPI.getAllTimelines(parseInt(projectId));
        console.log("Timeline data received:", timelineDataArray);
        if (timelineDataArray && timelineDataArray.length > 0) {
          const data = timelineDataArray[0];
          setTimelineData(data);
          console.log("Raw timeline data:", data);
          console.log("Timeline details:", data.details);
          const mappedModules = mapBackendDataToModules(data);
          console.log("Mapped modules:", mappedModules);
          setModules(mappedModules);
        } else {
          setTimelineData(null);
          setModules([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal mengambil data. Silakan coba lagi nanti.");
        setLoading(false);
      }
    };
    
    fetchTimelineData();
  }, [projectId]);

  useEffect(() => {
    if (routeState && routeState.projectName) {
      setProjectData(prev => ({
        ...prev,
        projectName: routeState.projectName || prev.projectName,
        client: routeState.client || prev.client,
        // Jangan override pic dan date jika sudah ada dari API
      }));
    }
  }, [routeState]);

  // Fungsi untuk update status modul menggunakan endpoint PATCH pada timeline detail
  const handleStatusChange = async (index: number, newStatus: string) => {
    try {
      if (!timelineData || !timelineData.project_id) {
        setError("Data timeline tidak tersedia");
        return;
      }
      const moduleDetail = modules[index];
      if (!moduleDetail.id) {
        setError("ID timeline detail tidak tersedia");
        return;
      }
      setOpenDropdownIndex(null);
      // Update status detail
      await projectTimelineAPI.updateTimelineDetailStatus(
        timelineData.project_id,
        moduleDetail.id,
        newStatus
      );
      // Setelah update, panggil ulang API untuk mendapatkan data timeline lengkap
      const refreshedTimelineArray = await projectTimelineAPI.getAllTimelines(timelineData.project_id);
      if (refreshedTimelineArray && refreshedTimelineArray.length > 0) {
        const refreshedTimeline = refreshedTimelineArray[0];
        setTimelineData(refreshedTimeline);
        const mappedModules = mapBackendDataToModules(refreshedTimeline);
        setModules(mappedModules);
      }
    } catch (err) {
      console.error("Error updating module status:", err);
      setError("Gagal memperbarui status. Silakan coba lagi nanti.");
    }
  };
  

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
              <th key={mIndex} className="p-4 text-white min-w-[120px] border-l border-black relative">
                <div className="flex flex-col items-center">
                  <span>{month}</span>
                  <div className="grid grid-cols-4 w-full h-full relative">
                    {weeks.map((weekNum, index) => (
                      <div key={index} className={`flex justify-center relative top-[8px] ${
                        index === 0 ? "left-[-11px]" : 
                        index === 1 ? "left-[-3px]" : 
                        index === 2 ? "left-[5px]" : "left-[12px]"
                      }`}>
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
          {modules.length > 0 ? (
            modules.map((module, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100 transition duration-200" style={{ height: "48px" }}>
                <td className="p-4 border border-black min-w-[200px]">{module.name}</td>
                <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">{module.startDate}</td>
                <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">{module.endDate}</td>
                <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">{module.duration}</td>
                <td className="p-4 border border-black relative text-center min-w-[200px]">
                  <div className="relative">
                    <button
                      className={`rounded-full px-4 py-2 text-white font-bold ${module.color} flex items-center justify-between w-full`}
                      onClick={() =>
                        setOpenDropdownIndex(openDropdownIndex === rowIndex ? null : rowIndex)
                      }
                    >
                      {module.status}
                      <span className="ml-2">&#9662;</span>
                    </button>
                    {openDropdownIndex === rowIndex && (
                      <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-56 p-4 z-10 border border-gray-300">
                        <p className="text-center font-bold mb-4">Edit Status</p>
                        <div className="flex flex-col space-y-2">
                          <button className="py-2 px-4 text-white font-bold bg-[#1C148B] rounded-full hover:bg-opacity-90"
                                  onClick={() => handleStatusChange(rowIndex, "DONE")}>
                            DONE
                          </button>
                          <button className="py-2 px-4 text-white font-bold bg-[#ECA6A6] rounded-full hover:bg-opacity-90"
                                  onClick={() => handleStatusChange(rowIndex, "ON PROGRESS")}>
                            ON PROGRESS
                          </button>
                          <button className="py-2 px-4 text-white font-bold bg-[#B20000] rounded-full hover:bg-opacity-90"
                                  onClick={() => handleStatusChange(rowIndex, "PENDING")}>
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
            ))
          ) : (
            <tr className="hover:bg-gray-100 transition duration-200" style={{ height: "48px" }}>
              <td colSpan={5} className="p-4 border border-black text-center font-bold text-gray-600">
                Tidak ada data timeline tersedia untuk project ini
              </td>
              {months.map((_, monthIndex) => (
                <td key={monthIndex} className="p-0 border border-black relative">
                  <div className="absolute top-[-30px] left-1/4 w-[1px] bg-black h-[calc(100%+30px)]"></div>
                  <div className="absolute top-[-30px] left-2/4 w-[1px] bg-black h-[calc(100%+30px)]"></div>
                  <div className="absolute top-[-30px] left-3/4 w-[1px] bg-black h-[calc(100%+30px)]"></div>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderTimelineOverlay = () => {
    const HEADER_HEIGHT = 120;
    const ROW_HEIGHT = 48;
    const PILL_HEIGHT = 24;
    const PILL_LEFT_OFFSET = 10;
    const PILL_RIGHT_OFFSET = 10;
    return (
      <>
        {modules.map((module, rowIndex) => {
          const { left, width } = computeTimelinePosition(module.startDate, module.endDate);
          const moduleIndex = rowIndex % 3;
          const verticalOffset = moduleIndex * 25 - 25;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2">Memuat data timeline...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  return (
    <div>
      <HeaderDetail />
      <div className="mb-6 text-black font-bold">
        <p>
          <strong>Project :</strong> {projectData.projectName}
        </p>
        <p>
          <strong>PIC :</strong> {projectData.pic}
        </p>
        <p>
          <strong>Date :</strong> {projectData.date}
        </p>
        <p>
          <strong>Client :</strong> {projectData.client}
        </p>
      </div>
      <div className="overflow-x-auto relative">
        {renderCombinedTable()}
        {modules.length > 0 && renderTimelineOverlay()}
      </div>
    </div>
  );
};

export default Timeline;
