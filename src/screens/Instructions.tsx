// Conversation feature removed
import {
  DialogWrapper,
  AnimatedTextBlockWrapper,
  StaticTextBlockWrapper,
} from "@/components/DialogWrapper";
import { screenAtom } from "@/store/screens";
import React from "react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import gloriaVideo from "@/assets/video/gloria.mp4";

export const Instructions: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);

  const handleReturn = () => {
    setScreenState({ currentScreen: "intro" });
  };

  return (
    <DialogWrapper>
      <video
        src={gloriaVideo}
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 h-full w-full object-cover"
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <AnimatedTextBlockWrapper>
        <StaticTextBlockWrapper
          imgSrc="/images/positive.png"
          title="Feature Removed"
          titleClassName="sm:max-w-full"
          description="The conversation feature has been removed from this application."
        >
          <Button
            onClick={handleReturn}
            className="relative z-20 flex items-center justify-center gap-2 rounded-3xl border border-[rgba(255,255,255,0.3)] px-8 py-3 text-base text-white transition-all duration-200 hover:text-primary mt-6"
            style={{
              height: '48px',
              transition: 'all 0.2s ease-in-out',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 254, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Return to Main Screen
          </Button>
        </StaticTextBlockWrapper>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};

export const PositiveFeedback: React.FC = () => {
  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <StaticTextBlockWrapper
          imgSrc="/images/positive.png"
          title="Great Conversation!"
          titleClassName="sm:max-w-full bg-[linear-gradient(91deg,_#43BF8F_16.63%,_#FFF_86.96%)]"
          description="Thanks for the engaging discussion. Feel free to come back anytime for another chat!"
        />
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};
