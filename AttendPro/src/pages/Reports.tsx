import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { getStudents, getAttendance, getClasses } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Reports() {
  const students = getStudents();
  const attendance = getAttendance();
  const classes = getClasses();
  const [selectedClass, setSelectedClass] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredStudents = useMemo(
    () => selectedClass === "all" ? students : students.filter((s) => s.className === selectedClass),
    [students, selectedClass]
  );

  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      if (dateFrom && a.date < dateFrom) return false;
      if (dateTo && a.date > dateTo) return false;
      return true;
    });
  }, [attendance, dateFrom, dateTo]);

  const studentStats = useMemo(() => {
    return filteredStudents.map((s) => {
      const records = filteredAttendance.filter((a) => a.studentId === s.id);
      const present = records.filter((a) => a.status === "present").length;
      const total = records.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      return { ...s, present, absent: total - present, total, percentage };
    });
  }, [filteredStudents, filteredAttendance]);

  const downloadCSV = () => {
    const headers = "Name,Roll No,Class,Present,Absent,Total,Percentage\n";
    const rows = studentStats.map((s) => `${s.name},${s.rollNo},${s.className},${s.present},${s.absent},${s.total},${s.percentage}%`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Report exported as CSV" });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance Reports</h1>
          <p className="text-muted-foreground text-sm">View and export attendance data</p>
        </div>
        <Button variant="gradient" onClick={downloadCSV}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </motion.div>

      <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From" className="w-full sm:w-48" />
        <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To" className="w-full sm:w-48" />
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead>Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentStats.map((s) => (
                  <TableRow key={s.id} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{s.rollNo}</span></TableCell>
                    <TableCell>{s.className}</TableCell>
                    <TableCell className="text-center text-success font-medium">{s.present}</TableCell>
                    <TableCell className="text-center text-destructive font-medium">{s.absent}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={s.percentage}
                          className="h-2 flex-1"
                        />
                        <span className={`text-sm font-medium min-w-[40px] text-right ${s.percentage >= 75 ? "text-success" : s.percentage >= 50 ? "text-warning" : "text-destructive"}`}>
                          {s.percentage}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {studentStats.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No data available</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
