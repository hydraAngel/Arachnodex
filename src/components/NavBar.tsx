
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, LogOut, User, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllEncounters } from "@/services/encounter-service";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NavBar = () => {
  const navigate = useNavigate();
  const [encounterCount, setEncounterCount] = useState(0);
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const fetchEncounters = async () => {
      try {
        const encounters = await getAllEncounters();
        setEncounterCount(encounters.length);
      } catch (error) {
        console.error("Error fetching encounters:", error);
      }
    };
    
    if (user) {
      fetchEncounters();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Home", action: () => navigate('/') },
    { name: "Spider Database", action: () => navigate('/database') },
    { name: "My Encounters", action: () => navigate('/encounters') },
  ];

  return (
    <nav className="bg-spider-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex w-full md:w-auto items-center justify-between mb-4 md:mb-0">
          <div className="text-xl font-bold flex items-center">
            <span className="text-2xl mr-2">🕷️</span>
            <h1 onClick={() => navigate('/')} className="cursor-pointer">Arachnodex</h1>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="text-sm text-spider-accent mr-2">
              <span>{encounterCount} Encounters</span>
            </div>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-spider-primary text-white border-l border-spider-secondary w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 pt-6">
                  {navItems.map((item) => (
                    <Button 
                      key={item.name}
                      variant="ghost" 
                      className="justify-start text-white hover:bg-spider-secondary"
                      onClick={() => {
                        item.action();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                  <Button 
                    variant="ghost"
                    className="justify-start text-white hover:bg-spider-secondary"
                    onClick={() => {
                      navigate('/database');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <div className="mt-4 pt-4 border-t border-spider-secondary">
                    <div className="px-4 py-2 text-sm text-spider-accent">
                      {user?.email?.split('@')[0] || 'Account'}
                    </div>
                    <Button 
                      variant="ghost"
                      className="justify-start text-red-300 hover:text-red-100 hover:bg-red-900/30 w-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="md:ml-4 text-sm text-spider-accent hidden md:block">
            <span>{encounterCount} Encounters Logged</span>
          </div>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-4 items-center">
          {navItems.map((item) => (
            <Button 
              key={item.name}
              variant="secondary" 
              className="bg-spider-secondary hover:bg-spider-accent text-white"
              onClick={item.action}
            >
              {item.name}
            </Button>
          ))}
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-spider-primary"
            onClick={() => navigate('/database')}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white hover:bg-gray-100 text-spider-primary">
                <User className="h-4 w-4 mr-2" />
                {user?.email?.split('@')[0] || 'Account'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
