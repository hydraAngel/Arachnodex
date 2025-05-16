
import { DangerLevel, Spider } from "../types/spider";

// Sample spider data
export const spidersData: Spider[] = [
  {
    id: 1,
    scientificName: "Argiope aurantia",
    commonName: "Black and Yellow Garden Spider",
    family: "Araneidae",
    description: "A large, black and yellow spider that builds orb webs in gardens and fields.",
    habitat: "Gardens, fields, forests",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=500&q=60",
    dangerLevel: DangerLevel.Harmless,
    size: "19-28mm",
    region: ["North America", "Central America"]
  },
  {
    id: 2,
    scientificName: "Latrodectus mactans",
    commonName: "Black Widow",
    family: "Theridiidae",
    description: "Identified by the red hourglass marking on their abdomen, they build irregular webs in secluded spots.",
    habitat: "Dark sheltered areas, woodpiles, under rocks",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=500&q=60",
    dangerLevel: DangerLevel.Dangerous,
    size: "8-13mm",
    region: ["North America", "South America"]
  },
  {
    id: 3,
    scientificName: "Loxosceles reclusa",
    commonName: "Brown Recluse",
    family: "Sicariidae",
    description: "Known for the violin-shaped marking on their thorax, they are reclusive and prefer dark areas.",
    habitat: "Indoor areas, closets, attics, cellars",
    imageUrl: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&w=500&q=60",
    dangerLevel: DangerLevel.Dangerous,
    size: "6-12mm",
    region: ["North America"]
  },
  {
    id: 4,
    scientificName: "Tegenaria domestica",
    commonName: "House Spider",
    family: "Agelenidae",
    description: "Common indoor spider that builds funnel-like webs in corners.",
    habitat: "Houses, garages, outbuildings",
    imageUrl: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=500&q=60",
    dangerLevel: DangerLevel.Harmless,
    size: "7-14mm",
    region: ["Europe", "North America", "Asia"]
  },
  {
    id: 5,
    scientificName: "Phidippus audax",
    commonName: "Bold Jumping Spider",
    family: "Salticidae",
    description: "Active hunters with excellent vision, known for their jumping ability.",
    habitat: "Gardens, woodlands, urban areas",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=500&q=60",
    dangerLevel: DangerLevel.Harmless,
    size: "8-15mm",
    region: ["North America"]
  },
  {
    id: 6,
    scientificName: "Araneus diadematus",
    commonName: "European Garden Spider",
    family: "Araneidae",
    description: "Also known as the cross spider, it has cross-shaped markings on its abdomen.",
    habitat: "Gardens, woodlands, fields",
    imageUrl: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?auto=format&fit=crop&w=500&q=60",
    dangerLevel: DangerLevel.Harmless,
    size: "6-20mm",
    region: ["Europe", "North America"]
  },
  {
    id: 7,
    scientificName: "Nephila clavipes",
    commonName: "Golden Silk Orb-Weaver",
    family: "Araneidae",
    description: "Known for their large, golden-colored webs which can span several meters.",
    habitat: "Forests, gardens, along trails",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=500&q=60",
    dangerLevel: DangerLevel.MildlyVenomous,
    size: "24-40mm",
    region: ["North America", "South America", "Caribbean"]
  }
];

// Function to search through the spider database
export const searchSpiders = (query: string): Spider[] => {
  const lowercaseQuery = query.toLowerCase();
  
  return spidersData.filter(spider => 
    spider.commonName.toLowerCase().includes(lowercaseQuery) ||
    spider.scientificName.toLowerCase().includes(lowercaseQuery) ||
    spider.family.toLowerCase().includes(lowercaseQuery) ||
    spider.description.toLowerCase().includes(lowercaseQuery) ||
    spider.habitat.toLowerCase().includes(lowercaseQuery)
  );
};

// Function to get a spider by its ID
export const getSpiderById = (id: number): Spider | undefined => {
  return spidersData.find(spider => spider.id === id);
};
