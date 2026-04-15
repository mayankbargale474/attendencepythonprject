import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Save, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStudents, getAttendance, saveAttendance, getClasses, type AttendanceRecord } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Attendance() {
  const students = getStudents();
  const classes = getClasses();
  const [records, setRecords] = useState<AttendanceRecord[]>(getAttendance());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const filteredStudents = useMemo(
    () => selectedClass === "all" ? students : students.filter((s) => s.className === selectedClass),
    [students, selectedClass]
  );

  const getStatus = (studentId: string): "present" | "absent" | null => {
    const rec = records.find((r) => r.studentId === studentId && r.date === selectedDate);
    return rec ? rec.status : null;
  };

  const toggleStatus = (studentId: string, status: "present" | "absent") => {
    const existing = records.findIndex((r) => r.studentId === studentId && r.date === selectedDate);
    let updated: AttendanceRecord[];
    if (existing >= 0) {
      updated = records.map((r, i) =>
        i === existing ? { ...r, status, timestamp: new Date().toISOString() } : r
      );
    } else {
      updated = [
        ...records,
        { id: Date.now().toString(), studentId, date: selectedDate, status, timestamp: new Date().toISOString() },
      ];
    }
    setRecords(updated);
    saveAttendance(updated);
  };

  const markAll = (status: "present" | "absent") => {
    let updated = [...records];
    filteredStudents.forEach((s) => {
      const idx = updated.findIndex((r) => r.studentId === s.id && r.date === selectedDate);
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], status, timestamp: new Date().toISOString() };
      } else {
        updated.push({ id: Date.now().toString() + s.id, studentId: s.id, date: selectedDate, status, timestamp: new Date().toISOString() });
      }
    });
    setRecords(updated);
    saveAttendance(updated);
    toast({ title: "Done", description: `All marked ${status}` });
  };

  const presentCount = filteredStudents.filter((s) => getStatus(s.id) === "present").length;
  const absentCount = filteredStudents.filter((s) => getStatus(s.id) === "absent").length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground text-sm">Record daily student attendance</p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full sm:w-48" />
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-2 ml-auto">
          <Button variant="success" size="sm" onClick={() => markAll("present")}><Check className="h-4 w-4 mr-1" /> All Present</Button>
          <Button variant="destructive" size="sm" onClick={() => markAll("absent")}><X className="h-4 w-4 mr-1" /> All Absent</Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <Card className="glass-card border-0"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold">{filteredStudents.length}</p></CardContent></Card>
        <Card className="glass-card border-0"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Present</p><p className="text-2xl font-bold text-success">{presentCount}</p></CardContent></Card>
        <Card className="glass-card border-0"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Absent</p><p className="text-2xl font-bold text-destructive">{absentCount}</p></CardContent></Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => {
                  const status = getStatus(s.id);
                  return (
                    <TableRow key={s.id} className="border-border hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell><span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{s.rollNo}</span></TableCell>
                      <TableCell>{s.className}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant={status === "present" ? "success" : "outline"}
                            onClick={() => toggleStatus(s.id, "present")}
                            className="text-xs h-8"
                          >
                            <Check className="h-3 w-3 mr-1" /> Present
                          </Button>
                          <Button
                            size="sm"
                            variant={status === "absent" ? "destructive" : "outline"}
                            onClick={() => toggleStatus(s.id, "absent")}
                            className="text-xs h-8"
                          >
                            <X className="h-3 w-3 mr-1" /> Absent
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
