
import { useState } from "react";
import { spidersData, searchSpiders } from "@/data/spiders-data";
import SpiderCard from "@/components/SpiderCard";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SpiderDatabase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpiders, setFilteredSpiders] = useState(spidersData);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = searchSpiders(searchQuery);
    setFilteredSpiders(results);
  };
  
  const handleReset = () => {
    setSearchQuery("");
    setFilteredSpiders(spidersData);
  };

  return (
    <div className="min-h-screen bg-spider-background">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-spider-primary mb-6">Spider Database</h1>
        
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, features, habitat..."
              className="pl-10 border-spider-primary focus:ring-spider-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            className="bg-spider-primary hover:bg-spider-secondary"
          >
            Search
          </Button>
          {searchQuery && (
            <Button 
              type="button" 
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
        </form>
        
        {filteredSpiders.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-xl text-gray-500">No spiders found matching "{searchQuery}"</p>
            <Button 
              onClick={handleReset} 
              className="mt-4 bg-spider-primary hover:bg-spider-secondary"
            >
              Show All Spiders
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600">
              Showing {filteredSpiders.length} species
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpiders.map((spider) => (
                <SpiderCard key={spider.id} spider={spider} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SpiderDatabase;
