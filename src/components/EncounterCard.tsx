
import { useNavigate } from "react-router-dom";
import { Encounter } from "@/types/spider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSpiderById } from "@/data/spiders-data";
import { format } from "date-fns";
import { CalendarIcon, MapPin, User } from "lucide-react";

interface EncounterCardProps {
  encounter: Encounter;
}

const EncounterCard: React.FC<EncounterCardProps> = ({ encounter }) => {
  const navigate = useNavigate();
  const spider = getSpiderById(encounter.spiderId);

  if (!spider) {
    return null;
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-4 pb-2 bg-spider-primary text-white">
        <CardTitle className="text-lg">{spider.commonName}</CardTitle>
        <div className="text-sm opacity-80">{format(encounter.date, "PPP")}</div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{encounter.location}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>{format(encounter.date, "PPPP")}</span>
        </div>
        
        {encounter.companions.length > 0 && (
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2" />
            <span>{encounter.companions.join(", ")}</span>
          </div>
        )}
        
        {encounter.notes && (
          <div className="text-sm mt-2">
            <p className="line-clamp-2">{encounter.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full text-spider-primary border-spider-primary hover:bg-spider-accent/10"
          onClick={() => navigate(`/encounter/${encounter.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EncounterCard;
