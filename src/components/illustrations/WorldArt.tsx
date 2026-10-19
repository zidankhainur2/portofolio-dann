// shortcut: development vector scenery, replace when approved final zone artwork is supplied.
import { ShowcasePoster } from "@/components/illustrations/ShowcasePoster";

export function GalaxyArt() {
  return (
    <div className="world-art galaxy-art" aria-hidden="true">
      <div className="nebula-band" />
      <div className="orbit-art"><div className="orbit-ring" /><div className="planet" data-scene="planet" /><span className="orbital-dot" /></div>
      <svg className="orbital-track" viewBox="0 0 640 140" width="640" height="140" fill="none" focusable="false">
        <path d="M0 120Q240-80 640 70M50 140Q280-60 640 92" />
        <circle cx="404" cy="35" r="4" />
        <path d="M401 35h6m-3-3v6" />
      </svg>
    </div>
  );
}

export function SkyArt() {
  return (
    <div className="world-art sky-art" aria-hidden="true">
      <div className="sky-sun" />
      <svg className="cloud-bank cloud-far" viewBox="0 0 1440 360" width="1440" height="360" preserveAspectRatio="none" focusable="false">
        <path d="M0 160C80 160 100 90 180 110 200 20 350 30 380 90 450 50 550 80 580 150 650 120 720 140 750 190 860 160 910 210 950 230 1060 160 1180 160 1210 220 1310 190 1380 220 1440 180V360H0Z" />
      </svg>
      <svg className="cloud-bank cloud-mid" viewBox="0 0 1440 300" width="1440" height="300" preserveAspectRatio="none" focusable="false">
        <path d="M0 190C60 100 160 130 200 180 260 120 360 150 390 200 490 160 560 200 600 230H840C880 180 970 160 1040 210 1090 130 1190 120 1250 170 1330 90 1410 120 1440 160V300H0Z" />
      </svg>
      <svg className="cloud-bank cloud-near" viewBox="0 0 1440 180" width="1440" height="180" preserveAspectRatio="none" focusable="false">
        <path d="M0 80C100 20 170 110 260 80S440 150 610 120 780 150 980 110 1230 140 1440 80V180H0Z" />
      </svg>
    </div>
  );
}

export function BunkerArt() {
  return (
    <>
      <div className="world-art bunker-art" aria-hidden="true">
        <div className="bunker-wall" />
        <div className="practical-light light-left" /><div className="practical-light light-right" />
        <svg className="ceiling-pipes" viewBox="0 0 1440 80" width="1440" height="80" fill="none" preserveAspectRatio="none" focusable="false">
          <path d="M0 20H330l30 24h390l30-24h660M0 30H320l30 24h410l30-24h650" />
          <path d="M160 0v50m15-50v50M1250 0v50m15-50v50" />
        </svg>
      </div>
      <div className="world-art world-foreground" aria-hidden="true">
        <svg className="world-edge edge-left cave-edge" viewBox="0 0 140 1000" width="140" height="1000" preserveAspectRatio="none" focusable="false">
          <path d="M0 0H140L76 100 110 190 52 290 85 390 40 510 86 610 58 740 110 850 74 930 140 1000H0Z" />
          <path className="rock-facet" d="M0 0 76 100 30 220 52 290 12 430 40 510 16 640 58 740 22 900 74 930 0 1000Z" />
        </svg>
        <svg className="world-edge edge-right cave-edge" viewBox="0 0 140 1000" width="140" height="1000" preserveAspectRatio="none" focusable="false">
          <path d="M140 0H20L66 90 36 200 94 330 52 440 96 540 60 660 105 790 40 910 0 1000H140Z" />
        </svg>
      </div>
    </>
  );
}

export function WorkstationBase() {
  return (
    <div className="workstation-base" aria-hidden="true">
      <svg viewBox="0 0 1440 96" width="1440" height="96" preserveAspectRatio="none" focusable="false">
        <path className="monitor-stands" d="M320 0h72v32h40v8H280v-8h40ZM1048 0h72v32h40v8h-152v-8h40Z" />
        <path className="desk-surface" d="M0 40h1440v14H0Z" />
        <path className="desk-frame" d="M0 54h1440v14H0Zm55 14h14v28H55Zm1316 0h14v28h-14Z" />
        <path className="desk-cables" d="M340 68v10q0 12 28 12h120q28 0 28-12V68m550 0v28" fill="none" />
      </svg>
    </div>
  );
}

export function OceanArt() {
  return (
    <>
      <div className="world-art ocean-art" aria-hidden="true">
        <ShowcasePoster />
        <div className="ocean-rays" /><div className="ocean-suspended" />
        <svg className="marine-silhouettes" viewBox="0 0 240 160" width="240" height="160" focusable="false">
          <path d="M30 42q28-20 54 0-26 20-54 0L12 28v28ZM150 94q20-14 40 0-20 14-40 0l-12-10v20ZM96 130q14-10 28 0-14 10-28 0l-8-6v12Z" />
        </svg>
      </div>
      <div className="world-art world-foreground" aria-hidden="true">
        <svg className="world-edge edge-left ocean-reef" viewBox="0 0 140 1200" width="140" height="1200" preserveAspectRatio="none" focusable="false">
          <path d="M0 1200V140l30 70-12 100 45 120-20 130 50 160-30 170 77 310Z" />
          <path className="coral-branch" d="M40 700V540l30-40m-30 95-25-36m25-15v-55m30 11v-32m-2 235 22-68m-10 40 24-14" fill="none" />
        </svg>
        <svg className="world-edge edge-right ocean-reef" viewBox="0 0 140 1200" width="140" height="1200" preserveAspectRatio="none" focusable="false">
          <path d="M140 1200H0l60-160-8-150 40-120-14-170 30-120-12-160 44-120Z" />
          <path className="coral-branch" d="M98 1010V870l-28-38m28 100 28-38m-28-12v-65m-28 15v-32M52 1120l-14-60m7 30-20-12" fill="none" />
        </svg>
      </div>
    </>
  );
}

export function AbyssArt() {
  return (
    <div className="world-art abyss-art" aria-hidden="true">
      <div className="abyss-haze" />
      <svg className="abyss-jellyfish" viewBox="0 0 120 240" width="120" height="240" fill="none" focusable="false">
        <path className="jellyfish-bell" d="M20 70C20 5 100 5 100 70Q60 100 20 70Z" />
        <path d="M20 70q40 26 80 0M36 82c-25 50 30 65 0 116m16-110c24 50-22 60 0 125m16-125c-18 55 24 70 4 140m12-146c30 32-25 62 0 105M60 22Q38 42 40 72m20-50q22 20 20 50" />
      </svg>
      <svg className="abyss-ridge" viewBox="0 0 1440 220" width="1440" height="220" preserveAspectRatio="none" focusable="false">
        <path d="M0 220V110l120-60 90 70 140-30 170 85 170-50 150 40 150-80 150 35 200-90 100 60v130Z" />
        <path d="M0 220v-55l160-32 180 54 190-12 160 27 160-42 170 30 220-58 200 60v28Z" />
      </svg>
    </div>
  );
}

export function SeabedArt() {
  return (
    <div className="world-art seabed-art" aria-hidden="true">
      <svg className="seabed-contours" viewBox="0 0 1440 900" width="1440" height="900" fill="none" preserveAspectRatio="none" focusable="false">
        <path d="M850-80c-200 260 440 220 260 460s-50 350 420 280M910-70c-180 250 450 220 260 460s-30 330 390 270M970-60c-160 240 460 220 260 460s-10 310 360 260M1030-50c-140 230 470 220 260 460s10 290 330 250M1090-40c-120 220 480 220 260 460s30 270 300 240M1150-30c-100 210 490 220 260 460s50 250 270 230" />
        <path d="M-80 700q230-190 410 50t400 200M-80 735q230-190 410 50t400 200M-80 770q230-190 410 50t400 200" />
      </svg>
      <svg className="seabed-shell" viewBox="0 0 100 100" width="100" height="100" fill="none" focusable="false">
        <path d="M50 82C-10 62 6 2 50 10c44-8 60 52 0 72ZM50 82V10m0 72L24 19m26 63L10 36m40 46 26-63M50 82l40-46M42 89h16" />
      </svg>
    </div>
  );
}
