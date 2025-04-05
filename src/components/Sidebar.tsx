import {
  Calendar,
  LayoutDashboard,
  ListTodo,
  Clock,
  Settings,
  User,
  Menu,
  Wallet,
  BarChart,
  StickyNote,
} from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: Calendar,
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: ListTodo,
  },
  {
    title: "Notes",
    path: "/notes",
    icon: StickyNote,
  },
  {
    title: "Focus Time",
    path: "/focus",
    icon: Clock,
  },
  {
    title: "Expense Tracker",
    path: "/expense-tracker",
    icon: Wallet,
  },
  {
    title: "Analysis",
    path: "/analysis",
    icon: BarChart,
  },
];

const Sidebar = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-calendar" />
          <h1 className="text-lg font-semibold">Smart Calendar</h1>
        </div>
        {isMobile && (
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
