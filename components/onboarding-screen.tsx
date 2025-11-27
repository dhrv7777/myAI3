"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OnboardingScreenProps {
    onComplete: (data: string) => void;
    onSkip: () => void;
}

export function OnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
    const [fitnessGoal, setFitnessGoal] = useState("");
    const [medicalIssues, setMedicalIssues] = useState("");
    const [activityLevel, setActivityLevel] = useState("");

    const activityLevels = ["Sedentary", "Light", "Moderate", "Active"];

    const handleSubmit = () => {
        const data = `
User Profile:
- Fitness Goal: ${fitnessGoal || "Not specified"}
- Medical Issues/Restrictions: ${medicalIssues || "None specified"}
- Activity Level: ${activityLevel || "Not specified"}
    `.trim();
        onComplete(data);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome to WellWiser</h2>
                    <p className="text-muted-foreground">Help us personalize your wellness journey.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fitness-goal" className="text-base font-medium">
                            What’s your fitness goal?
                        </Label>
                        <p className="text-xs text-muted-foreground italic">
                            (weight loss, muscle gain, diet improvement, healthy eating, medical nutrition, general fitness?)
                        </p>
                        <Textarea
                            id="fitness-goal"
                            placeholder="e.g. I want to lose 5kg and build muscle..."
                            value={fitnessGoal}
                            onChange={(e) => setFitnessGoal(e.target.value)}
                            className="min-h-[80px] resize-none bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="medical-issues" className="text-base font-medium">
                            Do you have any medical issues, injuries, or diet restrictions?
                        </Label>
                        <p className="text-xs text-muted-foreground italic">
                            (Diabetes, PCOS, thyroid, BP, lactose intolerance, back pain?)
                        </p>
                        <Textarea
                            id="medical-issues"
                            placeholder="e.g. Type 2 Diabetes, Gluten sensitivity..."
                            value={medicalIssues}
                            onChange={(e) => setMedicalIssues(e.target.value)}
                            className="min-h-[80px] resize-none bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-medium">Activity Level?</Label>
                        <div className="flex flex-wrap gap-2">
                            {activityLevels.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setActivityLevel(level)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                        activityLevel === level
                                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                                            : "bg-background hover:bg-muted text-foreground border-input hover:border-primary/50"
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 text-base py-5 rounded-full shadow-lg hover:shadow-xl transition-all"
                        disabled={!fitnessGoal && !medicalIssues && !activityLevel}
                    >
                        Start Chatting
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onSkip}
                        className="sm:flex-none rounded-full text-muted-foreground hover:text-foreground"
                    >
                        Skip
                    </Button>
                </div>
            </div>
        </div>
    );
}
