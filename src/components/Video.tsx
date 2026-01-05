import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

/**
 * Video component for displaying video streams using native WebRTC
 * Replaces the previous Daily.co video component
 */
export default function Video({
  id,
  stream,
  className,
  tileClassName,
  muted = false,
}: {
  id: string;
  stream?: MediaStream | null;
  className?: string;
  tileClassName?: string;
  muted?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((error) => {
        console.warn("Video playback failed:", error);
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  useEffect(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      setIsVideoEnabled(videoTracks.length > 0 && videoTracks[0].enabled);
    }
  }, [stream]);

  if (!stream || !isVideoEnabled) {
    return (
      <div
        className={cn("bg-[rgba(248,250,252,0.08)]", className, {
          "hidden size-0": !isVideoEnabled,
        })}
      />
    );
  }

  return (
    <div className={cn("bg-[rgba(248,250,252,0.08)]", className)}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={cn("size-full object-cover", tileClassName)}
      />
    </div>
  );
}
