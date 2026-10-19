import { CapsulePoster } from "@/components/illustrations/ScenePosters";

const contours = {
  atmosphere: [
    "M0 98C110 30 180 112 310 66S510 10 690 72 900 18 1080 58 1300 8 1440 42V180H0Z",
    "M0 120C140 50 210 152 360 108S580 48 750 108 1030 68 1190 104 1350 64 1440 82V180H0Z",
    "M0 148C150 110 250 176 440 142S720 170 910 142 1230 160 1440 130V180H0Z",
  ],
  cave: [
    "M0 22 100 44 170 12 280 62 400 30 510 80 650 35 770 64 910 16 1070 58 1240 20 1350 48 1440 22V180H0Z",
    "M0 70 120 100 220 62 380 120 520 78 660 108 830 66 960 114 1120 74 1270 104 1440 62V180H0Z",
    "M0 112 160 148 290 116 470 152 620 124 820 156 1020 122 1190 146 1320 112 1440 140V180H0Z",
  ],
  flooded: [
    "M0 40 120 70 220 38 360 92 500 64 670 106 800 58 990 100 1130 64 1290 94 1440 56V180H0Z",
    "M0 116C180 70 300 142 500 112S790 74 970 114 1250 140 1440 98V180H0Z",
    "M0 152C160 134 320 168 510 148S840 162 1040 144 1300 156 1440 142V180H0Z",
  ],
  deep: [
    "M0 60C240 140 390 34 640 84S1050 32 1440 92V180H0Z",
    "M0 110C220 168 430 80 700 128S1180 94 1440 132V180H0Z",
    "M0 150C260 184 440 124 720 160S1160 140 1440 156V180H0Z",
  ],
  shore: [
    "M0 54C180 30 300 116 500 74S790 106 990 60 1280 80 1440 44V180H0Z",
    "M0 96C200 64 340 150 580 106S910 132 1100 94 1320 112 1440 86V180H0Z",
    "M0 144C230 112 380 178 630 142S1010 164 1190 132 1350 152 1440 126V180H0Z",
  ],
};

export function ZoneConnector({ variant }: { variant: keyof typeof contours }) {
  return (
    <div className={`zone-connector connector-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1440 180" width="1440" height="180" preserveAspectRatio="none" focusable="false">
        {contours[variant].map((path, index) => <path key={path} className={`connector-plane-${index}`} d={path} />)}
      </svg>
      {variant === "atmosphere" && <CapsulePoster />}
    </div>
  );
}
