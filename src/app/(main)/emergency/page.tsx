"use client";

import React, { useState, useEffect, useMemo } from "react";
import hospitalsData from "@/data/hospitals.json";
import { Hospital } from "@/types";
import { SOSButton } from "@/components/emergency/SOSButton";
import { EmergencyActions } from "@/components/emergency/EmergencyActions";
import { HospitalList } from "@/components/emergency/HospitalList";
import { useProfileStore } from "@/stores/useProfileStore";
import {
  Coordinates,
  AREA_COORDINATES,
  calculateDistanceKm,
  getCoordinatesForArea,
  getCurrentLocation,
} from "@/lib/geo";
import { MapPin, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export default function EmergencyPage() {
  const profile = useProfileStore((s) => s.profile);

  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [geoState, setGeoState] = useState<"loading" | "success" | "fallback">("loading");

  useEffect(() => {
    let isMounted = true;

    async function resolveLocation() {
      try {
        const liveCoords = await getCurrentLocation();
        if (!isMounted) return;
        setCoords(liveCoords);
        setLocationName(profile?.area ? `${profile.area}, Bangladesh` : "Detected Location");
        setGeoState("success");
      } catch {
        if (!isMounted) return;
        // Fallback to profile area or Dhaka
        const fallbackArea = profile?.area || "Dhaka";
        const fallbackCoords = getCoordinatesForArea(fallbackArea);
        setCoords(fallbackCoords);
        setLocationName(fallbackArea);
        setGeoState("fallback");
      }
    }

    resolveLocation();

    return () => {
      isMounted = false;
    };
  }, [profile?.area]);

  const handleManualAreaChange = (selectedArea: string) => {
    const newCoords = getCoordinatesForArea(selectedArea);
    setCoords(newCoords);
    setLocationName(selectedArea);
    setGeoState("success");
  };

  const sortedHospitals = useMemo(() => {
    const list = (hospitalsData as Hospital[]).map((hos) => {
      let distance: number | null = null;
      if (coords && hos.latitude && hos.longitude) {
        distance = calculateDistanceKm(coords, {
          latitude: hos.latitude,
          longitude: hos.longitude,
        });
      }
      return { ...hos, distance };
    });

    if (coords) {
      list.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return list;
  }, [coords]);

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-24 md:pb-16">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-[32px] md:text-[44px] font-heading font-extrabold text-emergency tracking-tight">
          Emergency Help
        </h1>
        <p className="text-[16px] md:text-[18px] text-text-muted mt-2 max-w-lg mx-auto">
          Your nearby hospitals and 999 emergency services.
        </p>
      </div>

      {/* Location Status Banner */}
      <div className="max-w-[600px] mx-auto mb-8">
        {geoState === "loading" && (
          <div className="flex items-center justify-center gap-2 p-3 bg-bg-soft rounded-[12px] text-[14px] text-text-muted font-medium border border-border-soft">
            <Loader2 className="w-4 h-4 animate-spin text-brand" />
            <span>Finding your location...</span>
          </div>
        )}

        {geoState === "success" && (
          <div className="flex items-center justify-between gap-3 p-3.5 bg-success-soft/60 rounded-[12px] text-[14px] text-success-dark font-medium border border-success/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-dark shrink-0" />
              <span>✓ Your location: <strong>{locationName}</strong></span>
            </div>
            <select
              value={locationName.split(",")[0].trim()}
              onChange={(e) => handleManualAreaChange(e.target.value)}
              className="text-[12px] font-bold text-text-primary bg-white border border-border-soft rounded-md px-2 py-1 focus:outline-none"
            >
              <option value="" disabled>Change area</option>
              {Object.keys(AREA_COORDINATES).map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        )}

        {geoState === "fallback" && (
          <div className="p-3.5 bg-accent-soft/60 rounded-[12px] text-[14px] text-text-primary font-medium border border-accent/30 space-y-2">
            <div className="flex items-center gap-2 text-[#92620A]">
              <AlertTriangle className="w-4 h-4 text-accent shrink-0" />
              <span>⚠️ Location off — Select your area manually</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <MapPin className="w-4 h-4 text-text-muted shrink-0" />
              <select
                value={locationName}
                onChange={(e) => handleManualAreaChange(e.target.value)}
                className="w-full text-[13px] font-bold text-text-primary bg-white border border-border-soft rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                {Object.keys(AREA_COORDINATES).map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Big Pulsing SOS Button */}
      <SOSButton />

      {/* Emergency Action Cards */}
      <EmergencyActions
        profile={profile}
        coords={coords}
        locationName={locationName}
      />

      {/* Nearby Hospital Directory */}
      <HospitalList hospitals={sortedHospitals} />
    </div>
  );
}
