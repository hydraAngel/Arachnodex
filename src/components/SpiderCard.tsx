
import { useNavigate } from "react-router-dom";
import { Spider } from "@/types/spider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpiderCardProps {
  spider: Spider;
}

const SpiderCard: React.FC<SpiderCardProps> = ({ spider }) => {
  const navigate = useNavigate();

  // Define the color of the danger badge based on the danger level
  const getDangerColor = () => {
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

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-web-appear web-animation">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={spider.imageUrl} 
            alt={spider.commonName} 
            className="w-full h-full object-cover"
          />
          <Badge className={`${getDangerColor()} absolute top-2 right-2`}>
            {spider.dangerLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold">{spider.commonName}</CardTitle>
        <div className="text-sm text-gray-500 italic mb-2">{spider.scientificName}</div>
        <CardDescription className="line-clamp-3">{spider.description}</CardDescription>
        <div className="mt-3 flex flex-wrap gap-1">
          {spider.region.map((region) => (
            <Badge key={region} variant="outline" className="text-xs">
              {region}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="outline" 
          className="text-spider-primary border-spider-primary hover:bg-spider-accent/10"
          onClick={() => navigate(`/spider/${spider.id}`)}
        >
          Details
        </Button>
        <Button 
          onClick={() => navigate(`/log-encounter/${spider.id}`)}
          className="bg-spider-primary hover:bg-spider-secondary text-white"
        >
          Log Encounter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpiderCard;
