"use client";

import React from "react";
import { Hospital } from "@/types";
import { Button } from "@/components/ui/Button";
import { Phone, Navigation, MapPin } from "lucide-react";
import { formatDistance } from "@/lib/geo";

interface HospitalWithDistance extends Hospital {
  distance?: number | null;
}

interface HospitalListProps {
  hospitals: HospitalWithDistance[];
}

export const HospitalList: React.FC<HospitalListProps> = ({ hospitals }) => {
  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[22px] md:text-[26px] font-heading font-bold text-text-primary">
            Nearby Hospitals
          </h2>
          <p className="text-[14px] text-text-muted mt-0.5">
            Emergency departments and direct ambulance helplines
          </p>
        </div>
        <a
          href="https://www.google.com/maps/search/hospitals+in+bangladesh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-semibold text-brand hover:underline hidden sm:inline-block"
        >
          View all on Google Maps →
        </a>
      </div>

      <div className="space-y-4">
        {hospitals.map((hospital) => {
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;

          return (
            <div
              key={hospital.id}
              className="bg-white border border-border-soft rounded-[16px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-soft hover:shadow-sm transition-all duration-200"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-[16px] text-text-primary truncate">
                    {hospital.name}
                  </h3>
                  {hospital.distance !== undefined && hospital.distance !== null && (
                    <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-brand-light text-brand">
                      {formatDistance(hospital.distance)} away
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
                  <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  <span className="truncate">{hospital.address}</span>
                </div>

                <div className="text-[13px] font-mono text-text-muted mt-1">
                  Hotline: <strong className="text-text-primary">{hospital.phone}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-soft">
                <a href={`tel:${hospital.phone}`}>
                  <Button
                    size="s"
                    variant="emergency"
                    leftIcon={<Phone className="w-4 h-4" />}
                  >
                    Call
                  </Button>
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="s"
                    variant="secondary"
                    leftIcon={<Navigation className="w-4 h-4 text-brand" />}
                  >
                    Directions
                  </Button>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <a
          href="https://www.google.com/maps/search/hospitals+in+bangladesh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-semibold text-brand hover:underline"
        >
          View all on Google Maps →
        </a>
      </div>
    </div>
  );
};
