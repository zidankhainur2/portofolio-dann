import { Navigation } from "@/components/ui/Navigation";
import { GalaxyZone } from "@/components/zones/GalaxyZone";
import { SkyZone } from "@/components/zones/SkyZone";
import { BunkerZone } from "@/components/zones/BunkerZone";
import { OceanProjectsZone } from "@/components/zones/OceanProjectsZone";
import { AbyssZone } from "@/components/zones/AbyssZone";
import { ContactSeabed } from "@/components/zones/ContactSeabed";
import { ZoneConnector } from "@/components/connectors/ZoneConnector";
import { WorldCanvasBoundary } from "@/components/canvas/WorldCanvasBoundary";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main" tabIndex={0}>Lewati ke konten utama</a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <WorldCanvasBoundary />
        <GalaxyZone />
        <ZoneConnector variant="atmosphere" />
        <SkyZone />
        <ZoneConnector variant="cave" />
        <BunkerZone />
        <ZoneConnector variant="flooded" />
        <OceanProjectsZone />
        <ZoneConnector variant="deep" />
        <AbyssZone />
        <ZoneConnector variant="shore" />
        <ContactSeabed />
      </main>
      <footer className="site-footer"><div className="container"><span>ZIDAN KHAINUR / 2026</span><span>Built as a journey from orbit to the abyss.</span><a href="#home">Kembali ke orbit ↑</a></div></footer>
    </>
  );
}
