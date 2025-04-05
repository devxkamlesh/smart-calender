import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StickyNote, 
  Plus, 
  Search, 
  Tag, 
  Star, 
  Info,
  HelpCircle,
  Filter,
  Trash, 
  Edit, 
  X, 
  Check, 
  ChevronDown,
  ArrowLeft,
  Lightbulb,
  PenSquare,
  List,
  LayoutGrid,
  SortAsc,
  SortDesc,
  FileText,
  Briefcase,
  User,
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import NoteEditor from '../components/note/NoteEditor';
import NoteCard from '../components/note/NoteCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// Import LucideIcon type for type safety
import type { LucideIcon } from 'lucide-react';

// Interface for Note
interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// Interface for Category
interface Category {
  name: string;
  icon: LucideIcon;
  count: number;
  color: string;
}

// Define categories with proper typing
const CATEGORIES: Omit<Category, 'count'>[] = [
  { name: 'All Notes', icon: StickyNote, color: '#6366f1' },
  { name: 'Work', icon: Briefcase, color: '#f97316' },
  { name: 'Personal', icon: User, color: '#8b5cf6' },
  { name: 'Ideas', icon: Lightbulb, color: '#10b981' },
  { name: 'Tasks', icon: CheckSquare, color: '#0ea5e9' },
];

const SAMPLE_NOTES: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes',
    content: '<h2>Project Timeline Discussion</h2><p>Discussed project timeline and allocated resources for Q3.</p><ul><li>Need to follow up with the team about budget concerns</li><li>Schedule follow-up meeting next week</li><li>Review documentation by Friday</li></ul>',
    category: 'Work',
    color: '#f97316',
    pinned: true,
    createdAt: new Date('2023-04-01T10:00:00'),
    updatedAt: new Date('2023-04-01T10:30:00'),
    tags: ['meeting', 'project', 'planning']
  },
  {
    id: '2',
    title: 'Vacation Ideas',
    content: '<h2>Summer Travel Plans</h2><p>Consider visiting <strong>Italy</strong> or <strong>Greece</strong> this summer.</p><p>Look into accommodations with ocean views. Research local cuisine and attractions.</p>',
    category: 'Personal',
    color: '#0ea5e9',
    pinned: false,
    createdAt: new Date('2023-03-25T15:20:00'),
    updatedAt: new Date('2023-03-25T15:45:00'),
    tags: ['travel', 'vacation', 'planning']
  },
  {
    id: '3',
    title: 'App Feature Ideas',
    content: '<h1>New Features to Implement</h1><ul><li><strong>Add dark mode support</strong></li><li>Implement <u>drag and drop</u> for notes</li><li>Create a <em>tagging system</em></li><li><s>Add reminders and notifications</s> (completed)</li></ul>',
    category: 'Ideas',
    color: '#10b981',
    pinned: true,
    createdAt: new Date('2023-03-15T09:10:00'),
    updatedAt: new Date('2023-03-20T11:30:00'),
    tags: ['features', 'development', 'ideas']
  },
  {
    id: '4',
    title: 'Shopping List',
    content: '<h3>Things to Buy</h3><ul><li>Groceries</li><li>New headphones</li><li>Birthday gift for mom</li><li>Office supplies</li></ul>',
    category: 'Tasks',
    color: '#8b5cf6',
    pinned: false,
    createdAt: new Date('2023-04-02T08:45:00'),
    updatedAt: new Date('2023-04-02T08:45:00'),
    tags: ['shopping', 'personal']
  }
];

const Notes: React.FC = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>(SAMPLE_NOTES);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(SAMPLE_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Notes');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false);
  const [showBeginnersGuide, setShowBeginnersGuide] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    category: 'Personal',
    color: '#0ea5e9',
    tags: [],
    pinned: false
  });
  const [newTag, setNewTag] = useState('');
  
  // Calculate category counts
  const categoryCount: Category[] = [
    { 
      name: 'All Notes', 
      icon: StickyNote, 
      count: notes.length,
      color: '#6366f1' // Default color for All Notes
    },
    ...Array.from(new Set(notes.map(note => note.category)))
      .filter(Boolean)
      .map(category => {
        const count = notes.filter(note => note.category === category).length;
        let icon: LucideIcon = FileText;
        let color = '#6366f1'; // Default color
        
        // Assign icons and colors based on category
        if (category === 'Work') {
          icon = Briefcase;
          color = '#f97316'; // Orange
        } else if (category === 'Personal') {
          icon = User;
          color = '#8b5cf6'; // Violet
        } else if (category === 'Ideas') {
          icon = Lightbulb;
          color = '#10b981'; // Emerald
        } else if (category === 'Tasks') {
          icon = CheckSquare;
          color = '#0ea5e9'; // Sky
        }
        
        return { name: category, icon, count, color };
      })
  ];

  // Filter and sort notes when search query, category, or sort order changes
  useEffect(() => {
    let filtered = notes;
    
    // Filter by category
    if (activeCategory !== 'All Notes') {
      filtered = filtered.filter(note => note.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort notes based on current sort order
    filtered = [...filtered].sort((a, b) => {
      // Always show pinned notes first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then apply the selected sort
      switch (sortOrder) {
        case 'newest':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'oldest':
          return a.updatedAt.getTime() - b.updatedAt.getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredNotes(filtered);
  }, [notes, searchQuery, activeCategory, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Cannot create note",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const createdAt = new Date();
    const id = `note-${Date.now()}`;
    
    const createdNote: Note = {
      id,
      title: newNote.title || "Untitled",
      content: newNote.content || "",
      category: newNote.category || "Personal",
      color: CATEGORIES.find(cat => cat.name === newNote.category)?.color || "#0ea5e9",
      pinned: newNote.pinned || false,
      createdAt,
      updatedAt: createdAt,
      tags: newNote.tags || [],
    };
    
    setNotes(prev => [createdNote, ...prev]);
    setIsNewNoteDialogOpen(false);
    setNewNote({
      title: '',
      content: '',
      category: 'Personal',
      color: '#0ea5e9',
      tags: [],
      pinned: false
    });
    
    toast({
      title: "Note created",
      description: "Your note has been created successfully",
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been deleted",
    });
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? {...updatedNote, updatedAt: new Date()} : note
    ));
    setIsEditing(false);
    setCurrentNote(null);
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully",
    });
  };

  const handleTogglePinned = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? {...note, pinned: !note.pinned} : note
    ));
  };

  const handleAddTag = () => {
    if (!newTag || newNote.tags?.includes(newTag)) return;
    
    setNewNote(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTag]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleCreateEmptyNote = () => {
    const createdAt = new Date();
    const id = `note-${Date.now()}`;
    
    const emptyNote: Note = {
      id,
      title: "Untitled Note",
      content: "",
      category: "Personal",
      color: CATEGORIES.find(cat => cat.name === "Personal")?.color || "#0ea5e9",
      pinned: false,
      createdAt,
      updatedAt: createdAt,
      tags: [],
    };
    
    setNotes(prev => [emptyNote, ...prev]);
    handleEditNote(emptyNote);
    
    toast({
      title: "New note created",
      description: "Start editing your new note",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // When editing a note
  if (isEditing && currentNote) {
    return (
      <NoteEditor 
        note={currentNote}
        onSave={handleUpdateNote}
        onCancel={() => {
          setIsEditing(false);
          setCurrentNote(null);
        }}
        categories={CATEGORIES.slice(1)} // Skip 'All Notes' category
      />
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        className="notes-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Page Header with Title and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                <StickyNote className="h-7 w-7 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500" />
                My Notes
              </h1>
              <p className="text-muted-foreground mt-1">
                Organize your thoughts, ideas, and reminders
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* View Toggle */}
              <div className="flex items-center rounded-md border border-gray-200/70 dark:border-gray-700/70 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-1 shadow-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        "h-8 px-2",
                        viewMode === 'grid' ? "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600" : ""
                      )}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Grid view
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        "h-8 px-2",
                        viewMode === 'list' ? "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600" : ""
                      )}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    List view
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Sort Order */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/70 dark:border-gray-700/70 shadow-sm">
                        <SortAsc className="h-4 w-4 mr-1" />
                        Sort
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Change sort order
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-gray-200/70 dark:border-gray-700/70">
                  <DropdownMenuItem onClick={() => setSortOrder('newest')} className="flex items-center gap-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50">
                    <SortDesc className="h-4 w-4" />
                    <span>Newest first</span>
                    {sortOrder === 'newest' && <Check className="h-4 w-4 ml-auto text-blue-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('oldest')} className="flex items-center gap-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50">
                    <SortAsc className="h-4 w-4" />
                    <span>Oldest first</span>
                    {sortOrder === 'oldest' && <Check className="h-4 w-4 ml-auto text-blue-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('alphabetical')} className="flex items-center gap-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50">
                    <Tag className="h-4 w-4" />
                    <span>Alphabetical</span>
                    {sortOrder === 'alphabetical' && <Check className="h-4 w-4 ml-auto text-blue-500" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notes..."
                  className="pl-8 w-full pr-8 h-9 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/70 dark:border-gray-700/70 shadow-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-9 w-9" 
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Create Note Buttons */}
              <div className="flex gap-2">
                {/* Quick Create Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleCreateEmptyNote}
                      className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Quick Note
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Create a blank note and start editing immediately
                  </TooltipContent>
                </Tooltip>

                {/* Create Note Dialog */}
                <Dialog open={isNewNoteDialogOpen} onOpenChange={setIsNewNoteDialogOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/70 dark:border-gray-700/70 shadow-sm">
                          <Plus className="h-4 w-4 mr-1" />
                          New Note
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Create a detailed note with categories and tags
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent className="sm:max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-gray-200/70 dark:border-gray-700/70 shadow-lg">
                    <DialogHeader>
                      <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">Create New Note</DialogTitle>
                      <DialogDescription>
                        Add a new note to your collection
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="note-title" className="text-sm font-medium">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="note-title"
                          placeholder="Enter a title for your note"
                          value={newNote.title}
                          onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                          className="text-lg font-medium"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="note-content" className="text-sm font-medium">
                          Content <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="note-content"
                          placeholder="Write your note content here..."
                          value={newNote.content}
                          onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                          className="min-h-[200px] resize-y"
                        />
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.slice(1).map((category) => (
                            <Badge
                              key={category.name}
                              variant={newNote.category === category.name ? "default" : "outline"}
                              className="cursor-pointer px-3 py-1 flex items-center gap-1"
                              style={{
                                backgroundColor: newNote.category === category.name ? category.color : 'transparent',
                                borderColor: category.color,
                                color: newNote.category === category.name ? 'white' : undefined,
                              }}
                              onClick={() => setNewNote({
                                ...newNote, 
                                category: category.name,
                                color: category.color
                              })}
                            >
                              {React.createElement(category.icon, { size: 12 })}
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              placeholder="Add tag... (Press Enter to add)"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                            />
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={handleAddTag} type="button" variant="outline" size="icon">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              Add tag
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        
                        {newNote.tags && newNote.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {newNote.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                                <span>{tag}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="pin-note"
                          checked={newNote.pinned}
                          onChange={(e) => setNewNote({...newNote, pinned: e.target.checked})}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <label htmlFor="pin-note" className="text-sm font-medium cursor-pointer">
                          Pin this note to the top
                        </label>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewNoteDialogOpen(false)} className="border-gray-200/70 dark:border-gray-700/70">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateNote} className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
                        Create Note
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Categories - Horizontal Display */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/70 dark:border-gray-700/70 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Categories</h3>
                </div>
                <Badge variant="outline" className="font-normal text-xs border-gray-200/70 dark:border-gray-700/70 bg-white/50 dark:bg-gray-800/50">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categoryCount.map((category) => (
                  <Button
                    key={category.name}
                    variant={activeCategory === category.name ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-1 border-gray-200/70 dark:border-gray-700/70 shadow-sm ${
                      activeCategory === category.name 
                        ? 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white' 
                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
                    }`}
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    {React.createElement(category.icon, { 
                      className: "h-4 w-4",
                      color: activeCategory === category.name ? "white" : category.color
                    })}
                    <span>{category.name}</span>
                    <Badge variant="secondary" className={`ml-1 ${activeCategory === category.name ? 'bg-white/20 text-white' : 'bg-gray-100/80 dark:bg-gray-700/80'}`}>
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Notes Display Area */}
            <div>
              {/* Search Results Summary */}
              {searchQuery && (
                <div className="mb-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/70 dark:border-gray-700/70 flex items-center justify-between">
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">
                      Search results for <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">"{searchQuery}"</span>
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-200/70 dark:border-gray-700/70 bg-white/50 dark:bg-gray-800/50">
                    {filteredNotes.length} {filteredNotes.length === 1 ? 'result' : 'results'}
                  </Badge>
                </div>
              )}
              
              {/* Notes Display */}
              {filteredNotes.length > 0 ? (
                <>
                  {/* Grid View */}
                  {viewMode === 'grid' && (
                    <div className="relative">
                      {/* Pinned Notes Section */}
                      {filteredNotes.some(note => note.pinned) && (
                        <div className="mb-6">
                          <div className="flex items-center mb-3">
                            <svg width="0" height="0" className="absolute">
                              <linearGradient id="pink-to-violet" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                              </linearGradient>
                            </svg>
                            <Star className="h-4 w-4 mr-2" style={{ fill: 'url(#pink-to-violet)', stroke: 'url(#pink-to-violet)' }} />
                            <h3 className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Pinned Notes</h3>
                          </div>
                          <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                            variants={container}
                            initial="hidden"
                            animate="show"
                          >
                            {filteredNotes
                              .filter(note => note.pinned)
                              .map((note) => (
                                <motion.div 
                                  key={note.id} 
                                  variants={item} 
                                  className="transform transition-all hover:-translate-y-1"
                                >
                                  <NoteCard 
                                    note={note}
                                    onDelete={() => handleDeleteNote(note.id)}
                                    onEdit={() => handleEditNote(note)}
                                    onTogglePin={() => handleTogglePinned(note.id)}
                                  />
                                </motion.div>
                              ))
                            }
                          </motion.div>
                        </div>
                      )}
                      
                      {/* Other Notes */}
                      {filteredNotes.some(note => !note.pinned) && (
                        <div>
                          {filteredNotes.some(note => note.pinned) && (
                            <div className="flex items-center mb-3">
                              <StickyNote className="h-4 w-4 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500" />
                              <h3 className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">Other Notes</h3>
                            </div>
                          )}
                          
                          <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr"
                            variants={container}
                            initial="hidden"
                            animate="show"
                          >
                            {filteredNotes
                              .filter(note => !note.pinned)
                              .map((note) => (
                                <motion.div 
                                  key={note.id} 
                                  variants={item}
                                  className="transform transition-all hover:-translate-y-1 h-full"
                                >
                                  <NoteCard 
                                    note={note}
                                    onDelete={() => handleDeleteNote(note.id)}
                                    onEdit={() => handleEditNote(note)}
                                    onTogglePin={() => handleTogglePinned(note.id)}
                                  />
                                </motion.div>
                              ))
                            }
                          </motion.div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* List View */}
                  {viewMode === 'list' && (
                    <motion.div 
                      className="flex flex-col space-y-3"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {filteredNotes.map((note) => (
                        <motion.div 
                          key={note.id} 
                          variants={item} 
                          className="w-full transition-all hover:translate-x-1"
                        >
                          <NoteCard 
                            note={note}
                            onDelete={() => handleDeleteNote(note.id)}
                            onEdit={() => handleEditNote(note)}
                            onTogglePin={() => handleTogglePinned(note.id)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/70 dark:border-gray-700/70 shadow-sm">
                  <div className="bg-gray-100/80 dark:bg-gray-700/50 rounded-full p-4 mb-4">
                    <StickyNote className="h-16 w-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400/70 to-violet-400/70" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">No notes found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {searchQuery 
                      ? `No notes match your search for "${searchQuery}"` 
                      : activeCategory !== 'All Notes' 
                        ? `You don't have any notes in the "${activeCategory}" category` 
                        : "Your note collection is empty. Start creating notes to organize your thoughts."}
                  </p>
                  <div className="flex gap-3">
                    {searchQuery && (
                      <Button variant="outline" onClick={() => setSearchQuery('')} className="border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-800/80">
                        Clear Search
                      </Button>
                    )}
                    <Button onClick={() => searchQuery ? setSearchQuery('') : setIsNewNoteDialogOpen(true)} className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
                      <Plus className="h-4 w-4 mr-1" />
                      {searchQuery ? "Create New Note" : "Create Your First Note"}
                    </Button>
                  </div>
                </Card>
              )}
              
              {/* Quick Guide to Notes - After Notes Display */}
              <div className="mt-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/70 dark:border-gray-700/70 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 px-4 py-3">
                  <h3 className="text-white font-semibold flex items-center text-lg">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Quick Guide to Notes
                  </h3>
                </div>
                
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                          <Plus className="h-5 w-5" style={{ color: '#4f46e5' }} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Creating Notes</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Click the <span className="font-medium text-blue-600 dark:text-blue-400">Quick Note</span> button for instant creation, or <span className="font-medium text-blue-600 dark:text-blue-400">New Note</span> for more detailed options.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100/80 to-green-100/80 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center">
                          <Tag className="h-5 w-5" style={{ color: '#10b981' }} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Using Categories & Tags</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Organize notes with categories and add specific tags to make them easier to find later.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-pink-100/80 to-violet-100/80 dark:from-pink-900/30 dark:to-violet-900/30 flex items-center justify-center">
                          <Star className="h-5 w-5" style={{ color: '#ec4899' }} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Pinning Important Notes</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Pin important notes to always keep them at the top of your list for quick access.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-100/80 to-violet-100/80 dark:from-purple-900/30 dark:to-violet-900/30 flex items-center justify-center">
                          <Search className="h-5 w-5" style={{ color: '#8b5cf6' }} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Finding & Sorting</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Use search to find notes quickly, or change the sort order to organize by date or alphabetically.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-5 border-t border-gray-100/70 dark:border-gray-700/70 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hover over buttons in the interface for helpful tooltips
                    </p>
                    <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0 h-auto">
                      View Full Guide
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default Notes; 