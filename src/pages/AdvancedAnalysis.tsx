
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  BarChart as BarChartIcon,
  TrendingUp,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Calendar as CalendarIcon,
  Clock,
  ListTodo,
  Wallet,
  CheckSquare,
  AlertCircle,
  Clock3,
  Tag
} from 'lucide-react';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const timeData = [
  { date: '2025-03-01', focus: 3.5, meetings: 2, tasks: 8 },
  { date: '2025-03-02', focus: 2.5, meetings: 3, tasks: 6 },
  { date: '2025-03-03', focus: 4, meetings: 1, tasks: 7 },
  { date: '2025-03-04', focus: 3, meetings: 4, tasks: 5 },
  { date: '2025-03-05', focus: 5, meetings: 2, tasks: 9 },
  { date: '2025-03-06', focus: 2, meetings: 3, tasks: 4 },
  { date: '2025-03-07', focus: 1.5, meetings: 5, tasks: 3 },
  { date: '2025-03-08', focus: 3, meetings: 2, tasks: 7 },
  { date: '2025-03-09', focus: 4.5, meetings: 1, tasks: 10 },
  { date: '2025-03-10', focus: 3.5, meetings: 3, tasks: 8 },
  { date: '2025-03-11', focus: 2, meetings: 4, tasks: 5 },
  { date: '2025-03-12', focus: 4, meetings: 2, tasks: 6 },
  { date: '2025-03-13', focus: 5, meetings: 1, tasks: 9 },
  { date: '2025-03-14', focus: 3, meetings: 3, tasks: 7 },
  { date: '2025-03-15', focus: 1, meetings: 5, tasks: 4 },
  { date: '2025-03-16', focus: 2.5, meetings: 2, tasks: 6 },
  { date: '2025-03-17', focus: 4.5, meetings: 1, tasks: 8 },
  { date: '2025-03-18', focus: 3.5, meetings: 3, tasks: 7 },
  { date: '2025-03-19', focus: 2, meetings: 4, tasks: 5 },
  { date: '2025-03-20', focus: 4, meetings: 2, tasks: 9 },
  { date: '2025-03-21', focus: 5, meetings: 1, tasks: 10 },
  { date: '2025-03-22', focus: 3, meetings: 3, tasks: 6 },
  { date: '2025-03-23', focus: 1.5, meetings: 5, tasks: 4 },
  { date: '2025-03-24', focus: 3, meetings: 2, tasks: 7 },
  { date: '2025-03-25', focus: 4.5, meetings: 1, tasks: 8 },
  { date: '2025-03-26', focus: 3.5, meetings: 3, tasks: 7 },
  { date: '2025-03-27', focus: 2, meetings: 4, tasks: 5 },
  { date: '2025-03-28', focus: 4, meetings: 2, tasks: 6 },
  { date: '2025-03-29', focus: 5, meetings: 1, tasks: 9 },
  { date: '2025-03-30', focus: 3, meetings: 3, tasks: 8 },
  { date: '2025-03-31', focus: 2.5, meetings: 2, tasks: 7 },
  { date: '2025-04-01', focus: 4, meetings: 3, tasks: 9 },
  { date: '2025-04-02', focus: 3.5, meetings: 2, tasks: 8 },
  { date: '2025-04-03', focus: 5, meetings: 1, tasks: 10 },
  { date: '2025-04-04', focus: 2, meetings: 4, tasks: 6 },
];

const categoryData = [
  { name: 'Focus Time', value: 25, color: '#8884d8' },
  { name: 'Meetings', value: 18, color: '#82ca9d' },
  { name: 'Administrative', value: 12, color: '#ffc658' },
  { name: 'Learning', value: 8, color: '#ff8042' },
  { name: 'Planning', value: 15, color: '#0088fe' },
  { name: 'Breaks', value: 10, color: '#00C49F' },
  { name: 'Untracked', value: 12, color: '#FFBB28' },
];

const expenseData = [
  { category: 'Housing', amount: 1200, color: '#8884d8' },
  { category: 'Food', amount: 450, color: '#82ca9d' },
  { category: 'Transportation', amount: 200, color: '#ffc658' },
  { category: 'Entertainment', amount: 150, color: '#ff8042' },
  { category: 'Healthcare', amount: 180, color: '#0088fe' },
  { category: 'Utilities', amount: 250, color: '#00C49F' },
  { category: 'Other', amount: 300, color: '#FFBB28' },
];

const productivityByHour = [
  { hour: '6 AM', productivity: 60 },
  { hour: '7 AM', productivity: 70 },
  { hour: '8 AM', productivity: 90 },
  { hour: '9 AM', productivity: 95 },
  { hour: '10 AM', productivity: 100 },
  { hour: '11 AM', productivity: 90 },
  { hour: '12 PM', productivity: 70 },
  { hour: '1 PM', productivity: 60 },
  { hour: '2 PM', productivity: 75 },
  { hour: '3 PM', productivity: 85 },
  { hour: '4 PM', productivity: 80 },
  { hour: '5 PM', productivity: 65 },
  { hour: '6 PM', productivity: 50 },
  { hour: '7 PM', productivity: 40 },
  { hour: '8 PM', productivity: 35 },
];

const taskCompletionByDay = [
  { day: 'Monday', completed: 12, pending: 3 },
  { day: 'Tuesday', completed: 15, pending: 2 },
  { day: 'Wednesday', completed: 10, pending: 5 },
  { day: 'Thursday', completed: 8, pending: 7 },
  { day: 'Friday', completed: 9, pending: 4 },
  { day: 'Saturday', completed: 5, pending: 2 },
  { day: 'Sunday', completed: 3, pending: 1 },
];

const tasksByPriority = [
  { priority: 'High', count: 5, color: '#ef4444' },
  { priority: 'Medium', count: 12, color: '#f59e0b' },
  { priority: 'Low', count: 8, color: '#3b82f6' },
];

const tasksByStatus = [
  { status: 'Completed', count: 18, color: '#22c55e' },
  { status: 'In Progress', count: 7, color: '#9b87f5' },
];

const taskCompletionTrend = [
  { date: '2025-03-28', completed: 3, added: 4 },
  { date: '2025-03-29', completed: 5, added: 2 },
  { date: '2025-03-30', completed: 2, added: 3 },
  { date: '2025-03-31', completed: 4, added: 1 },
  { date: '2025-04-01', completed: 6, added: 3 },
  { date: '2025-04-02', completed: 3, added: 5 },
  { date: '2025-04-03', completed: 4, added: 2 },
  { date: '2025-04-04', completed: 5, added: 3 },
];

const taskCategories = [
  { category: 'Work', count: 12, color: '#9b87f5' },
  { category: 'Personal', count: 8, color: '#f97316' },
  { category: 'Health', count: 5, color: '#22c55e' },
  { category: 'Learning', count: 7, color: '#3b82f6' },
  { category: 'Home', count: 4, color: '#ec4899' },
];

const dueDateAnalysis = [
  { status: 'Overdue', count: 3, color: '#ef4444' },
  { status: 'Due Today', count: 2, color: '#f59e0b' },
  { status: 'Due This Week', count: 8, color: '#9b87f5' },
  { status: 'Due Next Week', count: 5, color: '#3b82f6' },
  { status: 'Later', count: 7, color: '#22c55e' },
  { status: 'No Due Date', count: 4, color: '#94a3b8' },
];

const InsightCard = ({ icon: Icon, title, value, description, trend, trendValue }: {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          <Icon className="h-5 w-5 mr-2 text-calendar" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center ${
              trend === 'up' 
                ? 'text-green-600' 
                : trend === 'down' 
                  ? 'text-red-600' 
                  : 'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
              {trend === 'down' && <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />}
              {trendValue && <span className="text-xs font-medium">{trendValue}</span>}
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdvancedAnalysis: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [analysisType, setAnalysisType] = useState<string>('productivity');
  
  const filteredTimeData = timeRange === 'week' 
    ? timeData.slice(-7) 
    : timeRange === 'month' 
      ? timeData.slice(-30) 
      : timeData;

  const renderInsightCards = () => {
    if (analysisType === 'productivity') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InsightCard 
            icon={Clock} 
            title="Focus Time"
            value="24.5 hours"
            description="compared to last week"
            trend="up"
            trendValue="+15%"
          />
          <InsightCard 
            icon={ListTodo} 
            title="Tasks Completed"
            value="38 tasks"
            description="this week"
            trend="up"
            trendValue="+8%"
          />
          <InsightCard 
            icon={CalendarIcon} 
            title="Meeting Time"
            value="12.3 hours"
            description="compared to last week"
            trend="down"
            trendValue="-5%"
          />
          <InsightCard 
            icon={BarChartIcon} 
            title="Productivity Score"
            value="8.5/10"
            description="based on your activity"
            trend="up"
            trendValue="+0.7"
          />
        </div>
      );
    } else if (analysisType === 'finance') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InsightCard 
            icon={Wallet} 
            title="Total Expenses"
            value="$2,730"
            description="this month"
            trend="down"
            trendValue="-8%"
          />
          <InsightCard 
            icon={TrendingUp} 
            title="Savings Rate"
            value="24%"
            description="of income"
            trend="up"
            trendValue="+3%"
          />
          <InsightCard 
            icon={BarChartIcon} 
            title="Biggest Category"
            value="Housing"
            description="of monthly expenses"
            trend="neutral"
          />
          <InsightCard 
            icon={LineChartIcon} 
            title="Expense Trend"
            value="Decreasing"
            description="over last 3 months"
            trend="down"
            trendValue="-5%"
          />
        </div>
      );
    } else if (analysisType === 'tasks') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InsightCard 
            icon={CheckSquare} 
            title="Task Completion"
            value="75%"
            description="completion rate"
            trend="up"
            trendValue="+12%"
          />
          <InsightCard 
            icon={AlertCircle} 
            title="High Priority"
            value="5 tasks"
            description="require attention"
            trend="down"
            trendValue="-2"
          />
          <InsightCard 
            icon={Clock3} 
            title="Overdue"
            value="3 tasks"
            description="past due date"
            trend="down"
            trendValue="-1"
          />
          <InsightCard 
            icon={Tag} 
            title="Most Common"
            value="Work"
            description="task category"
            trend="neutral"
          />
        </div>
      );
    }
  };

  return (
    <div className="advanced-analysis">
      <h1 className="text-2xl font-bold mb-6">Advanced Analysis</h1>
      
      <Tabs defaultValue="productivity" onValueChange={setAnalysisType}>
        <TabsList className="mb-6">
          <TabsTrigger value="productivity" className="flex items-center">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Productivity
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center">
            <ListTodo className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="productivity">
          {renderInsightCards()}
          
          <div className="flex justify-end mb-4">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Allocation</CardTitle>
                <CardDescription>How your time was spent over {timeRange}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ChartContainer config={{
                    focus: { theme: { light: '#8884d8', dark: '#6A5ACD' } },
                    meetings: { theme: { light: '#82ca9d', dark: '#3CB371' } },
                    tasks: { theme: { light: '#ffc658', dark: '#FFD700' } },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={filteredTimeData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                      >
                        <defs>
                          <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ffc658" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                          angle={-45}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis 
                          label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip
                          labelFormatter={(date) => format(parseISO(date), 'MMM d, yyyy')}
                          formatter={(value: number) => [`${value} hours`, '']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="focus" 
                          name="Focus Time"
                          stackId="1"
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorFocus)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="meetings" 
                          name="Meetings"
                          stackId="1"
                          stroke="#82ca9d" 
                          fillOpacity={1} 
                          fill="url(#colorMeetings)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tasks" 
                          name="Tasks"
                          stackId="1"
                          stroke="#ffc658" 
                          fillOpacity={1} 
                          fill="url(#colorTasks)" 
                        />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>Distribution of your activities</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productivity by Hour</CardTitle>
                <CardDescription>Your most productive times of day</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productivityByHour}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" angle={-45} textAnchor="end" height={50} />
                      <YAxis 
                        label={{ value: 'Productivity Score', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, 'Productivity']} />
                      <Bar 
                        dataKey="productivity" 
                        name="Productivity Score"
                        fill="#8884d8"
                      >
                        {productivityByHour.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.productivity >= 90 ? '#8884d8' : 
                                  entry.productivity >= 75 ? '#82ca9d' : 
                                  entry.productivity >= 60 ? '#ffc658' : '#ff8042'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Completion by Day</CardTitle>
                <CardDescription>Completed vs. pending tasks</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={taskCompletionByDay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="completed" 
                        name="Completed Tasks" 
                        stackId="a" 
                        fill="#82ca9d" 
                      />
                      <Bar 
                        dataKey="pending" 
                        name="Pending Tasks" 
                        stackId="a" 
                        fill="#ffc658" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="finance">
          {renderInsightCards()}
          
          <div className="flex justify-end mb-4">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Distribution of your expenses</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>Trends over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', amount: 2100 },
                        { month: 'Feb', amount: 2300 },
                        { month: 'Mar', amount: 2500 },
                        { month: 'Apr', amount: 2730 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Total Expenses']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        name="Monthly Expenses"
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
                <CardDescription>Expense categories compared</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={expenseData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={50} />
                      <YAxis 
                        label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Bar 
                        dataKey="amount" 
                        name="Expense Amount"
                        fill="#8884d8"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          {renderInsightCards()}
          
          <div className="flex justify-end mb-4">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Trend</CardTitle>
                <CardDescription>Tasks completed vs added over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={taskCompletionTrend}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis 
                        label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        labelFormatter={(date) => format(parseISO(date), 'MMM d, yyyy')}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="completed" 
                        name="Completed Tasks"
                        stroke="#22c55e" 
                        fillOpacity={1} 
                        fill="url(#colorCompleted)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="added" 
                        name="Added Tasks"
                        stroke="#9b87f5" 
                        fillOpacity={1} 
                        fill="url(#colorAdded)" 
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Priority</CardTitle>
                <CardDescription>Distribution by priority level</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tasksByPriority}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="count"
                        label={({ priority, percent }) => `${priority} ${(percent * 100).toFixed(0)}%`}
                      >
                        {tasksByPriority.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Due Date Analysis</CardTitle>
                <CardDescription>Tasks by due date status</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dueDateAnalysis}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="status" 
                        type="category"
                        width={100}
                      />
                      <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                      <Bar 
                        dataKey="count" 
                        name="Number of Tasks"
                      >
                        {dueDateAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Categories</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      >
                        {taskCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion by Status</CardTitle>
                <CardDescription>Completed vs In-Progress</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tasksByStatus}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis 
                        label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                      <Bar 
                        dataKey="count" 
                        name="Tasks"
                      >
                        {tasksByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalysis;
