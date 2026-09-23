"use client";

import React, { useState, useMemo, useEffect } from "react";
import doctorsData from "@/data/doctors.json";
import { Doctor } from "@/types";
import { DoctorRow } from "@/components/doctors/DoctorRow";
import { DoctorDetailDrawer } from "@/components/doctors/DoctorDetailDrawer";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { useProfileStore } from "@/stores/useProfileStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import {
  Coordinates,
  calculateDistanceKm,
  getCoordinatesForArea,
  getCurrentLocation,
} from "@/lib/geo";
import { Search, MapPin, Compass } from "lucide-react";

const SPECIALTIES = [
  "All",
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "Gynecology",
  "General Physician",
  "Neurology",
  "ENT",
  "Orthopedics",
  "Gastroenterology",
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Geo / Nearby state
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [userAreaLabel, setUserAreaLabel] = useState<string>("");
  const [geoLoading, setGeoLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
  const profile = useProfileStore((s) => s.profile);
  const isPremium = useSubscriptionStore((s) => s.isPremium());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check profile for initial coordinates
  useEffect(() => {
    if (profile?.area) {
      const coords = getCoordinatesForArea(profile.area);
      if (coords) {
        setUserCoords(coords);
        setUserAreaLabel(profile.area);
      }
    }
  }, [profile?.area]);

  const handleToggleNearby = async () => {
    if (isNearbyActive) {
      setIsNearbyActive(false);
      return;
    }

    setGeoLoading(true);
    try {
      const liveCoords = await getCurrentLocation();
      setUserCoords(liveCoords);
      setUserAreaLabel("Your Location");
      setIsNearbyActive(true);
    } catch {
      // Fallback to profile area or Dhaka default
      const area = profile?.area || "Dhaka";
      const fallbackCoords = getCoordinatesForArea(area);
      setUserCoords(fallbackCoords);
      setUserAreaLabel(area);
      setIsNearbyActive(true);
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDrawerOpen(true);
  };

  // Doctors with calculated distances and filtering
  const processedDoctors = useMemo(() => {
    let list = (doctorsData as Doctor[]).map((doc) => {
      let distance: number | null = null;
      if (userCoords && doc.latitude && doc.longitude) {
        distance = calculateDistanceKm(userCoords, {
          latitude: doc.latitude,
          longitude: doc.longitude,
        });
      }
      return { doctor: doc, distance };
    });

    // Specialty filter
    if (selectedSpecialty !== "All") {
      list = list.filter(
        (item) =>
          item.doctor.specialty.toLowerCase() ===
          selectedSpecialty.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.doctor.name.toLowerCase().includes(q) ||
          item.doctor.specialty.toLowerCase().includes(q) ||
          item.doctor.area.toLowerCase().includes(q) ||
          item.doctor.bio.toLowerCase().includes(q)
      );
    }

    // Sort by distance if Nearby is active
    if (isNearbyActive) {
      list.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return list;
  }, [searchQuery, selectedSpecialty, isNearbyActive, userCoords]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-24 md:pb-16">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[32px] md:text-[40px] font-heading font-extrabold text-text-primary tracking-tight">
          Find Doctor
        </h1>
        <p className="text-[16px] text-text-muted mt-1">
          Browse specialists near you and book consultations.
        </p>
      </div>

      {/* Search & Nearby Filter Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Search doctor or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5 text-text-muted" />}
            />
          </div>

          <Button
            type="button"
            variant={isNearbyActive ? "primary" : "secondary"}
            size="m"
            onClick={handleToggleNearby}
            isLoading={geoLoading}
            leftIcon={
              isNearbyActive ? (
                <MapPin className="w-4 h-4 text-white" />
              ) : (
                <Compass className="w-4 h-4 text-brand" />
              )
            }
            className="shrink-0"
          >
            {isNearbyActive
              ? `📍 ${userAreaLabel || "Nearby"}`
              : "Nearby"}
          </Button>
        </div>

        {/* Specialty Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SPECIALTIES.map((spec) => (
            <Chip
              key={spec}
              label={spec}
              active={selectedSpecialty === spec}
              onClick={() => setSelectedSpecialty(spec)}
            />
          ))}
        </div>
      </div>

      {/* Doctor List */}
      {processedDoctors.length === 0 ? (
        <div className="bg-white border border-border-soft rounded-[16px] p-12 text-center my-8">
          <h3 className="text-[20px] font-bold text-text-primary mb-2">
            No Doctors Found
          </h3>
          <p className="text-[15px] text-text-muted mb-6 max-w-sm mx-auto">
            We couldn't find any doctors matching your search.
          </p>
          <Button
            variant="secondary"
            size="m"
            onClick={() => {
              setSearchQuery("");
              setSelectedSpecialty("All");
              setIsNearbyActive(false);
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {processedDoctors.map(({ doctor, distance }) => (
            <DoctorRow
              key={doctor.id}
              doctor={doctor}
              distanceKm={distance}
              onSelect={handleSelectDoctor}
              isPremium={mounted && isPremium}
            />
          ))}
        </div>
      )}

      {/* Doctor Detail Drawer */}
      <DoctorDetailDrawer
        doctor={selectedDoctor}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDoctor(null);
        }}
      />
    </div>
  );
}
