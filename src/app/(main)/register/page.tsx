"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { TextLink } from "@/components/ui/TextLink";
import { useToast } from "@/components/ui/Toast";
import { useProfileStore } from "@/stores/useProfileStore";
import { Profile } from "@/types";

const AREAS = ["Dhaka", "Mirpur", "Gulshan", "Banani", "Uttara", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh", "Other"];
const DISEASES = ["None", "Diabetes", "High Blood Pressure", "Asthma", "Heart Disease", "Thyroid", "Kidney Disease", "Arthritis"];
const ALLERGIES = ["None", "Penicillin", "Sulfa Drugs", "Seafood", "Peanuts", "Dust", "Pollen"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Don't Know"];
const AGE_GROUPS = ["Under 18", "18-30", "31-45", "46-60", "60+"];
const GENDERS = ["Male", "Female", "Prefer not to say"];

export default function RegisterPage() {
  const router = useRouter();
  const setProfile = useProfileStore((s) => s.setProfile);
  const existingProfile = useProfileStore((s) => s.profile);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Profile>>(existingProfile || {
    diseases: [],
    allergies: [],
  });

  const [customAllergy, setCustomAllergy] = useState("");

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const { showToast } = useToast();

  const handleComplete = () => {
    if (!formData.name || !formData.phone) return;
    
    setProfile({
      name: formData.name,
      phone: formData.phone,
      area: formData.area || "",
      diseases: formData.diseases || [],
      allergies: formData.allergies || [],
      bloodGroup: formData.bloodGroup,
      ageGroup: formData.ageGroup,
      gender: formData.gender,
      emergencyContact: formData.emergencyContact,
      consentGiven: true,
    });
    showToast("Profile saved successfully!", "success");
    setStep(4); // Success step
  };

  const toggleArrayItem = (key: "diseases" | "allergies", item: string) => {
    const arr = formData[key] || [];
    if (item === "None") {
      setFormData({ ...formData, [key]: ["None"] });
      return;
    }
    let newArr = arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
    newArr = newArr.filter(i => i !== "None"); // Remove "None" if other selected
    setFormData({ ...formData, [key]: newArr });
  };

  const isStep1Valid = !!formData.name && formData.name.trim().length > 0 && !!formData.phone && formData.phone.trim().length > 0;

  if (step === 4) {
    return (
      <div className="max-w-[480px] mx-auto px-4 py-16 md:py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-success-soft text-success-dark flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-[28px] font-heading font-extrabold text-text-primary mb-3">
          Welcome, {formData.name}!
        </h1>
        <p className="text-[16px] text-text-muted mb-8">
          Your profile has been saved. You can now explore MediLink.
        </p>
        <Button size="l" fullWidth onClick={() => router.push("/")}>
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[540px] mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-8">
        <h1 className="text-[28px] md:text-[32px] font-heading font-extrabold text-text-primary mb-2">
          Tell Us About Yourself
        </h1>
        <p className="text-[15px] text-text-muted">
          Dr MediLink and our doctors can give you better advice with this information.
        </p>
      </div>

      <div className="bg-white border border-border-soft rounded-[16px] p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[14px] font-bold text-brand">Step {step} of 3</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-2.5 h-2.5 rounded-full ${s === step ? "bg-brand" : s < step ? "bg-brand-light" : "bg-bg-soft"}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-[20px] font-bold text-text-primary mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-[14px] font-bold text-text-primary mb-1.5">Your Full Name</label>
              <Input 
                placeholder="e.g., Rahim Ahmed" 
                value={formData.name || ""} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="block text-[14px] font-bold text-text-primary mb-1.5">Mobile Number</label>
              <div className="flex gap-2">
                <div className="w-16 shrink-0 bg-bg-soft border border-border-soft rounded-md flex items-center justify-center font-bold text-text-primary text-[15px] select-none">
                  +880
                </div>
                <Input 
                  placeholder="1XXXXXXXXX" 
                  value={formData.phone || ""} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })} 
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-text-primary mb-1.5">Your Area</label>
              <select 
                className="w-full h-12 px-4 rounded-md border border-border-soft bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent appearance-none"
                value={formData.area || ""}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              >
                <option value="" disabled>Select your area</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-[20px] font-bold text-text-primary mb-4">Health Profile</h2>
            
            <div>
              <label className="block text-[14px] font-bold text-text-primary mb-2.5">Do you have any ongoing conditions?</label>
              <div className="flex flex-wrap gap-2">
                {DISEASES.map(d => (
                  <Chip 
                    key={d} 
                    label={d}
                    active={(formData.diseases || []).includes(d)} 
                    onClick={() => toggleArrayItem("diseases", d)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-text-primary mb-2.5">Any known allergies?</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {ALLERGIES.map(a => (
                  <Chip 
                    key={a} 
                    label={a}
                    active={(formData.allergies || []).includes(a)} 
                    onClick={() => toggleArrayItem("allergies", a)}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Or type another allergy..." 
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customAllergy.trim()) {
                      e.preventDefault();
                      toggleArrayItem("allergies", customAllergy.trim());
                      setCustomAllergy("");
                    }
                  }}
                />
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    if (customAllergy.trim()) {
                      toggleArrayItem("allergies", customAllergy.trim());
                      setCustomAllergy("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-[20px] font-bold text-text-primary mb-4">Optional Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-bold text-text-primary mb-1.5">Blood Group (Optional)</label>
                <select 
                  className="w-full h-12 px-3 rounded-md border border-border-soft bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-brand"
                  value={formData.bloodGroup || ""}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[14px] font-bold text-text-primary mb-1.5">Age Group (Optional)</label>
                <select 
                  className="w-full h-12 px-3 rounded-md border border-border-soft bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-brand"
                  value={formData.ageGroup || ""}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                >
                  <option value="">Select</option>
                  {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-text-primary mb-1.5">Gender (Optional)</label>
              <select 
                className="w-full h-12 px-3 rounded-md border border-border-soft bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-brand"
                value={formData.gender || ""}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="border-t border-border-soft pt-5 mt-5">
              <label className="block text-[14px] font-bold text-text-primary mb-3">Emergency Contact (Optional)</label>
              <div className="space-y-3">
                <Input 
                  placeholder="Contact Name" 
                  value={formData.emergencyContact?.name || ""}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: formData.emergencyContact?.phone || "", name: e.target.value } })}
                />
                <div className="flex gap-2">
                  <div className="w-14 shrink-0 bg-bg-soft border border-border-soft rounded-md flex items-center justify-center font-medium text-text-muted text-[13px] select-none">
                    +880
                  </div>
                  <Input 
                    placeholder="Phone Number" 
                    value={formData.emergencyContact?.phone || ""}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: formData.emergencyContact?.name || "", phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) } })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-brand-light/30 rounded-md p-4 text-[13px] text-text-muted mt-6">
              I understand that MediLink AI is not a doctor and I should call 999 in emergencies.
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <Button variant="ghost" onClick={handleBack}>← Back</Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-4">
            <TextLink onClick={() => router.push("/")} className="text-[14px] font-medium text-text-muted hover:text-text-primary">
              Skip for now
            </TextLink>
            
            {step < 3 ? (
              <Button onClick={handleNext} disabled={step === 1 && !isStep1Valid}>
                Next →
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Complete Registration
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
