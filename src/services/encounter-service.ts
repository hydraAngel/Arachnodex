
import { Encounter } from "../types/spider";

const STORAGE_KEY = "spider-encounters";

// Get all encounters from local storage
export const getAllEncounters = (): Encounter[] => {
  const encountereJSON = localStorage.getItem(STORAGE_KEY);
  if (!encountereJSON) return [];
  
  try {
    const encounters = JSON.parse(encountereJSON);
    // Convert date strings back to Date objects
    return encounters.map((encounter: any) => ({
      ...encounter,
      date: new Date(encounter.date)
    }));
  } catch (error) {
    console.error("Error parsing encounters:", error);
    return [];
  }
};

// Save an encounter to local storage
export const saveEncounter = (encounter: Encounter): void => {
  const encounters = getAllEncounters();
  encounters.push(encounter);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encounters));
  } catch (error) {
    console.error("Error saving encounter:", error);
  }
};

// Get encounters for a specific spider
export const getEncountersBySpiderId = (spiderId: number): Encounter[] => {
  const encounters = getAllEncounters();
  return encounters.filter(encounter => encounter.spiderId === spiderId);
};

// Get a single encounter by its ID
export const getEncounterById = (id: string): Encounter | undefined => {
  const encounters = getAllEncounters();
  return encounters.find(encounter => encounter.id === id);
};

// Delete an encounter by its ID
export const deleteEncounter = (id: string): void => {
  const encounters = getAllEncounters();
  const filteredEncounters = encounters.filter(encounter => encounter.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEncounters));
  } catch (error) {
    console.error("Error deleting encounter:", error);
  }
};
