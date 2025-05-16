
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSpiderById } from "@/data/spiders-data";
import { saveEncounter } from "@/services/encounter-service";
import { Encounter, Spider } from "@/types/spider";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LogEncounter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spider, setSpider] = useState<Spider | null>(null);
  
  // Form state
  const [date, setDate] = useState<Date>(new Date());
  const [location, setLocation] = useState("");
  const [companions, setCompanions] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (id) {
      const spiderData = getSpiderById(Number(id));
      if (spiderData) {
        setSpider(spiderData);
      }
    }
  }, [id]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!spider || !location) {
      toast.error("Please fill in required fields");
      return;
    }

    // Create unique ID using timestamp
    const encounterId = `encounter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create new encounter object
    const newEncounter: Encounter = {
      id: encounterId,
      spiderId: spider.id,
      date: date,
      location: location,
      companions: companions.split(',').map(c => c.trim()).filter(c => c !== ""),
      notes: notes,
    };
    
    // Save to local storage
    saveEncounter(newEncounter);
    
    toast.success("Encounter logged successfully!");
    
    // Navigate to encounter details
    navigate(`/encounter/${encounterId}`);
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
        <div className="flex items-center mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/spider/${spider.id}`)} 
            className="mr-2"
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold text-spider-primary">Log Encounter</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Spider Info Card */}
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="h-40 overflow-hidden mb-4 rounded-md">
                  <img 
                    src={spider.imageUrl} 
                    alt={spider.commonName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-1">{spider.commonName}</h2>
                <p className="text-sm italic text-gray-600 mb-4">{spider.scientificName}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Encounter Form */}
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date of Encounter<span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location<span className="text-red-500">*</span></Label>
                  <Input 
                    id="location" 
                    placeholder="e.g., Backyard, Forest Trail, etc." 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                
                {/* Companions */}
                <div className="space-y-2">
                  <Label htmlFor="companions">Companions (comma separated)</Label>
                  <Input 
                    id="companions" 
                    placeholder="e.g., John, Sarah, etc."
                    value={companions}
                    onChange={(e) => setCompanions(e.target.value)} 
                  />
                </div>
                
                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Additional observations, behavior, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="pt-4 flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/spider/${spider.id}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-spider-primary hover:bg-spider-secondary"
                  >
                    Save Encounter
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LogEncounter;
