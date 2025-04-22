"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Moon, Sun, LogOut, Key, User, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/Mainlayout";

export default function SettingsPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder user data (would come from Supabase in real app)
  const [user, setUser] = useState({
    email: "user@example.com",
    name: "Cosmic Explorer",
  });

  // API Key state (would be stored in Supabase in real app)
  const [apiKey, setApiKey] = useState("");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("light");

    // toast({
    //   title: `Theme changed to ${isDarkMode ? "light" : "dark"} mode`,
    //   description: "Your preference has been saved",
    // });
  };

  //   const handleSignOut = async () => {
  //     setIsLoading(true);
  //     try {
  //       await supabase.auth.signOut();
  //       toast({
  //         title: "Signed out successfully",
  //         description: "You have been signed out of your account",
  //       });
  //       navigate("/login");
  //     } catch (error) {
  //       toast({
  //         title: "Error signing out",
  //         description: "Please try again",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const saveAPIKey = () => {
    //     toast({
    //       title: "API Key saved",
    //       description: "Your AI service API key has been saved",
    //     });
    //   };
    //   const updateProfile = () => {
    //     toast({
    //       title: "Profile updated",
    //       description: "Your profile information has been updated",
    //     });
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glow mb-2 flex items-center">
          <Settings className="h-6 w-6 mr-2" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your NebulaNotes experience
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed directly. Please contact
                  support.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="space-gradient">Save Changes</Button>
          </CardFooter>
        </Card>

        {/* Appearance */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              Appearance
            </CardTitle>
            <CardDescription>Customize how NebulaNotes looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between dark and light themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Integration */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              AI Integration
            </CardTitle>
            <CardDescription>
              Configure your AI service for note summarization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="api-key">AI Service API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <p className="text-xs text-muted-foreground">
                The API key is stored securely and used for AI-powered note
                summarization.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveAPIKey} className="space-gradient">
              <Key className="mr-2 h-4 w-4" />
              Save API Key
            </Button>
          </CardFooter>
        </Card>

        {/* Account Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              Account Actions
            </CardTitle>
            <CardDescription>
              Manage your account data and sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>

              <Separator />

              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove all your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
