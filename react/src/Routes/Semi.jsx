import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

//기업 상세 페이지
const Semi = () => {
  return (
    <div className="w-[92%] ml-[4%] flex min-h-screen bg-[#FBF7F4]">
      <Sidebar />
      <main className="flex-1 bg-[#FBF7F4] min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Semi;
