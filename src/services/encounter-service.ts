
import { Encounter } from "../types/spider";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = "spider-encounters";

// Check if we should use Supabase or fallback to localStorage
const useSupabase = (): boolean => {
  return !!supabase && !!supabase.auth.getSession;
};

// Get all encounters from Supabase or local storage
export const getAllEncounters = async (): Promise<Encounter[]> {
  if (useSupabase()) {
    try {
      const { data: currentSession } = await supabase.auth.getSession();
      if (!currentSession.session) return [];
      
      const { data, error } = await supabase
        .from('encounters')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      // Convert Supabase data to our Encounter type
      return data.map((encounter: any) => ({
        id: encounter.id,
        spiderId: encounter.spider_id,
        date: new Date(encounter.date),
        location: encounter.location,
        coordinates: encounter.coordinates,
        companions: encounter.companions || [],
        notes: encounter.notes || '',
        photos: encounter.photos || [],
      }));
    } catch (error) {
      console.error("Error fetching encounters:", error);
      return [];
    }
  } else {
    // Fallback to localStorage
    const encounterJSON = localStorage.getItem(STORAGE_KEY);
    if (!encounterJSON) return [];
    
    try {
      const encounters = JSON.parse(encounterJSON);
      // Convert date strings back to Date objects
      return encounters.map((encounter: any) => ({
        ...encounter,
        date: new Date(encounter.date)
      }));
    } catch (error) {
      console.error("Error parsing encounters:", error);
      return [];
    }
  }
};

// Save an encounter to Supabase or local storage
export const saveEncounter = async (encounter: Encounter): Promise<void> {
  if (useSupabase()) {
    try {
      const { data: currentSession } = await supabase.auth.getSession();
      if (!currentSession.session) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('encounters')
        .insert({
          id: encounter.id || uuidv4(),
          user_id: currentSession.session.user.id,
          spider_id: encounter.spiderId,
          date: encounter.date.toISOString(),
          location: encounter.location,
          coordinates: encounter.coordinates || null,
          companions: encounter.companions || [],
          notes: encounter.notes || '',
          photos: encounter.photos || [],
        });
        
      if (error) throw error;
    } catch (error) {
      console.error("Error saving encounter:", error);
    }
  } else {
    // Fallback to localStorage
    const encounters = await getAllEncounters();
    encounters.push(encounter);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(encounters));
    } catch (error) {
      console.error("Error saving encounter:", error);
    }
  }
};

// Get encounters for a specific spider
export const getEncountersBySpiderId = async (spiderId: number): Promise<Encounter[]> {
  const encounters = await getAllEncounters();
  return encounters.filter(encounter => encounter.spiderId === spiderId);
};

// Get a single encounter by its ID
export const getEncounterById = async (id: string): Promise<Encounter | undefined> {
  if (useSupabase()) {
    try {
      const { data, error } = await supabase
        .from('encounters')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        return {
          id: data.id,
          spiderId: data.spider_id,
          date: new Date(data.date),
          location: data.location,
          coordinates: data.coordinates,
          companions: data.companions || [],
          notes: data.notes || '',
          photos: data.photos || [],
        };
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching encounter:", error);
      return undefined;
    }
  } else {
    // Fallback to localStorage
    const encounters = await getAllEncounters();
    return encounters.find(encounter => encounter.id === id);
  }
};

// Delete an encounter by its ID
export const deleteEncounter = async (id: string): Promise<void> {
  if (useSupabase()) {
    try {
      const { error } = await supabase
        .from('encounters')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting encounter:", error);
    }
  } else {
    // Fallback to localStorage
    const encounters = await getAllEncounters();
    const filteredEncounters = encounters.filter(encounter => encounter.id !== id);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEncounters));
    } catch (error) {
      console.error("Error deleting encounter:", error);
    }
  }
};
