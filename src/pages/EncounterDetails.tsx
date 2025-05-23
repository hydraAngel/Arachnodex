
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEncounterById, deleteEncounter } from "@/services/encounter-service";
import { getSpiderById } from "@/data/spiders-data";
import { Encounter, Spider } from "@/types/spider";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { CalendarIcon, MapPin, User, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const EncounterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [spider, setSpider] = useState<Spider | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchEncounter = async () => {
      if (id) {
        try {
          const encounterData = await getEncounterById(id);
          if (encounterData) {
            setEncounter(encounterData);
            
            const spiderData = getSpiderById(encounterData.spiderId);
            if (spiderData) {
              setSpider(spiderData);
            }
          }
        } catch (error) {
          console.error("Error fetching encounter:", error);
        }
      }
    };
    
    fetchEncounter();
  }, [id]);

  const handleDelete = async () => {
    if (id) {
      await deleteEncounter(id);
      toast.success("Encounter deleted successfully");
      navigate("/encounters");
    }
  };

  if (!encounter || !spider) {
    return (
      <div className="min-h-screen bg-spider-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Encounter not found</p>
          <Button 
            onClick={() => navigate('/encounters')} 
            className="mt-4 bg-spider-primary hover:bg-spider-secondary"
          >
            Back to Encounters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spider-background">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Spider Info */}
          <div className="w-full lg:w-1/3 order-2 lg:order-1">
            <Card className="overflow-hidden">
              <div className="h-48 sm:h-56 overflow-hidden">
                <img 
                  src={spider.imageUrl} 
                  alt={spider.commonName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-1">{spider.commonName}</h2>
                <p className="text-sm italic text-gray-600 mb-4">{spider.scientificName}</p>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    onClick={() => navigate(`/spider/${spider.id}`)}
                    className="flex-1 bg-spider-primary hover:bg-spider-secondary"
                  >
                    Spider Details
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/log-encounter/${spider.id}`)}
                    className="flex-1 text-spider-primary border-spider-primary"
                  >
                    New Encounter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Encounter Details */}
          <div className="w-full lg:w-2/3 order-1 lg:order-2">
            <div className="flex items-center mb-4 justify-between">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/encounters')} 
                  className="mr-2"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <h1 className="text-xl sm:text-3xl font-bold text-spider-primary">Encounter Details</h1>
              </div>
              <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Encounter</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this encounter? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2">
                    <Button variant="outline" onClick={() => setConfirmDelete(false)} className="sm:order-1">Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete} className="sm:order-2">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">When</div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-spider-primary" />
                      <span className="text-base sm:text-lg">{format(new Date(encounter.date), "PPP")}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Where</div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-spider-primary" />
                      <span className="text-base sm:text-lg break-words">{encounter.location}</span>
                    </div>
                  </div>
                </div>
                
                {encounter.companions && encounter.companions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">With Who</div>
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-spider-primary" />
                      <div className="flex flex-wrap gap-2">
                        {encounter.companions.map((companion, index) => (
                          <Badge key={index} variant="secondary">{companion}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {encounter.notes && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Notes</div>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-md text-sm sm:text-base">
                      {encounter.notes}
                    </div>
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

export default EncounterDetails;
