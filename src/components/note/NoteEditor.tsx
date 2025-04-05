import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Tag as TagIcon, 
  Star, 
  Calendar as CalendarIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Paintbrush,
  Highlighter,
  FileDown,
  FileUp,
  MinusSquare,
  Clock,
  Check,
  AlignCenter,
  AlignJustify,
  AlignLeft, 
  AlignRight,
  Type,
  Copy,
  Scissors,
  Clipboard,
  Code,
  Image,
  Table,
  Superscript,
  Subscript,
  Indent,
  Outdent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Types
interface Category {
  name: string;
  color: string;
  count?: number;
}

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

interface NoteEditorProps {
  note: Note;
  categories: Category[];
  onSave: (note: Note) => void;
  onCancel: () => void;
}

// Predefined color palettes
const colorPalettes = [
  // Palette 1: Basic colors
  ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'],
  // Palette 2: Pastels
  ['#FFB6C1', '#FFD700', '#98FB98', '#ADD8E6', '#FFA07A', '#DDA0DD', '#87CEFA', '#FFFACD', '#F0E68C', '#E6E6FA'],
  // Palette 3: Vibrant colors
  ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#8A2BE2', '#00C7BE'],
  // Palette 4: Soft colors
  ['#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784'],
  // Palette 5: Warm tones
  ['#8B0000', '#A52A2A', '#B22222', '#DC143C', '#FF6347', '#FF7F50', '#CD5C5C', '#F08080', '#E9967A', '#FA8072'],
  // Palette 6: Grayscale
  ['#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080', '#999999', '#B3B3B3', '#CCCCCC', '#E6E6E6'],
  // Palette 7: Blues
  ['#000080', '#0000CD', '#1E90FF', '#4169E1', '#6495ED', '#87CEEB', '#87CEFA', '#ADD8E6', '#B0E0E6', '#F0F8FF'],
  // Palette 8: Greens
  ['#006400', '#228B22', '#32CD32', '#3CB371', '#66CDAA', '#8FBC8F', '#90EE90', '#98FB98', '#ADFF2F', '#7CFC00'],
  // Palette 9: Material Design
  ['#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107'],
  // Palette 10: Vintage
  ['#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8', '#EFEBE9', '#FAFAFA', '#ECEFF1', '#CFD8DC', '#B0BEC5', '#90A4AE'],
];

// Add specialized color palettes for text and highlighting after the existing colorPalettes
const textDarkColors = [
  '#1A1A1A', // Near black
  '#2D3748', // Dark slate gray
  '#1E293B', // Dark blue gray
  '#374151', // Dark gray
  '#3F3F46', // Dark zinc
  '#44403C', // Dark stone
  '#3B0764', // Dark purple
  '#064E3B', // Dark green
  '#0C4A6E', // Dark blue
  '#7F1D1D', // Dark red
  '#713F12', // Dark amber
  '#4C1D95', // Dark violet
  '#312E81', // Dark indigo
  '#134E4A', // Dark teal
  '#365314', // Dark lime
  '#422006', // Dark brown
];

const highlightLightColors = [
  '#F8FAFC', // Light slate
  '#EFF6FF', // Light blue
  '#F0FDFA', // Light cyan
  '#ECFEFF', // Light sky
  '#F0FDF4', // Light green
  '#FEFCE8', // Light yellow
  '#FEF2F2', // Light red
  '#FDF4FF', // Light fuchsia
  '#FAF5FF', // Light purple
  '#F5FAFF', // Light azure
  '#F0F9FF', // Light blue
  '#F0FDFB', // Light teal
  '#F7FEE7', // Light lime
  '#FFFBEB', // Light amber
  '#FFF7ED', // Light orange
  '#FFEDD5', // Light orange
];

const autoSaveInterval = 10000; // 10 seconds

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const formatUrl = (url: string): string => {
  // Check if the URL already has a protocol
  if (url.match(/^https?:\/\//i) || url.match(/^mailto:/i)) {
    return url;
  }
  
  // Check if it's an email address
  if (url.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    return `mailto:${url}`;
  }
  
  // Add https:// to all other URLs
  return `https://${url}`;
};

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  categories, 
  onSave, 
  onCancel 
}) => {
  const [editedNote, setEditedNote] = useState<Note>({...note});
  const [newTag, setNewTag] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTips, setShowTips] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      // Only update state if there's a meaningful change
      if (Math.abs(scrollY - scrollPosition) > 10) {
        setScrollPosition(scrollY);
      }
    }, 100); // Throttle to once per 100ms
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollPosition]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editedNote.content !== note.content && editedNote.title.trim()) {
        setIsSaving(true);
        // Simulate saving delay
        setTimeout(() => {
          setIsSaving(false);
        }, 1000);
      }
    }, autoSaveInterval);
    
    return () => clearTimeout(timer);
  }, [editedNote.content, editedNote.title, note.content]);

  // Initialize the editor with content
  useEffect(() => {
    if (editorRef.current) {
      try {
        // Safely set the content
        editorRef.current.innerHTML = note.content || '';
        
        // Initial save to state to ensure consistency
        setEditedNote(prev => ({
          ...prev,
          content: note.content || ''
        }));
        
        // Add event listener for link clicks
        const handleLinkClicks = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          // Check if the clicked element is a link
          if (target.tagName === 'A') {
            // Prevent default anchor behavior
            e.preventDefault();
            
            const href = (target as HTMLAnchorElement).href;
            
            // Handle the URL correctly
            try {
              // If ctrl/cmd key is pressed, open in new tab
              if (e.ctrlKey || e.metaKey) {
                window.open(href, '_blank', 'noopener,noreferrer');
              } else {
                // Otherwise handle in-app or open in same tab
                // Don't navigate if it's a relative URL or points to localhost
                if (href.startsWith('http') && !href.includes('localhost:')) {
                  window.open(href, '_self');
                } else {
                  // Handle in-app navigation if needed
                  console.log('In-app link:', href);
                }
              }
            } catch (err) {
              console.error('Error handling link click:', err);
            }
          }
        };
        
        editorRef.current.addEventListener('click', handleLinkClicks);
        
        // Clean up event listener
        return () => {
          editorRef.current?.removeEventListener('click', handleLinkClicks);
        };
      } catch (error) {
        console.error('Error initializing editor content:', error);
        editorRef.current.innerHTML = '';
      }
    }
  }, [note.content]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: Category) => {
    setEditedNote(prev => ({ 
      ...prev, 
      category: category.name,
      color: category.color
    }));
  };

  const handleTogglePin = () => {
    setEditedNote(prev => ({ ...prev, pinned: !prev.pinned }));
  };

  const handleAddTag = () => {
    if (!newTag || editedNote.tags.includes(newTag)) return;
    
    setEditedNote(prev => ({
      ...prev,
      tags: [...prev.tags, newTag]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setEditedNote(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      try {
        const content = editorRef.current.innerHTML;
        setEditedNote(prev => ({
          ...prev,
          content
        }));
      } catch (error) {
        console.error('Error handling content change:', error);
      }
    }
  };

  const handleSaveNote = () => {
    if (!editedNote.title.trim()) {
      alert("Title is required");
      return;
    }
    
    // Make sure we have the latest content from the editor
    if (editorRef.current) {
      const finalContent = editorRef.current.innerHTML;
      onSave({
        ...editedNote,
        content: finalContent
      });
    } else {
      onSave(editedNote);
    }
  };

  const clearFormatting = () => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (!range || !editorRef.current.contains(range.commonAncestorContainer)) return;
    
    document.execCommand('removeFormat', false);
    document.execCommand('formatBlock', false, 'p');
    
    handleContentChange();
  };

  const isFormatActive = (format: string): boolean => {
    if (!editorRef.current) return false;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    
    try {
      switch (format) {
        case 'bold':
          return document.queryCommandState('bold');
        case 'italic':
          return document.queryCommandState('italic');
        case 'underline':
          return document.queryCommandState('underline');
        case 'strikethrough':
          return document.queryCommandState('strikeThrough');
        case 'h1':
          return !!selection.anchorNode?.parentElement?.closest('h1');
        case 'h2':
          return !!selection.anchorNode?.parentElement?.closest('h2');
        case 'h3':
          return !!selection.anchorNode?.parentElement?.closest('h3');
        case 'normal': {
          const node = selection.anchorNode?.parentElement;
          return node ? !node.closest('h1, h2, h3, blockquote, ul, ol') : false;
        }
        case 'ul':
          return document.queryCommandState('insertUnorderedList');
        case 'ol':
          return document.queryCommandState('insertOrderedList');
        case 'quote':
          return !!selection.anchorNode?.parentElement?.closest('blockquote');
        default:
          return false;
      }
    } catch (error) {
      console.error('Format detection error:', error);
      return false;
    }
  };

  const applyFormatting = (format: string, value?: string) => {
    if (!editorRef.current) return;

    if (!isFocused) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!range || !editorRef.current.contains(range.commonAncestorContainer)) return;

    try {
      switch (format) {
        case 'bold':
          document.execCommand('bold', false);
          break;
        case 'italic':
          document.execCommand('italic', false);
          break;
        case 'underline':
          document.execCommand('underline', false);
          break;
        case 'strikethrough':
          document.execCommand('strikeThrough', false);
          break;
        case 'h1':
        case 'h2':
        case 'h3':
          if (isFormatActive(format)) {
            document.execCommand('formatBlock', false, 'p');
          } else {
            document.execCommand('formatBlock', false, '<' + format + '>');
          }
          break;
        case 'normal':
          document.execCommand('formatBlock', false, '<p>');
          break;
        case 'ul':
          // Make sure the editor has focus
          editorRef.current.focus();
          
          try {
            // Create a proper selection context if none exists
            if (!selection.rangeCount) {
              const range = document.createRange();
              range.selectNodeContents(editorRef.current);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
            }
            
            // If inside a numbered list, first remove it
            if (document.queryCommandState('insertOrderedList')) {
              document.execCommand('insertOrderedList', false);
            }
            
            // Toggle bullet list
            document.execCommand('insertUnorderedList', false);
            
            // Apply proper styling to the list
            const lists = editorRef.current.querySelectorAll('ul');
            lists.forEach(list => {
              list.style.paddingLeft = '1.5rem';
              list.style.marginBottom = '0.75rem';
              list.style.listStyleType = 'disc';
              
              // Style list items
              const items = list.querySelectorAll('li');
              items.forEach(item => {
                item.style.marginBottom = '0.25rem';
                item.style.lineHeight = '1.7';
              });
            });
          } catch (error) {
            console.error('Error applying bullet list:', error);
          }
          break;
        case 'ol':
          // Make sure the editor has focus
          editorRef.current.focus();
          
          try {
            // Create a proper selection context if none exists
            if (!selection.rangeCount) {
              const range = document.createRange();
              range.selectNodeContents(editorRef.current);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
            }
            
            // If inside a bullet list, first remove it
            if (document.queryCommandState('insertUnorderedList')) {
              document.execCommand('insertUnorderedList', false);
            }
            
            // Toggle numbered list
            document.execCommand('insertOrderedList', false);
            
            // Apply proper styling to the list
            const lists = editorRef.current.querySelectorAll('ol');
            lists.forEach(list => {
              list.style.paddingLeft = '1.5rem';
              list.style.marginBottom = '0.75rem';
              
              // Style list items
              const items = list.querySelectorAll('li');
              items.forEach(item => {
                item.style.marginBottom = '0.25rem';
                item.style.lineHeight = '1.7';
              });
            });
          } catch (error) {
            console.error('Error applying numbered list:', error);
          }
          break;
        case 'quote':
          if (isFormatActive('quote')) {
            document.execCommand('formatBlock', false, '<p>');
          } else {
            document.execCommand('formatBlock', false, '<blockquote>');
          }
          break;
        case 'link':
          const url = prompt('Enter URL:');
          if (url) {
            // Format URL properly to ensure it has correct protocol
            const formattedUrl = formatUrl(url);
            
            // Save the current selection
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const selectedText = range.toString();
              
              // If user selected text, use that as link text
              if (selectedText) {
                // Execute the link command
                document.execCommand('createLink', false, formattedUrl);
                
                // Find the newly created link element
                const newLinks = editorRef.current.querySelectorAll('a');
                newLinks.forEach(link => {
                  if (link.href === formattedUrl || 
                      link.href === new URL(formattedUrl, window.location.href).toString()) {
                    // Add attributes for better accessibility and security
                    link.setAttribute('title', 'Hold Ctrl/Cmd key to open in a new tab');
                    link.setAttribute('rel', 'noopener noreferrer');
                    
                    // Set custom data attribute to mark this as a ctrl-clickable link
                    link.dataset.ctrlClickable = 'true';
                  }
                });
              } else {
                // If no text was selected, insert a new link with the URL as text
                const linkElement = document.createElement('a');
                linkElement.href = formattedUrl;
                linkElement.textContent = url; // Use original input as text
                linkElement.title = 'Hold Ctrl/Cmd key to open in a new tab';
                linkElement.setAttribute('rel', 'noopener noreferrer');
                linkElement.dataset.ctrlClickable = 'true';
                
                range.deleteContents();
                range.insertNode(linkElement);
                
                // Move cursor after inserted link
                range.setStartAfter(linkElement);
                range.setEndAfter(linkElement);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }
          break;
        case 'textColor':
          if (value) document.execCommand('foreColor', false, value);
          break;
        case 'highlight':
          if (value) document.execCommand('hiliteColor', false, value);
          break;
        case 'line':
          document.execCommand('insertHorizontalRule', false);
          break;
        case 'fontSize':
          if (value) document.execCommand('fontSize', false, '7');
          // After command execution, find all font elements and set actual size
          const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
          fontElements.forEach(el => {
            el.removeAttribute('size');
            (el as HTMLElement).style.fontSize = value;
          });
          break;
        case 'align':
          if (value === 'left') document.execCommand('justifyLeft', false);
          else if (value === 'center') document.execCommand('justifyCenter', false);
          else if (value === 'right') document.execCommand('justifyRight', false);
          else if (value === 'justify') document.execCommand('justifyFull', false);
          break;
        case 'code':
          // Implement code formatting
          const codeSelection = window.getSelection();
          if (codeSelection && codeSelection.rangeCount > 0) {
            const range = codeSelection.getRangeAt(0);
            const selectedText = range.toString();
            
            // If there is selected text, wrap it in <code> tags
            if (selectedText) {
              // Create a code element
              const codeElement = document.createElement('code');
              codeElement.style.fontFamily = 'monospace';
              codeElement.style.backgroundColor = '#f1f5f9';
              codeElement.style.padding = '0.2em 0.4em';
              codeElement.style.borderRadius = '3px';
              codeElement.style.fontSize = '0.9em';
              codeElement.style.color = '#334155';
              
              // For dark mode support, add a data attribute that CSS can target
              codeElement.dataset.codeBlock = 'inline';
              
              // Set the selected text as content
              codeElement.textContent = selectedText;
              
              // Replace the selection with the code element
              range.deleteContents();
              range.insertNode(codeElement);
              
              // Move the cursor after the code element
              range.setStartAfter(codeElement);
              range.setEndAfter(codeElement);
              codeSelection.removeAllRanges();
              codeSelection.addRange(range);
            } else {
              // If no text selected, create a code block
              const preElement = document.createElement('pre');
              preElement.style.backgroundColor = '#f1f5f9';
              preElement.style.padding = '1em';
              preElement.style.borderRadius = '6px';
              preElement.style.overflow = 'auto';
              preElement.style.fontFamily = 'monospace';
              preElement.style.fontSize = '0.9em';
              preElement.style.margin = '1em 0';
              preElement.style.border = '1px solid #e2e8f0';
              
              // Add a data attribute for dark mode styling
              preElement.dataset.codeBlock = 'block';
              
              const codeElement = document.createElement('code');
              codeElement.textContent = 'Type your code here...';
              
              preElement.appendChild(codeElement);
              
              // Insert at the current cursor position
              range.deleteContents();
              range.insertNode(preElement);
              
              // Set cursor inside the code block for immediate editing
              range.selectNodeContents(codeElement);
              codeSelection.removeAllRanges();
              codeSelection.addRange(range);
            }
          }
          break;
        case 'image':
          // Implement image insertion
          const imageUrl = prompt('Enter image URL:');
          if (imageUrl) {
            insertImage(imageUrl);
          }
          break;
        case 'table':
          // Implement table insertion
          const rows = parseInt(prompt('Number of rows:', '3') || '3');
          const cols = parseInt(prompt('Number of columns:', '3') || '3');
          
          if (rows > 0 && cols > 0) {
            insertTable(rows, cols);
          }
          break;
        case 'strikethrough':
          document.execCommand('strikeThrough', false);
          break;
        case 'superscript':
          // Implement superscript formatting
          document.execCommand('superscript', false);
          break;
        case 'subscript':
          // Implement subscript formatting
          document.execCommand('subscript', false);
          break;
        case 'indent':
          // Implement indent formatting
          document.execCommand('indent', false);
          break;
        case 'outdent':
          // Implement outdent formatting
          document.execCommand('outdent', false);
          break;
      }
    } catch (error) {
      console.error('Formatting error:', error);
    }

    handleContentChange();
    
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleExport = () => {
    if (!editedNote.title) {
      alert("Note must have a title before exporting");
      return;
    }

    // Get the latest content
    const noteContent = {
      ...editedNote,
      content: editorRef.current?.innerHTML || editedNote.content
    };
    
    // Create a download link for the JSON file
    const blob = new Blob([JSON.stringify(noteContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editedNote.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedNote = JSON.parse(event.target?.result as string) as Note;
        // Update editor content
        if (editorRef.current) {
          editorRef.current.innerHTML = importedNote.content || '';
        }
        // Update state
        setEditedNote({
          ...importedNote,
          id: editedNote.id // Keep the current note ID
        });
      } catch (error) {
        alert("Error importing note. The file might be corrupted.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
    
    // Reset the file input for future imports
    if (e.target) e.target.value = '';
  };

  useEffect(() => {
    let pollId: number;
    
    const pollSelection = () => {
      setIsFocused(prev => {
        if (!prev) return prev;
        return true;
      });
      
      pollId = window.setTimeout(pollSelection, 200);
    };
    
    if (isFocused) {
      pollId = window.setTimeout(pollSelection, 200);
    }
    
    return () => {
      if (pollId) clearTimeout(pollId);
    };
  }, [isFocused]);

  const handleEditorFocus = () => {
    setIsFocused(true);
  };

  const handleEditorBlur = () => {
    setIsFocused(false);
    handleContentChange();
  };

  // Color palette selector component
  const ColorPaletteSelector = () => (
    <div className="flex flex-wrap gap-2 mb-2">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
        <button
          key={index}
          className={`w-8 h-5 border rounded ${selectedPalette === index ? 'ring-2 ring-blue-500' : ''}`}
          style={{
            backgroundColor: colorPalettes[index][0],
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
          }}
          onClick={() => setSelectedPalette(index)}
          aria-label={`Color palette ${index + 1}`}
        />
      ))}
    </div>
  );

  // Color picker component used for both text color and highlighting
  const ColorPicker = ({ type }: { type: 'text' | 'highlight' }) => {
    const [customColor, setCustomColor] = useState('#000000');
    const [colorMode, setColorMode] = useState<'palette' | 'specialized' | 'recent'>('palette');
    const [recentColors, setRecentColors] = useState<string[]>([]);
    
    // Use the appropriate color set based on type and mode
    const getColors = () => {
      switch (colorMode) {
        case 'specialized':
          return type === 'text' ? textDarkColors : highlightLightColors;
        case 'recent':
          return recentColors;
        default:
          return colorPalettes[selectedPalette];
      }
    };
    
    // Add a color to recent colors
    const addToRecentColors = (color: string) => {
      if (!recentColors.includes(color)) {
        // Add to the beginning and limit to 12 colors
        setRecentColors(prev => [color, ...prev].slice(0, 12));
      }
    };
    
    // Apply color and add to recent colors
    const applyColor = (color: string) => {
      applyFormatting(type === 'text' ? 'textColor' : 'highlight', color);
      addToRecentColors(color);
    };
    
    // Quick-access popular colors for text and highlighting
    const quickAccessColors = type === 'text' 
      ? ['#000000', '#1F2937', '#2563EB', '#7C3AED', '#DC2626', '#047857'] // Text
      : ['#FFFBEB', '#F0FDF4', '#EFF6FF', '#FEF2F2', '#F5F3FF', '#ECFEFF']; // Highlight
    
    return (
      <div className="p-3">
        {/* Color picker tabs */}
        <div className="flex items-center border-b mb-3">
          <button
            onClick={() => setColorMode('palette')}
            className={`px-3 py-1.5 text-xs font-medium -mb-px ${
              colorMode === 'palette' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Palettes
          </button>
          <button
            onClick={() => setColorMode('specialized')}
            className={`px-3 py-1.5 text-xs font-medium -mb-px ${
              colorMode === 'specialized' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {type === 'text' ? 'Dark Colors' : 'Light Colors'}
          </button>
          <button
            onClick={() => setColorMode('recent')}
            className={`px-3 py-1.5 text-xs font-medium -mb-px ${
              colorMode === 'recent' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            disabled={recentColors.length === 0}
          >
            Recent
          </button>
        </div>
        
        {/* Quick access colors row */}
        <div className="mb-3">
          <div className="text-xs font-medium mb-1.5 text-gray-600 dark:text-gray-400">Quick Colors</div>
          <div className="flex gap-1">
            {quickAccessColors.map((color, index) => (
              <button
                key={`quick-${index}`}
                className="w-7 h-7 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                style={{ 
                  backgroundColor: color,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
                onClick={() => applyColor(color)}
                aria-label={`Quick ${type === 'text' ? 'text' : 'highlight'} color: ${color}`}
                title={color}
              />
            ))}
            <button
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              onClick={() => document.getElementById('custom-color-picker')?.click()}
              aria-label="Custom color"
              title="Choose custom color"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        {colorMode === 'palette' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Color Palettes</div>
              <div className="flex flex-wrap gap-1">
                {[0, 1, 2, 3, 4].map((index) => (
                  <button
                    key={index}
                    className={`w-5 h-5 rounded-sm border ${selectedPalette === index ? 'ring-2 ring-blue-500' : ''}`}
                    style={{
                      backgroundColor: colorPalettes[index][0],
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                    onClick={() => setSelectedPalette(index)}
                    aria-label={`Color palette ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Specialty</div>
              <div className="flex flex-wrap gap-1">
                {[5, 6, 7, 8, 9].map((index) => (
                  <button
                    key={index}
                    className={`w-5 h-5 rounded-sm border ${selectedPalette === index ? 'ring-2 ring-blue-500' : ''}`}
                    style={{
                      backgroundColor: colorPalettes[index][0],
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                    onClick={() => setSelectedPalette(index)}
                    aria-label={`Color palette ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Color grid */}
        <div className={`grid ${colorMode === 'specialized' ? 'grid-cols-4' : 'grid-cols-5'} gap-2 mb-3`}>
          {getColors().map((color, index) => (
            <button
              key={index}
              className="w-8 h-8 rounded-full border border-gray-300 hover:scale-110 transition-transform"
              style={{ 
                backgroundColor: color,
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              onClick={() => applyColor(color)}
              aria-label={`${type === 'text' ? 'Text' : 'Highlight'} color: ${color}`}
              title={color}
            />
          ))}
        </div>
        
        {/* Custom color picker */}
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">Custom Color</div>
          <div className="flex items-center gap-2">
            <label className="w-10 h-8 rounded border border-gray-300 overflow-hidden cursor-pointer">
              <input 
                id="custom-color-picker"
                type="color" 
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-10 h-8 cursor-pointer border-0 m-0 p-0"
                style={{ transform: "scale(1.5)", transformOrigin: "top left" }}
              />
            </label>
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="flex-1 text-xs p-1 border rounded"
              placeholder="#RRGGBB"
            />
            <button
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              onClick={() => applyColor(customColor)}
            >
              Apply
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'].map(color => (
              <button
                key={color}
                className="w-5 h-5 rounded-sm border border-gray-300"
                style={{ backgroundColor: color }}
                onClick={() => setCustomColor(color)}
                aria-label={`Set custom color to ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add font size formatting capability
  const fontSizes = [
    { label: 'Tiny', value: '10px' },
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '16px' },
    { label: 'Medium', value: '18px' },
    { label: 'Large', value: '20px' },
    { label: 'XL', value: '24px' },
    { label: '2XL', value: '30px' },
  ];

  // Add Font Size Picker Component
  const FontSizePicker = () => {
    const [selectedSize, setSelectedSize] = useState(fontSizes[2].value); // Default to Normal (16px)
    
    const decreaseFontSize = () => {
      const currentIndex = fontSizes.findIndex(size => size.value === selectedSize);
      if (currentIndex > 0) {
        const newSize = fontSizes[currentIndex - 1].value;
        setSelectedSize(newSize);
        applyFormatting('fontSize', newSize);
      }
    };
    
    const increaseFontSize = () => {
      const currentIndex = fontSizes.findIndex(size => size.value === selectedSize);
      if (currentIndex < fontSizes.length - 1) {
        const newSize = fontSizes[currentIndex + 1].value;
        setSelectedSize(newSize);
        applyFormatting('fontSize', newSize);
      }
    };
    
    return (
      <div className="p-2">
        <div className="text-xs font-medium mb-2">Font Size</div>
        
        <div className="flex items-center justify-between mb-3 bg-gray-50 dark:bg-gray-800/40 p-1 rounded-md">
          <button
            className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={decreaseFontSize}
            aria-label="Decrease font size"
          >
            <span className="text-lg font-bold">A-</span>
          </button>
          
          <div className="px-2 py-1 text-sm font-medium">
            {fontSizes.find(size => size.value === selectedSize)?.label || 'Normal'}
          </div>
          
          <button
            className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={increaseFontSize}
            aria-label="Increase font size"
          >
            <span className="text-lg font-bold">A+</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-1">
          {fontSizes.map((size, index) => (
            <button
              key={index}
              className={`text-left px-2 py-1 rounded transition-colors ${selectedSize === size.value ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              style={{ fontSize: size.value }}
              onClick={() => {
                setSelectedSize(size.value);
                applyFormatting('fontSize', size.value);
              }}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Replace the FormattingToolbar component with a redesigned expert layout
  const FormattingToolbar = () => {
    return (
      <TooltipProvider>
        <div className="mb-4">
          {/* Main formatting toolbar */}
          <div 
            className="sticky top-0 z-10 border rounded-xl p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-md transition-colors"
            style={{
              boxShadow: scrollPosition > 100 
                ? '0 8px 16px rgba(0, 0, 0, 0.1)' 
                : '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Row 1: Text Style | Size and Heading */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Text Style */}
              <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg shadow-sm hover:shadow transition-all border-0">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-800/40 py-1 px-2 rounded-full mr-2">Text Style</span>
                </div>
                
                <div className="flex items-center justify-evenly gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('bold') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('bold')}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bold</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('italic') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('italic')}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Italic</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('underline') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('underline')}
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Underline</TooltipContent>
                  </Tooltip>
                  
                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                          >
                            <Paintbrush className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0 shadow-lg rounded-lg border-gray-200">
                          <ColorPicker type="text" />
                        </PopoverContent>
                      </Popover>
                    </TooltipTrigger>
                    <TooltipContent>Text color</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                          >
                            <Highlighter className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0 shadow-lg rounded-lg border-gray-200">
                          <ColorPicker type="highlight" />
                        </PopoverContent>
                      </Popover>
                    </TooltipTrigger>
                    <TooltipContent>Highlight</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Size & Headings */}
              <div className="p-2 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20 rounded-lg shadow-sm hover:shadow transition-all border-0">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-800/40 py-1 px-2 rounded-full mr-2">Size & Headings</span>
                </div>
                
                <div className="flex items-center justify-evenly gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                          >
                            <Type className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-52 p-0 shadow-lg rounded-lg border-gray-200">
                          <FontSizePicker />
                        </PopoverContent>
                      </Popover>
                    </TooltipTrigger>
                    <TooltipContent>Font size</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('h1') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('h1')}
                      >
                        <Heading1 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>H1</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('h2') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('h2')}
                      >
                        <Heading2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>H2</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('h3') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('h3')}
                      >
                        <Heading3 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>H3</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('normal') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('normal')}
                      >
                        <span className="text-xs font-bold">P</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Normal</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            {/* Row 2: Lists and Layout | Insert */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Lists and Layout */}
              <div className="p-2 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg shadow-sm hover:shadow transition-all border-0">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-800/40 py-1 px-2 rounded-full mr-2">Lists & Layout</span>
                </div>
                
                <div className="flex items-center justify-evenly gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('ul') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('ul')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bullets</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('ol') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('ol')}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Numbers</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isFormatActive('quote') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}`}
                        onClick={() => applyFormatting('quote')}
                      >
                        <Quote className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Quote</TooltipContent>
                  </Tooltip>
                  
                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('align', 'left')}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Left</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('align', 'center')}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Center</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('align', 'right')}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Right</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Insert */}
              <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg shadow-sm hover:shadow transition-all border-0">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-800/40 py-1 px-2 rounded-full mr-2">Insert</span>
                </div>
                
                <div className="flex items-center justify-evenly gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('link')}
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Link</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('line')}
                      >
                        <MinusSquare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Divider</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('code')}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Code</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('image')}
                      >
                        <Image className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Image</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('table')}
                      >
                        <Table className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Table</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            {/* Row 3: Tools | Additional Features */}
            <div className="grid grid-cols-2 gap-3">
              {/* Tools */}
              <div className="p-2 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/20 dark:to-cyan-950/20 rounded-lg shadow-sm hover:shadow transition-all border-0">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-100/60 dark:bg-sky-800/40 py-1 px-2 rounded-full mr-2">Tools</span>
                </div>
                
                <div className="flex items-center justify-evenly gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={clearFormatting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={handleImport}
                      >
                        <FileUp className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Import</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={handleExport}
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => document.execCommand('copy')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => document.execCommand('cut')}
                      >
                        <Scissors className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cut</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Additional Features */}
              <div className="p-2 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-lg shadow-sm hover:shadow transition-all border-0">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-800/40 py-1 px-2 rounded-full mr-2">Advanced</span>
                </div>
                
                <div className="flex items-center justify-evenly gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('strikethrough')}
                      >
                        <Strikethrough className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Strike</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('superscript')}
                      >
                        <Superscript className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Superscript</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('subscript')}
                      >
                        <Subscript className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Subscript</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('indent')}
                      >
                        <Indent className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Indent</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => applyFormatting('outdent')}
                      >
                        <Outdent className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Outdent</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            {/* Status indicator */}
            {editedNote.title.trim() && (
              <div className="mt-3 flex justify-end">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 transition-colors">
                  {isSaving ? (
                    <>
                      <Clock className="h-3 w-3 text-amber-500 animate-pulse" />
                      <span className="text-amber-600 dark:text-amber-400">Saving your note...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">All changes saved</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
    );
  };

  const handleImageFromUrlSubmit = () => {
    if (!imageUrl) return;
    
    console.log("Inserting image from URL:", imageUrl);
    insertImage(imageUrl);
    setImageUrl('');
    setImageDialogOpen(false);
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Uploading local image:", file.name);
    
    // Create a local URL for the selected file
    const localImageUrl = URL.createObjectURL(file);
    insertImage(localImageUrl);
    
    // Reset the input for future uploads
    if (e.target) e.target.value = '';
    setImageDialogOpen(false);
  };

  const insertImage = (url: string) => {
    try {
      console.log("Creating image element with URL:", url);
      
      // Create image HTML with resize and rotation controls
      const imageHTML = `
        <div class="image-wrapper" style="position:relative; margin:15px 0; text-align:center;">
          <img src="${url}" alt="Image" 
            style="display:block; max-width:100%; width:400px; height:auto; margin:0 auto; 
                   border:1px solid #e5e7eb; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);
                   transform:rotate(0deg);"
            data-rotation="0"
          />
          <div class="image-controls" style="position:absolute; bottom:5px; right:5px; display:none; background:white; 
                    border-radius:4px; padding:4px; box-shadow:0 2px 4px rgba(0,0,0,0.2); z-index:10;" 
                contenteditable="false">
            <div class="control-group" style="display:flex; margin-bottom:4px; border-bottom:1px solid #eee; padding-bottom:4px;">
              <button class="resize-smaller" title="Decrease size" style="width:28px; height:28px; cursor:pointer; 
                      background:white; border:1px solid #ccc; border-radius:3px; margin:0 2px;">−</button>
              <button class="resize-reset" title="Reset size" style="width:28px; height:28px; cursor:pointer; 
                      background:white; border:1px solid #ccc; border-radius:3px; margin:0 2px;">↺</button>
              <button class="resize-larger" title="Increase size" style="width:28px; height:28px; cursor:pointer; 
                      background:white; border:1px solid #ccc; border-radius:3px; margin:0 2px;">+</button>
            </div>
            <div class="control-group" style="display:flex;">
              <button class="rotate-left" title="Rotate left" style="width:28px; height:28px; cursor:pointer; 
                      background:white; border:1px solid #ccc; border-radius:3px; margin:0 2px;">↶</button>
              <button class="rotate-reset" title="Reset rotation" style="width:28px; height:28px; cursor:pointer; 
                      background:white; border:1px solid #ccc; border-radius:3px; margin:0 2px;">↑</button>
              <button class="rotate-right" title="Rotate right" style="width:28px; height:28px; cursor:pointer; 
                      background:white; border:1px solid #ccc; border-radius:3px; margin:0 2px;">↷</button>
            </div>
          </div>
        </div>
        <p><br></p>
      `;
      
      // Insert the HTML directly
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, imageHTML);
        console.log("Image inserted successfully");
        
        // Add event listeners for image controls
        setTimeout(() => {
          const imageWrappers = editorRef.current?.querySelectorAll('.image-wrapper');
          if (imageWrappers && imageWrappers.length > 0) {
            const latestWrapper = imageWrappers[imageWrappers.length - 1];
            
            // Show controls on hover
            latestWrapper.addEventListener('mouseenter', () => {
              const controls = latestWrapper.querySelector('.image-controls');
              if (controls) (controls as HTMLElement).style.display = 'block';
            });
            
            latestWrapper.addEventListener('mouseleave', () => {
              const controls = latestWrapper.querySelector('.image-controls');
              if (controls) (controls as HTMLElement).style.display = 'none';
            });
            
            // Get the image and control buttons
            const img = latestWrapper.querySelector('img') as HTMLImageElement;
            const smaller = latestWrapper.querySelector('.resize-smaller') as HTMLButtonElement;
            const reset = latestWrapper.querySelector('.resize-reset') as HTMLButtonElement;
            const larger = latestWrapper.querySelector('.resize-larger') as HTMLButtonElement;
            const rotateLeft = latestWrapper.querySelector('.rotate-left') as HTMLButtonElement;
            const rotateReset = latestWrapper.querySelector('.rotate-reset') as HTMLButtonElement;
            const rotateRight = latestWrapper.querySelector('.rotate-right') as HTMLButtonElement;
            
            if (img) {
              // Store original width for reset
              const originalWidth = img.clientWidth;
              
              // Size controls
              if (smaller) {
                smaller.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentWidth = img.clientWidth;
                  img.style.width = `${Math.max(50, currentWidth - 50)}px`;
                  handleContentChange();
                });
              }
              
              if (reset) {
                reset.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  img.style.width = `${originalWidth}px`;
                  handleContentChange();
                });
              }
              
              if (larger) {
                larger.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentWidth = img.clientWidth;
                  img.style.width = `${Math.min(800, currentWidth + 50)}px`;
                  handleContentChange();
                });
              }
              
              // Rotation controls
              if (rotateLeft) {
                rotateLeft.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentRotation = parseInt(img.dataset.rotation || '0');
                  const newRotation = (currentRotation - 90) % 360;
                  img.style.transform = `rotate(${newRotation}deg)`;
                  img.dataset.rotation = newRotation.toString();
                  handleContentChange();
                });
              }
              
              if (rotateReset) {
                rotateReset.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  img.style.transform = 'rotate(0deg)';
                  img.dataset.rotation = '0';
                  handleContentChange();
                });
              }
              
              if (rotateRight) {
                rotateRight.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentRotation = parseInt(img.dataset.rotation || '0');
                  const newRotation = (currentRotation + 90) % 360;
                  img.style.transform = `rotate(${newRotation}deg)`;
                  img.dataset.rotation = newRotation.toString();
                  handleContentChange();
                });
              }
            }
          }
        }, 100);
        
        // Update content state
        handleContentChange();
      } else {
        console.error("Editor reference is not available");
        alert('Editor not found. Please try again.');
      }
    } catch (error) {
      console.error('Error inserting image:', error);
      alert('Failed to insert image. Please try again.');
    }
  };

  const insertTable = (rows: number, cols: number) => {
    if (rows <= 0 || cols <= 0) return;
    
    try {
      console.log(`Creating table with ${rows} rows and ${cols} columns`);
      
      // Create table HTML with controls for resizing
      let tableHTML = `
        <div class="table-container" style="position:relative; margin:16px 0; width:100%;">
          <div class="table-controls" style="position:absolute; top:-34px; left:0; display:none; gap:4px; background:white; 
                     padding:4px; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.2); z-index:10;" contenteditable="false">
            <button class="add-row" title="Add row" style="cursor:pointer; background:white; border:1px solid #ccc; border-radius:3px; padding:2px 5px; font-size:12px;">Add Row</button>
            <button class="remove-row" title="Remove row" style="cursor:pointer; background:white; border:1px solid #ccc; border-radius:3px; padding:2px 5px; font-size:12px;">Remove Row</button>
            <button class="add-col" title="Add column" style="cursor:pointer; background:white; border:1px solid #ccc; border-radius:3px; padding:2px 5px; font-size:12px;">Add Column</button>
            <button class="remove-col" title="Remove column" style="cursor:pointer; background:white; border:1px solid #ccc; border-radius:3px; padding:2px 5px; font-size:12px;">Remove Column</button>
          </div>
          <table style="width:100%; border-collapse:collapse; border:1px solid #e5e7eb; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
            <thead>
              <tr>`;
      
      // Create header row
      for (let j = 0; j < cols; j++) {
        tableHTML += `<th style="padding:8px; border:1px solid #e5e7eb; background-color:#f9fafb; font-weight:bold; text-align:left;">Header ${j+1}</th>`;
      }
      
      tableHTML += `</tr>
            </thead>
            <tbody>`;
      
      // Create table body
      for (let i = 0; i < rows - 1; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
          tableHTML += `<td style="padding:8px; border:1px solid #e5e7eb;">Cell ${i+1},${j+1}</td>`;
        }
        tableHTML += '</tr>';
      }
      
      tableHTML += `</tbody>
          </table>
          <div class="table-size-handle" style="position:absolute; bottom:0; right:0; width:12px; height:12px; 
                     cursor:nwse-resize; background:linear-gradient(135deg, transparent 0%, transparent 50%, #3b82f6 50%, #3b82f6 100%); 
                     display:none; z-index:5;"></div>
        </div>
        <p><br></p>`;
      
      // Insert the table HTML into the editor
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, tableHTML);
        console.log("Table inserted successfully");
        
        // Add event listeners for table controls
        setTimeout(() => {
          const tableContainers = editorRef.current?.querySelectorAll('.table-container');
          if (tableContainers && tableContainers.length > 0) {
            const latestContainer = tableContainers[tableContainers.length - 1];
            
            // Show controls on hover
            latestContainer.addEventListener('mouseenter', () => {
              const controls = latestContainer.querySelector('.table-controls');
              const sizeHandle = latestContainer.querySelector('.table-size-handle');
              if (controls) (controls as HTMLElement).style.display = 'flex';
              if (sizeHandle) (sizeHandle as HTMLElement).style.display = 'block';
            });
            
            latestContainer.addEventListener('mouseleave', () => {
              const controls = latestContainer.querySelector('.table-controls');
              const sizeHandle = latestContainer.querySelector('.table-size-handle');
              if (controls) (controls as HTMLElement).style.display = 'none';
              if (sizeHandle) (sizeHandle as HTMLElement).style.display = 'none';
            });
            
            // Get the table and buttons
            const table = latestContainer.querySelector('table') as HTMLTableElement;
            const addRow = latestContainer.querySelector('.add-row') as HTMLButtonElement;
            const removeRow = latestContainer.querySelector('.remove-row') as HTMLButtonElement;
            const addCol = latestContainer.querySelector('.add-col') as HTMLButtonElement;
            const removeCol = latestContainer.querySelector('.remove-col') as HTMLButtonElement;
            const sizeHandle = latestContainer.querySelector('.table-size-handle') as HTMLDivElement;
            
            if (table) {
              // Resize with handle
              if (sizeHandle) {
                let isResizing = false;
                let startX = 0;
                let startY = 0;
                let startWidth = 0;
                
                sizeHandle.addEventListener('mousedown', (e) => {
                  isResizing = true;
                  startX = e.clientX;
                  startY = e.clientY;
                  startWidth = table.offsetWidth;
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                  
                  e.preventDefault();
                  e.stopPropagation();
                });
                
                const handleMouseMove = (e: MouseEvent) => {
                  if (!isResizing) return;
                  
                  const deltaX = e.clientX - startX;
                  const newWidth = Math.max(300, startWidth + deltaX);
                  
                  table.style.width = `${newWidth}px`;
                  (latestContainer as HTMLElement).style.width = `${newWidth}px`;
                };
                
                const handleMouseUp = () => {
                  isResizing = false;
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                  handleContentChange();
                };
              }
              
              // Button controls for adding/removing rows and columns
              if (addRow) {
                addRow.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const tbody = table.querySelector('tbody');
                  if (tbody) {
                    const rows = tbody.querySelectorAll('tr');
                    const firstRow = rows[0];
                    const cellCount = firstRow ? firstRow.querySelectorAll('td').length : cols;
                    
                    const newRow = document.createElement('tr');
                    for (let i = 0; i < cellCount; i++) {
                      const cell = document.createElement('td');
                      cell.style.padding = '8px';
                      cell.style.border = '1px solid #e5e7eb';
                      cell.textContent = `Cell ${rows.length + 1},${i + 1}`;
                      newRow.appendChild(cell);
                    }
                    
                    tbody.appendChild(newRow);
                    handleContentChange();
                  }
                });
              }
              
              if (removeRow) {
                removeRow.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const tbody = table.querySelector('tbody');
                  if (tbody) {
                    const rows = tbody.querySelectorAll('tr');
                    if (rows.length > 1) {
                      tbody.removeChild(rows[rows.length - 1]);
                      handleContentChange();
                    }
                  }
                });
              }
              
              if (addCol) {
                addCol.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const thead = table.querySelector('thead');
                  const tbody = table.querySelector('tbody');
                  
                  if (thead && tbody) {
                    // Add header cell
                    const headerRow = thead.querySelector('tr');
                    if (headerRow) {
                      const headerCells = headerRow.querySelectorAll('th');
                      const newHeaderCell = document.createElement('th');
                      newHeaderCell.style.padding = '8px';
                      newHeaderCell.style.border = '1px solid #e5e7eb';
                      newHeaderCell.style.backgroundColor = '#f9fafb';
                      newHeaderCell.style.fontWeight = 'bold';
                      newHeaderCell.style.textAlign = 'left';
                      newHeaderCell.textContent = `Header ${headerCells.length + 1}`;
                      headerRow.appendChild(newHeaderCell);
                    }
                    
                    // Add body cells
                    const bodyRows = tbody.querySelectorAll('tr');
                    bodyRows.forEach((row, rowIndex) => {
                      const cell = document.createElement('td');
                      cell.style.padding = '8px';
                      cell.style.border = '1px solid #e5e7eb';
                      cell.textContent = `Cell ${rowIndex + 1},${row.cells.length + 1}`;
                      row.appendChild(cell);
                    });
                    
                    handleContentChange();
                  }
                });
              }
              
              if (removeCol) {
                removeCol.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const thead = table.querySelector('thead');
                  const tbody = table.querySelector('tbody');
                  
                  if (thead && tbody) {
                    // Get column count
                    const headerRow = thead.querySelector('tr');
                    if (headerRow) {
                      const headerCells = headerRow.querySelectorAll('th');
                      if (headerCells.length > 1) {
                        // Remove header cell
                        headerRow.removeChild(headerCells[headerCells.length - 1]);
                        
                        // Remove body cells
                        const bodyRows = tbody.querySelectorAll('tr');
                        bodyRows.forEach(row => {
                          const cells = row.querySelectorAll('td');
                          if (cells.length > 1) {
                            row.removeChild(cells[cells.length - 1]);
                          }
                        });
                        
                        handleContentChange();
                      }
                    }
                  }
                });
              }
              
              // Make cells editable
              const allCells = table.querySelectorAll('th, td');
              allCells.forEach(cell => {
                cell.setAttribute('contenteditable', 'true');
              });
            }
          }
        }, 100);
        
        // Update content state
        handleContentChange();
      } else {
        console.error("Editor reference is not available");
        alert('Editor not found. Please try again.');
      }
    } catch (error) {
      console.error('Error inserting table:', error);
      alert('Failed to insert table. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
            onClick={onCancel}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Notes</span>
          </Button>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleTogglePin}
              className={`flex items-center gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all ${editedNote.pinned ? 'border-yellow-500 text-yellow-500' : ''}`}
            >
              <Star className={`h-4 w-4 transition-colors ${editedNote.pinned ? 'fill-current text-yellow-500' : ''}`} />
              <span>{editedNote.pinned ? 'Pinned' : 'Pin Note'}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" 
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-1" />
              <span>Cancel</span>
            </Button>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all"
              onClick={handleSaveNote}
            >
              <Save className="h-4 w-4 mr-1" />
              <span>Save Note</span>
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center text-sm text-muted-foreground space-x-3">
          <span className="flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
            Created: {format(editedNote.createdAt, 'MMM d, yyyy h:mm a')}
          </span>
          {editedNote.updatedAt > editedNote.createdAt && (
            <span className="flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
              Updated: {format(editedNote.updatedAt, 'MMM d, yyyy h:mm a')}
            </span>
          )}
        </div>

        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-6 border border-gray-200 dark:border-gray-700 transition-colors hover:shadow-xl"
        >
          <div className="space-y-6">
            <div>
              <Input
                name="title"
                value={editedNote.title}
                onChange={handleChange}
                placeholder="Note Title"
                className="text-2xl font-semibold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.name}
                  variant={editedNote.category === category.name ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: editedNote.category === category.name ? category.color : 'transparent',
                    borderColor: category.color,
                    color: editedNote.category === category.name ? 'white' : undefined,
                  }}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>

            <div>
              <FormattingToolbar />
              <div
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="min-h-[350px] text-base p-5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto shadow-inner transition-all resize-y"
                onInput={handleContentChange}
                onFocus={handleEditorFocus}
                onBlur={handleEditorBlur}
                onClick={() => {
                  // Ensure the editor gets focus on first click
                  if (editorRef.current) {
                    editorRef.current.focus();
                    
                    // If content exists, check if we should position cursor at end or keep current selection
                    if (editorRef.current.innerHTML) {
                      const selection = window.getSelection();
                      
                      // Only set cursor to end if no text is currently selected
                      if (selection && selection.toString().length === 0) {
                        // Place cursor at the click position (which is the default browser behavior)
                        // No need to modify the selection as the browser handles this automatically
                      }
                    }
                    
                    // Set focused state to true immediately
                    setIsFocused(true);
                  }
                }}
                style={{ 
                  lineHeight: 1.8,
                  backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  minHeight: '350px',
                  maxHeight: '800px',
                  cursor: 'text' // Add text cursor to indicate it's clickable
                }}
                data-placeholder="Start typing your note here..."
              />
              <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                [contenteditable] {
                  outline: none;
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                
                /* Add editor placeholder text */
                [contenteditable][data-placeholder]:empty:before {
                  content: attr(data-placeholder);
                  color: #9ca3af;
                  pointer-events: none;
                }
                
                /* Improve readability of the editor */
                [contenteditable] {
                  line-height: 1.8;
                  letter-spacing: 0.01em;
                }
                
                /* Add styles for ctrl-clickable links */
                [contenteditable] a[data-ctrl-clickable="true"] {
                  cursor: pointer;
                  position: relative;
                }
                
                /* Image resize controls */
                .image-resize-handle {
                  z-index: 10;
                }
                
                .resize-controls {
                  display: flex;
                  gap: 4px;
                }
                
                .resize-controls button {
                  width: 20px;
                  height: 20px;
                  background: white;
                  border: 1px solid #ccc;
                  border-radius: 3px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                }
                
                .resize-controls button:hover {
                  background: #f1f5f9;
                }
                
                /* Table controls */
                .table-controls button {
                  background: white;
                  border: 1px solid #ccc;
                  border-radius: 3px;
                  padding: 2px 4px;
                  font-size: 12px;
                  cursor: pointer;
                }
                
                .table-controls button:hover {
                  background: #f1f5f9;
                }
                
                /* Make table cells editable with visual feedback */
                [contenteditable] td, [contenteditable] th {
                  position: relative;
                }
                
                [contenteditable] td:focus, [contenteditable] th:focus {
                  outline: 2px solid #3b82f6;
                  outline-offset: -2px;
                }
                
                /* Rest of existing styles */
                [contenteditable] h1 {
                  font-size: 2rem;
                  font-weight: 700;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                  line-height: 1.2;
                  letter-spacing: -0.01em;
                  color: #111827;
                  border-bottom: 1px solid #e5e7eb;
                  padding-bottom: 0.25rem;
                }
                [contenteditable] h2 {
                  font-size: 1.5rem;
                  font-weight: 600;
                  margin-top: 1.25rem;
                  margin-bottom: 0.5rem;
                  line-height: 1.25;
                  letter-spacing: -0.01em;
                  color: #1f2937;
                }
                [contenteditable] h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin-top: 1rem;
                  margin-bottom: 0.5rem;
                  line-height: 1.3;
                  color: #374151;
                }
                [contenteditable] p {
                  margin-bottom: 0.75rem;
                  line-height: 1.8;
                }
                [contenteditable] ul, [contenteditable] ol {
                  padding-left: 1.5rem;
                  margin-bottom: 0.75rem;
                  line-height: 1.7;
                }
                [contenteditable] li {
                  margin-bottom: 0.25rem;
                }
                [contenteditable] blockquote {
                  border-left: 3px solid #6b7280;
                  padding-left: 1rem;
                  font-style: italic;
                  margin: 1rem 0;
                  color: #4b5563;
                  background-color: rgba(243, 244, 246, 0.6);
                  padding: 0.75rem 1rem;
                  border-radius: 0.25rem;
                }
                [contenteditable] a {
                  color: #2563eb;
                  text-decoration: underline;
                  text-decoration-thickness: 1px;
                  text-underline-offset: 2px;
                  transition: all 0.2s ease;
                }
                [contenteditable] a:hover {
                  color: #1d4ed8;
                  text-decoration-thickness: 2px;
                }
                [contenteditable] hr {
                  border: none;
                  height: 2px;
                  background-color: #e5e7eb;
                  margin: 1.5rem 0;
                }
                .dark [contenteditable] h1 {
                  color: #f3f4f6;
                  border-bottom-color: #374151;
                }
                .dark [contenteditable] h2 {
                  color: #e5e7eb;
                }
                .dark [contenteditable] h3 {
                  color: #d1d5db;
                }
                .dark [contenteditable] blockquote {
                  background-color: rgba(55, 65, 81, 0.4);
                  border-left-color: #9ca3af;
                  color: #d1d5db;
                }
                .dark [contenteditable] a {
                  color: #3b82f6;
                }
                .dark [contenteditable] a:hover {
                  color: #60a5fa;
                }
                .dark [contenteditable] hr {
                  background-color: #374151;
                }
                
                /* Resize handle styling */
                .resize-y {
                  resize: vertical;
                  overflow: auto;
                  position: relative;
                }
                
                .resize-y::after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  width: 12px;
                  height: 12px;
                  background-image: linear-gradient(135deg, transparent 0%, transparent 50%, #cbd5e1 50%, #cbd5e1 100%);
                  cursor: ns-resize;
                  border-bottom-right-radius: 4px;
                }
                
                .dark .resize-y::after {
                  background-image: linear-gradient(135deg, transparent 0%, transparent 50%, #475569 50%, #475569 100%);
                }
              `}} />
              
              {showTips && (
                <div 
                  className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-3 text-sm relative"
                >
                  <button 
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    onClick={() => setShowTips(false)}
                    aria-label="Close tips"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Editor Tips
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 ml-6 list-disc">
                    <li>Click once anywhere in the editor to begin typing</li>
                    <li>Use the formatting toolbar to style your text (headings, bold, etc.)</li>
                    <li>Try the color tools to highlight important information</li>
                    <li>Double-click on text to select it for formatting</li>
                    <li>The grid background helps with visual organization</li>
                    <li>Use tags below to categorize your notes for easier searching</li>
                    <li>Your notes are automatically saved as you type</li>
                  </ul>
                </div>
              )}
            </div>

            <div 
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Tags</label>
                <div className="text-xs text-muted-foreground">
                  {editedNote.tags.length} tags
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="text-sm transition-all focus-within:ring-2 focus-within:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleAddTag} 
                  variant="outline" 
                  size="sm"
                  disabled={!newTag}
                  className="transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {editedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {editedNote.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="gap-1 pr-1 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm"
                    >
                      <span>{tag}</span>
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-colors"
            onClick={handleSaveNote}
          >
            <Save className="h-4 w-4 mr-1" />
            <span>Save Note</span>
          </Button>
        </div>
      </div>

      {/* Hidden file input for importing notes */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".json" 
        onChange={handleFileImport} 
      />
      
      {/* Image insertion dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">From URL</label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleImageFromUrlSubmit();
                    }
                  }}
                />
                <Button 
                  onClick={handleImageFromUrlSubmit} 
                  disabled={!imageUrl}
                  type="button"
                >
                  Insert
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">From Local File</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  ref={imageFileInputRef}
                  onChange={handleLocalImageUpload}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setImageDialogOpen(false)}
              type="button"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Table insertion dialog */}
      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rows</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Columns</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {Array.from({ length: Math.min(5, tableRows) }).map((_, rowIdx) => (
                <div key={`row-${rowIdx}`} className="flex">
                  {Array.from({ length: Math.min(5, tableCols) }).map((_, colIdx) => (
                    <div 
                      key={`cell-${rowIdx}-${colIdx}`} 
                      className="w-6 h-6 border border-gray-300 bg-gray-100"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setTableDialogOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setTableDialogOpen(true)}
              type="button"
            >
              Insert Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoteEditor; 
