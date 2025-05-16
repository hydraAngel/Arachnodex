
import { Spider, DangerLevel } from "@/types/spider";

// Base URL for the NinjaAPI for animals
const NINJA_API_URL = "https://api.api-ninjas.com/v1/animals?name=";
// Unsplash API for getting high-quality photos
const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

// Define the structure of the response from the Animals API
interface AnimalApiResponse {
  name: string;
  taxonomy: {
    family: string;
    scientific_name: string;
  };
  characteristics: {
    prey: string;
    habitat: string;
    main_prey: string;
    distinctive_feature: string;
    temperament: string;
    location: string;
  };
}

// Function to determine danger level based on animal characteristics
const determineDangerLevel = (animal: AnimalApiResponse): DangerLevel => {
  const temperament = animal.characteristics.temperament?.toLowerCase() || "";
  const isVenomous = animal.name.toLowerCase().includes("venomous") ||
                     (animal.characteristics.distinctive_feature || "").toLowerCase().includes("venom");
  
  if (
    temperament.includes("aggressive") || 
    temperament.includes("dangerous") || 
    animal.name.toLowerCase().includes("deadly") ||
    isVenomous
  ) {
    return DangerLevel.Dangerous;
  } else if (isVenomous) {
    return DangerLevel.Venomous;
  } else if (
    temperament.includes("mild") || 
    temperament.includes("timid")
  ) {
    return DangerLevel.MildlyVenomous;
  } else {
    return DangerLevel.Harmless;
  }
};

// Function to get regions from location string
const parseRegions = (location: string): string[] => {
  if (!location) return ["Unknown"];
  
  // Split by commas and clean up each region
  return location
    .split(",")
    .map(region => region.trim())
    .filter(region => region.length > 0);
};

// Function to get a spider photo from Unsplash
export const getSpiderPhoto = async (spiderName: string): Promise<string> => {
  try {
    // Check for environment variables (normally would be in .env)
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.warn("Unsplash API key not found, using placeholder image");
      return "https://images.unsplash.com/photo-1567563549378-36d2da7360b3?auto=format&fit=crop&w=800&q=80"; // Default spider image
    }
    
    // Query Unsplash for the spider image
    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(spiderName + " spider")}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      // Fallback to default image if no results
      return "https://images.unsplash.com/photo-1567563549378-36d2da7360b3?auto=format&fit=crop&w=800&q=80";
    }
  } catch (error) {
    console.error("Error fetching spider photo:", error);
    return "https://images.unsplash.com/photo-1567563549378-36d2da7360b3?auto=format&fit=crop&w=800&q=80";
  }
};

// Function to get spider data from API
export const fetchSpidersData = async (): Promise<Spider[]> => {
  try {
    // Check for environment variables (normally would be in .env)
    const apiKey = import.meta.env.VITE_NINJA_API_KEY;
    if (!apiKey) {
      console.warn("API key not found, falling back to local data");
      throw new Error("API key not found");
    }
    
    // Spider species to fetch
    const spiderSpecies = [
      "tarantula", "wolf spider", "jumping spider", "orb weaver", 
      "black widow", "brown recluse", "funnel-web", "huntsman spider"
    ];
    
    // Create promises for all species
    const spiderPromises = spiderSpecies.map(async (species, index) => {
      try {
        // Fetch from Animals API
        const response = await fetch(`${NINJA_API_URL}${encodeURIComponent(species)}`, {
          headers: {
            'X-Api-Key': apiKey
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data: AnimalApiResponse[] = await response.json();
        
        // Find the most relevant spider data from the response
        const spiderData = data.find(animal => 
          animal.name.toLowerCase().includes("spider") || 
          animal.taxonomy.scientific_name.toLowerCase().includes("aranea")
        ) || data[0];
        
        if (!spiderData) {
          throw new Error(`No data found for ${species}`);
        }
        
        // Get a photo for the spider
        const imageUrl = await getSpiderPhoto(species);
        
        // Map API data to our Spider type
        return {
          id: index + 1,
          scientificName: spiderData.taxonomy.scientific_name || "Unknown",
          commonName: spiderData.name || species,
          family: spiderData.taxonomy.family || "Araneidae",
          description: `${spiderData.characteristics?.distinctive_feature || ""}`,
          habitat: spiderData.characteristics?.habitat || "Various habitats",
          imageUrl,
          dangerLevel: determineDangerLevel(spiderData),
          size: "Medium", // API doesn't provide reliable size data
          region: parseRegions(spiderData.characteristics?.location || ""),
        };
      } catch (error) {
        console.error(`Error fetching data for ${species}:`, error);
        // Return a fallback spider with the species name
        return {
          id: index + 1,
          scientificName: `Araneae ${species.replace(" ", " ")}`,
          commonName: species.charAt(0).toUpperCase() + species.slice(1),
          family: "Araneidae",
          description: "A common species of spider.",
          habitat: "Various habitats",
          imageUrl: await getSpiderPhoto(species),
          dangerLevel: DangerLevel.Harmless,
          size: "Medium",
          region: ["Unknown"],
        };
      }
    });
    
    // Wait for all promises to resolve
    return Promise.all(spiderPromises);
  } catch (error) {
    console.error("Error fetching spiders data, using local data:", error);
    // Import and return local data when API fails
    const { spidersData } = await import("@/data/spiders-data");
    return spidersData;
  }
};
