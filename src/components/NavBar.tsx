
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllEncounters } from "@/services/encounter-service";

const NavBar = () => {
  const navigate = useNavigate();
  const [encounterCount, setEncounterCount] = useState(0);
  
  useEffect(() => {
    const encounters = getAllEncounters();
    setEncounterCount(encounters.length);
  }, []);

  return (
    <nav className="bg-spider-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="text-xl font-bold flex items-center">
            <span className="text-2xl mr-2">🕷️</span>
            <h1 onClick={() => navigate('/')} className="cursor-pointer">Arachnodex</h1>
          </div>
          <div className="ml-4 text-sm text-spider-accent">
            <span>{encounterCount} Encounters Logged</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="secondary" 
            className="bg-spider-secondary hover:bg-spider-accent text-white"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          <Button 
            variant="secondary" 
            className="bg-spider-secondary hover:bg-spider-accent text-white"
            onClick={() => navigate('/database')}
          >
            Spider Database
          </Button>
          <Button 
            variant="secondary" 
            className="bg-spider-secondary hover:bg-spider-accent text-white"
            onClick={() => navigate('/encounters')}
          >
            My Encounters
          </Button>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-spider-primary"
            onClick={() => navigate('/database')}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
