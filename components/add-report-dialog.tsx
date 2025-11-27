"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AddReportDialog() {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!text.trim()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/knowledge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error("Failed to save report");
            }

            toast.success("Medical report saved successfully");
            setText("");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                    <Plus className="size-4" />
                    Add Medical Report
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Medical Report</DialogTitle>
                    <DialogDescription>
                        Paste the text from your medical report here. NutriBot will use this to provide personalized advice.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        placeholder="Paste report text here..."
                        className="min-h-[200px]"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading || !text.trim()}>
                        {loading ? "Saving..." : "Save Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
