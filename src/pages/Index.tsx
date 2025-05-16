
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEncounters } from "@/services/encounter-service";
import { getSpiderById } from "@/data/spiders-data";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spider } from "@/types/spider";

const Index = () => {
  const navigate = useNavigate();
  const [recentEncounters, setRecentEncounters] = useState<{date: Date, spider: Spider | undefined}[]>([]);
  const [uniqueSpecies, setUniqueSpecies] = useState<number>(0);
  const [totalEncounters, setTotalEncounters] = useState<number>(0);

  useEffect(() => {
    const encounters = getAllEncounters();
    setTotalEncounters(encounters.length);

    // Get unique spider IDs
    const uniqueSpiderIds = new Set(encounters.map(e => e.spiderId));
    setUniqueSpecies(uniqueSpiderIds.size);

    // Get most recent encounters
    const sortedEncounters = [...encounters].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const recent = sortedEncounters.slice(0, 3).map(e => ({
      date: e.date,
      spider: getSpiderById(e.spiderId)
    }));

    setRecentEncounters(recent);
  }, []);

  return (
    <div className="min-h-screen bg-spider-background web-pattern">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-spider-primary mb-2">
            Welcome to Arachnodex
          </h1>
          <p className="text-lg text-gray-600">
            Track and document your spider encounters like a professional arachnologist!
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-2xl text-spider-primary">
                Species Discovered
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-4xl font-bold text-center">{uniqueSpecies}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/database')} className="w-full bg-spider-primary hover:bg-spider-secondary">
                Explore Database
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-2xl text-spider-primary">
                Total Encounters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-4xl font-bold text-center">{totalEncounters}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/encounters')} className="w-full bg-spider-primary hover:bg-spider-secondary">
                View Encounters
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-2xl text-spider-primary">
                Log New Encounter
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-center h-[60px]">
              <span className="text-5xl">🕸️</span>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/database')} className="w-full bg-spider-primary hover:bg-spider-secondary">
                Start Logging
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Recent Encounters Section */}
        <h2 className="text-2xl font-semibold text-spider-primary mb-4">Recent Sightings</h2>
        
        {recentEncounters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentEncounters.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => item.spider && navigate(`/spider/${item.spider.id}`)}>
                <div className="h-40 overflow-hidden">
                  {item.spider && (
                    <img 
                      src={item.spider.imageUrl} 
                      alt={item.spider.commonName} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">
                    {item.spider ? item.spider.commonName : "Unknown Spider"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Spotted: {item.date.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-lg text-gray-500">No encounters logged yet</p>
            <Button 
              onClick={() => navigate('/database')} 
              className="mt-4 bg-spider-primary hover:bg-spider-secondary"
            >
              Start Your Collection
            </Button>
          </div>
        )}
      </main>
      
      <footer className="bg-spider-primary text-white p-6 mt-10">
        <div className="container mx-auto text-center">
          <p>Arachnodex: Your Personal Spider Tracking App</p>
          <p className="text-sm mt-2">
            &copy; {new Date().getFullYear()} - All spider data is for educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
