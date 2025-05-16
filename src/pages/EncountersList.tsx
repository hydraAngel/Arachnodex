
import { useState, useEffect } from "react";
import { getAllEncounters } from "@/services/encounter-service";
import { Encounter } from "@/types/spider";
import { getSpiderById } from "@/data/spiders-data";
import NavBar from "@/components/NavBar";
import EncounterCard from "@/components/EncounterCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const EncountersList = () => {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [filteredEncounters, setFilteredEncounters] = useState<Encounter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allEncounters = getAllEncounters();
    // Sort by date, newest first
    const sortedEncounters = [...allEncounters].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setEncounters(sortedEncounters);
    setFilteredEncounters(sortedEncounters);
  }, []);

  // Filter encounters based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEncounters(encounters);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = encounters.filter(encounter => {
      const spider = getSpiderById(encounter.spiderId);
      
      // Search in spider name
      if (spider && (
        spider.commonName.toLowerCase().includes(query) || 
        spider.scientificName.toLowerCase().includes(query)
      )) {
        return true;
      }
      
      // Search in location
      if (encounter.location.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in companions
      if (encounter.companions.some(companion => 
        companion.toLowerCase().includes(query)
      )) {
        return true;
      }
      
      // Search in notes
      if (encounter.notes && encounter.notes.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    });
    
    setFilteredEncounters(filtered);
  }, [searchQuery, encounters]);

  return (
    <div className="min-h-screen bg-spider-background">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-spider-primary mb-6">My Encounters</h1>
        
        {/* Search */}
        <div className="mb-8">
          <Label htmlFor="search" className="mb-2 block">Search Encounters</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              type="text"
              placeholder="Search by spider name, location, or companions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {encounters.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-xl text-gray-500">You haven't logged any encounters yet</p>
            <p className="text-gray-400 mt-2">Go to the spider database to start logging encounters</p>
          </div>
        ) : filteredEncounters.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-xl text-gray-500">No encounters found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEncounters.map((encounter) => (
              <EncounterCard key={encounter.id} encounter={encounter} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EncountersList;
