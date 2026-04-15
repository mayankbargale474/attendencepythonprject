import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student, getStudents, saveStudents } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Students() {
  const [students, setStudents] = useState<Student[]>(getStudents());
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: "", rollNo: "", className: "", email: "" });

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.className.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.rollNo || !form.className || !form.email) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    let updated: Student[];
    if (editing) {
      updated = students.map((s) => (s.id === editing.id ? { ...s, ...form } : s));
      toast({ title: "Updated", description: `${form.name} updated successfully` });
    } else {
      const newStudent: Student = { id: Date.now().toString(), ...form };
      updated = [...students, newStudent];
      toast({ title: "Added", description: `${form.name} added successfully` });
    }
    setStudents(updated);
    saveStudents(updated);
    setDialogOpen(false);
    setEditing(null);
    setForm({ name: "", rollNo: "", className: "", email: "" });
  };

  const handleDelete = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveStudents(updated);
    toast({ title: "Deleted", description: "Student removed" });
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ name: s.name, rollNo: s.rollNo, className: s.className, email: s.email });
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", rollNo: "", className: "", email: "" });
    setDialogOpen(true);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-muted-foreground text-sm">{students.length} students enrolled</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></div>
              <div><Label>Roll No</Label><Input value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} placeholder="e.g. CS001" /></div>
              <div><Label>Class</Label><Input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="e.g. 10-A" /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@school.com" type="email" /></div>
              <Button variant="gradient" className="w-full" onClick={handleSave}>
                {editing ? "Update" : "Add"} Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item}>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
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
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{s.rollNo}</span></TableCell>
                    <TableCell>{s.className}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{s.email}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No students found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
