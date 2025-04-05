
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Housing',
  'Utilities',
  'Healthcare',
  'Personal',
  'Travel',
  'Education',
  'Income',
  'Other'
];

const initialExpenses: Expense[] = [
  {
    id: '1',
    amount: 42.50,
    category: 'Food & Dining',
    description: 'Grocery shopping',
    date: '2025-04-02',
    type: 'expense'
  },
  {
    id: '2',
    amount: 15.00,
    category: 'Transportation',
    description: 'Uber ride',
    date: '2025-04-01',
    type: 'expense'
  },
  {
    id: '3',
    amount: 1200.00,
    category: 'Income',
    description: 'Salary deposit',
    date: '2025-04-01',
    type: 'income'
  },
  {
    id: '4',
    amount: 35.99,
    category: 'Entertainment',
    description: 'Movie tickets',
    date: '2025-03-30',
    type: 'expense'
  },
  {
    id: '5',
    amount: 800.00,
    category: 'Housing',
    description: 'Rent payment',
    date: '2025-03-29',
    type: 'expense'
  }
];

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  const form = useForm<{
    amount: string;
    category: string;
    description: string;
    date: string;
    type: 'income' | 'expense';
  }>({
    defaultValues: {
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    }
  });

  const handleAddExpense = (values: any) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(values.amount),
      category: values.category,
      description: values.description,
      date: values.date,
      type: values.type
    };
    
    setExpenses([newExpense, ...expenses]);
    form.reset({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calculate total income, expenses and balance
  const totalIncome = expenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalExpense = expenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const balance = totalIncome - totalExpense;

  // Filter expenses based on category and type
  const filteredExpenses = expenses.filter(expense => {
    let matchesCategory = true;
    let matchesType = true;
    let matchesDate = true;

    if (filterCategory && filterCategory !== 'all') {
      matchesCategory = expense.category === filterCategory;
    }
    if (filterType && filterType !== 'all') {
      matchesType = expense.type === filterType;
    }
    if (dateRange.start) {
      matchesDate = expense.date >= dateRange.start;
    }
    if (dateRange.end) {
      matchesDate = matchesDate && expense.date <= dateRange.end;
    }

    return matchesCategory && matchesType && matchesDate;
  });

  // Get category-wise totals for expenses
  const categoryTotals = CATEGORIES.map(category => {
    const total = expenses
      .filter(expense => expense.category === category && expense.type === 'expense')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return { category, total };
  }).filter(item => item.total > 0);

  return (
    <div className="expense-tracker">
      <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center">
              <ArrowDownLeft className="h-5 w-5 mr-2 text-green-600" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center">
              <ArrowUpRight className="h-5 w-5 mr-2 text-red-600" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card className={balance >= 0 ? "bg-blue-50" : "bg-amber-50"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center">
              <Wallet className={`h-5 w-5 mr-2 ${balance >= 0 ? "text-blue-600" : "text-amber-600"}`} />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${balance >= 0 ? "text-blue-600" : "text-amber-600"}`}>
              ${balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transaction History</span>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
              <CardDescription>Showing {filteredExpenses.length} transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map(expense => (
                    <div 
                      key={expense.id} 
                      className="flex items-center justify-between p-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${expense.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {expense.type === 'income' ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <div className="flex text-xs text-gray-500 gap-2">
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={`font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">No transactions found</p>
                    <p className="text-sm text-gray-400">
                      {filterCategory || filterType !== 'all'
                        ? 'Try changing your filters' 
                        : 'Add some transactions to get started!'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
              <CardDescription>Record a new expense or income</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddExpense)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="0.00" 
                            type="number"
                            step="0.01" 
                            min="0.01"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="What was this for?" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-md">Top Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryTotals.sort((a, b) => b.total - a.total).slice(0, 5).map(item => (
                  <div key={item.category} className="flex justify-between items-center">
                    <span className="text-sm">{item.category}</span>
                    <span className="font-semibold">${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
