import { useMemo } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudents, getAttendance } from "@/lib/mock-data";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const students = getStudents();
  const attendance = getAttendance();
  const today = new Date().toISOString().split("T")[0];

  const todayRecords = useMemo(() => attendance.filter((a) => a.date === today), [attendance, today]);
  const presentToday = todayRecords.filter((a) => a.status === "present").length;
  const absentToday = todayRecords.filter((a) => a.status === "absent").length;

  const stats = [
    { label: "Total Students", value: students.length, icon: Users, color: "from-[hsl(250,80%,62%)] to-[hsl(200,80%,55%)]" },
    { label: "Present Today", value: presentToday, icon: UserCheck, color: "from-[hsl(150,60%,45%)] to-[hsl(170,60%,45%)]" },
    { label: "Absent Today", value: absentToday, icon: UserX, color: "from-[hsl(0,72%,55%)] to-[hsl(20,80%,55%)]" },
    { label: "Attendance %", value: todayRecords.length ? `${Math.round((presentToday / todayRecords.length) * 100)}%` : "N/A", icon: TrendingUp, color: "from-[hsl(280,70%,55%)] to-[hsl(250,80%,62%)]" },
  ];

  // Weekly data
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  }, []);

  const weeklyData = useMemo(() => {
    return last7Days.map((date) => {
      const dayRecords = attendance.filter((a) => a.date === date);
      return {
        date,
        present: dayRecords.filter((a) => a.status === "present").length,
        absent: dayRecords.filter((a) => a.status === "absent").length,
      };
    });
  }, [attendance, last7Days]);

  const barData = {
    labels: weeklyData.map((d) => new Date(d.date).toLocaleDateString("en", { weekday: "short" })),
    datasets: [
      {
        label: "Present",
        data: weeklyData.map((d) => d.present),
        backgroundColor: "hsla(150, 60%, 45%, 0.8)",
        borderRadius: 6,
      },
      {
        label: "Absent",
        data: weeklyData.map((d) => d.absent),
        backgroundColor: "hsla(0, 72%, 55%, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Present", "Absent", "Unmarked"],
    datasets: [{
      data: [presentToday, absentToday, Math.max(0, students.length - presentToday - absentToday)],
      backgroundColor: ["hsla(150,60%,45%,0.8)", "hsla(0,72%,55%,0.8)", "hsla(220,15%,55%,0.3)"],
      borderWidth: 0,
    }],
  };

  const lineData = {
    labels: weeklyData.map((d) => new Date(d.date).toLocaleDateString("en", { weekday: "short" })),
    datasets: [{
      label: "Attendance Rate %",
      data: weeklyData.map((d) => (d.present + d.absent > 0 ? Math.round((d.present / (d.present + d.absent)) * 100) : 0)),
      borderColor: "hsl(250, 80%, 62%)",
      backgroundColor: "hsla(250, 80%, 62%, 0.1)",
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "hsl(250, 80%, 62%)",
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "hsl(220, 15%, 55%)", font: { family: "Poppins" } } } },
    scales: {
      x: { ticks: { color: "hsl(220, 15%, 55%)" }, grid: { color: "hsla(220, 15%, 55%, 0.1)" } },
      y: { ticks: { color: "hsl(220, 15%, 55%)" }, grid: { color: "hsla(220, 15%, 55%, 0.1)" } },
    },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, <span className="gradient-text">Teacher</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your attendance overview for today.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} variants={item}>
            <Card className="glass-card border-0 overflow-hidden group hover:scale-[1.02] transition-transform">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    <p className="text-3xl font-bold mt-1 text-foreground">{s.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                    <s.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Weekly Attendance</CardTitle></CardHeader>
            <CardContent><div className="h-64"><Bar data={barData} options={chartOptions} /></div></CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass-card border-0">
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Today's Overview</CardTitle></CardHeader>
            <CardContent><div className="h-64 flex items-center justify-center"><Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "hsl(220, 15%, 55%)", font: { family: "Poppins" } } } } }} /></div></CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card className="glass-card border-0">
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Attendance Trend</CardTitle></CardHeader>
          <CardContent><div className="h-48"><Line data={lineData} options={chartOptions} /></div></CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
