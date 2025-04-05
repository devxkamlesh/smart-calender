
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Building, MapPin, Clock } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-muted-foreground">john.doe@example.com</p>
              
              <div className="mt-4 w-full">
                <Button variant="outline" className="w-full mb-2">
                  Change Profile Picture
                </Button>
              </div>
              
              <div className="mt-6 w-full space-y-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">Acme Corporation</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">Pacific Time (PT)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="First Name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Last Name" defaultValue="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email" defaultValue="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company" defaultValue="Acme Corporation" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select id="timezone" className="w-full p-2 rounded-md border border-input">
                      <option value="pt" selected>Pacific Time (GMT-8)</option>
                      <option value="mt">Mountain Time (GMT-7)</option>
                      <option value="ct">Central Time (GMT-6)</option>
                      <option value="et">Eastern Time (GMT-5)</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="bg-calendar hover:bg-calendar-focus">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>
                Set your typical working hours for better scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-days">Working Days</Label>
                    <select id="work-days" className="w-full p-2 rounded-md border border-input" multiple>
                      <option value="monday" selected>Monday</option>
                      <option value="tuesday" selected>Tuesday</option>
                      <option value="wednesday" selected>Wednesday</option>
                      <option value="thursday" selected>Thursday</option>
                      <option value="friday" selected>Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Working Hours</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="work-start" className="text-xs text-muted-foreground">Start</Label>
                        <Input 
                          id="work-start" 
                          type="time" 
                          defaultValue="09:00" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="work-end" className="text-xs text-muted-foreground">End</Label>
                        <Input 
                          id="work-end" 
                          type="time" 
                          defaultValue="17:00" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Focus Hours</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Set your preferred focus time when you're most productive
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <Label htmlFor="focus-day" className="text-xs text-muted-foreground">Day</Label>
                      <select id="focus-day" className="w-full p-2 rounded-md border border-input">
                        <option value="everyday">Every day</option>
                        <option value="monday" selected>Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="focus-start" className="text-xs text-muted-foreground">Start</Label>
                      <Input 
                        id="focus-start" 
                        type="time" 
                        defaultValue="09:00" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="focus-end" className="text-xs text-muted-foreground">End</Label>
                      <Input 
                        id="focus-end" 
                        type="time" 
                        defaultValue="12:00" 
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm" className="mb-0.5 w-full">
                        Add Time
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="bg-calendar hover:bg-calendar-focus">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
