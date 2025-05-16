
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpiderById } from "@/data/spiders-data";
import { getEncountersBySpiderId } from "@/services/encounter-service";
import { Spider, Encounter } from "@/types/spider";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import EncounterCard from "@/components/EncounterCard";

const SpiderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spider, setSpider] = useState<Spider | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const spiderData = getSpiderById(Number(id));
        if (spiderData) {
          setSpider(spiderData);
          const spiderEncounters = await getEncountersBySpiderId(Number(id));
          setEncounters(spiderEncounters);
        }
      }
    };
    
    fetchData();
  }, [id]);

  // Define the color of the danger badge based on the danger level
  const getDangerColor = () => {
    if (!spider) return "";

    switch (spider.dangerLevel) {
      case "Harmless":
        return "bg-green-500";
      case "Mildly Venomous":
        return "bg-yellow-500";
      case "Venomous":
        return "bg-orange-500";
      case "Dangerous":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!spider) {
    return (
      <div className="min-h-screen bg-spider-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Spider not found</p>
          <Button 
            onClick={() => navigate('/database')} 
            className="mt-4 bg-spider-primary hover:bg-spider-secondary"
          >
            Back to Database
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spider-background">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Spider Info */}
          <div className="md:w-2/3">
            <div className="flex items-center mb-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/database')} 
                className="mr-2"
              >
                Back to Database
              </Button>
              <h1 className="text-3xl font-bold text-spider-primary">{spider.commonName}</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-64 md:h-80">
                <img 
                  src={spider.imageUrl} 
                  alt={spider.commonName} 
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className={`${getDangerColor()} absolute top-4 right-4 text-base px-3 py-1`}
                >
                  {spider.dangerLevel}
                </Badge>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Scientific Classification</h2>
                  <p className="italic text-lg">{spider.scientificName}</p>
                  <p>Family: {spider.family}</p>
                </div>
                
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p>{spider.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold">Habitat</h3>
                    <p>{spider.habitat}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Size</h3>
                    <p>{spider.size}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Regions</h3>
                  <div className="flex flex-wrap gap-2">
                    {spider.region.map(region => (
                      <Badge key={region} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate(`/log-encounter/${spider.id}`)} 
                  className="w-full bg-spider-primary hover:bg-spider-secondary text-white mt-4"
                >
                  Log New Encounter
                </Button>
              </div>
            </div>
          </div>
          
          {/* Encounters Column */}
          <div className="md:w-1/3">
            <Card className="bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Encounters</h2>
                
                {encounters.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-gray-300 rounded-lg">
                    <p>You haven't encountered this spider yet</p>
                    <Button 
                      onClick={() => navigate(`/log-encounter/${spider.id}`)} 
                      className="mt-4 bg-spider-primary hover:bg-spider-secondary text-white"
                    >
                      Log First Encounter
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-2">
                      You've recorded {encounters.length} encounter{encounters.length !== 1 ? 's' : ''} with this species
                    </p>
                    
                    {encounters.map(encounter => (
                      <EncounterCard key={encounter.id} encounter={encounter} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpiderDetails;
