import { motion } from "framer-motion";
import { User, Mail, BookOpen, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStudents, getAttendance } from "@/lib/mock-data";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Profile() {
  const students = getStudents();
  const attendance = getAttendance();
  const totalClasses = [...new Set(students.map((s) => s.className))].length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-2xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold">Teacher Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your account settings</p>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground glow-primary">
                T
              </div>
              <div>
                <h2 className="text-xl font-semibold">Teacher</h2>
                <p className="text-muted-foreground text-sm">teacher@school.com</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">
                  <Shield className="h-3 w-3" /> Admin
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{totalClasses}</p>
                <p className="text-xs text-muted-foreground">Classes</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{attendance.length}</p>
                <p className="text-xs text-muted-foreground">Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass-card border-0">
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Account Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Full Name</Label><Input defaultValue="Teacher" /></div>
            <div><Label>Email</Label><Input defaultValue="teacher@school.com" type="email" /></div>
            <div><Label>Department</Label><Input defaultValue="Computer Science" /></div>
            <Button variant="gradient" className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
