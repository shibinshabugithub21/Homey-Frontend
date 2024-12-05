import React, { useState, useEffect } from "react";
import { Home, UserCircle, Briefcase, Clock, Settings } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import axios from "axios"; // Ensure axios is installed

const menuConfig = {
  Home: {
    icon: Home,
    description: "Overview of your work activities and key metrics",
  },
  Profile: {
    icon: UserCircle,
    description: "Manage your personal and professional information",
  },
  Tasks: {
    icon: Briefcase,
    description: "View and manage your assigned tasks and projects",
  },
  TimeTracking: {
    icon: Clock,
    description: "Log and review your work hours and productivity",
  },
  Settings: {
    icon: Settings,
    description: "Configure your dashboard preferences and account settings",
  },
};

const HomeContent = ({ activeMenu = "Home", userData = null, onMenuChange }) => {
  const [currentStats, setCurrentStats] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [workerName, setWorkerName] = useState("");

  const taskData = [
    { name: "Completed", value: 75, color: "#10B981" },
    { name: "Pending", value: 15, color: "#FBBF24" },
    { name: "Overdue", value: 10, color: "#EF4444" },
  ];

  const projectData = [
    { month: "Jan", projects: 5 },
    { month: "Feb", projects: 8 },
    { month: "Mar", projects: 6 },
    { month: "Apr", projects: 10 },
    { month: "May", projects: 7 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch worker details based on the workerId from localStorage
        const workerId = localStorage.getItem("workerId");
        if (workerId) {
          const workerResponse = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/getWorker/${workerId}`);
          setWorkerName(workerResponse.data.name);

          const bookingResponse = await axios.get(`/api/bookings/count/${workerId}`);
          setBookingCount(bookingResponse.data.bookingCount);
        } else {
          console.error("Worker ID not found in localStorage");
        }

        // Mocked data for the active menu
        const mockData = {
          Home: {
            tasksCompleted: 12,
            pendingTasks: 3,
            totalHoursWorked: 42,
          },
          Tasks: {
            activeProjects: 2,
            completedProjects: 5,
          },
        };

        setCurrentStats(mockData[activeMenu] || null);
      } catch (error) {
        console.error("Dashboard data fetch error", error);
      }
    };

    fetchDashboardData();
  }, [activeMenu]);

  const MenuIcon = menuConfig[activeMenu]?.icon || Home;

  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="flex items-center mb-6">
        <MenuIcon className="mr-4 text-blue-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-800">{activeMenu} Dashboard</h1>
      </div>

      {/* Display the user's name dynamically */}
      <div className="text-lg font-medium text-gray-800 mb-4">Hello, {workerName || "Loading..."}</div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600 mb-4">{menuConfig[activeMenu]?.description}</p>

        {currentStats && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(currentStats).map(([key, value]) => (
              <div key={key} className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-blue-800 capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </h3>
                <p className="text-2xl font-bold text-blue-600">{value}</p>
              </div>
            ))}

            {/* Display the total number of bookings */}
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold text-blue-800">Total Bookings</h3>
              <p className="text-2xl font-bold text-blue-600">{bookingCount}</p>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <div className="w-1/2">
            <h2 className="text-xl font-semibold mb-4">Task Distribution</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={taskData}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {taskData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-semibold mb-4">Monthly Projects</h2>
            <BarChart width={400} height={300} data={projectData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projects" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomeContent;
