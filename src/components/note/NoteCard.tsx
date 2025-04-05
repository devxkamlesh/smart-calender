import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash, Edit, Star, Calendar, Clock, Tag, ExternalLink, Bookmark, FileText, BookmarkPlus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Styles for formatted content
const formattedContentStyles = `
  .formatted-content h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .formatted-content h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .formatted-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .formatted-content p {
    margin-bottom: 0.5rem;
  }

  .formatted-content ul, .formatted-content ol {
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .formatted-content ul {
    list-style-type: disc;
  }

  .formatted-content ol {
    list-style-type: decimal;
  }

  .formatted-content li {
    margin-bottom: 0.25rem;
  }

  .formatted-content a {
    color: #3b82f6;
    text-decoration: underline;
  }

  .formatted-content blockquote {
    border-left: 3px solid #e2e8f0;
    padding-left: 1rem;
    font-style: italic;
    margin: 0.5rem 0;
  }
  
  /* Image styles */
  .formatted-content img {
    max-width: 100%;
    height: auto;
    margin: 8px auto;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
  }
  
  /* Table styles */
  .formatted-content table {
    width: 100% !important;
    border-collapse: collapse;
    margin: 10px 0;
    border: 1px solid #e5e7eb;
  }
  
  .formatted-content th {
    padding: 8px;
    border: 1px solid #e5e7eb;
    background-color: #f9fafb;
    font-weight: bold;
    text-align: left;
  }
  
  .formatted-content td {
    padding: 8px;
    border: 1px solid #e5e7eb;
  }
  
  /* Hide resize controls */
  .formatted-content .resize-controls,
  .formatted-content .table-controls {
    display: none !important;
  }
  
  /* Dark mode adjustments */
  .dark .formatted-content table {
    border-color: #374151;
  }
  
  .dark .formatted-content th {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  .dark .formatted-content td {
    border-color: #374151;
  }
  
  .dark .formatted-content img {
    border-color: #374151;
  }
`;

// Types
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

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onEdit, onTogglePin }) => {
  const truncateContent = (content: string, maxLength: number = 250) => {
    // Check if content is HTML
    const isHTML = /<\/?[a-z][\s\S]*>/i.test(content);
    
    // Create a temporary div to render HTML and extract text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Get the text content
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.length <= maxLength) {
      return {
        text: textContent,
        html: content,
        truncated: false
      };
    }
    
    // For HTML content, truncate carefully to avoid breaking tags
    if (isHTML) {
      // Try to find a good breaking point - look for closing tags
      const closingTagsToFind = ['</p>', '</div>', '</h1>', '</h2>', '</h3>', '<br>', '<br/>', '</li>', '</ul>', '</ol>', '</table>'];
      let cutPoint = -1;
      
      // Find the last closing tag within a reasonable range
      for (const tag of closingTagsToFind) {
        const pos = content.indexOf(tag, maxLength);
        if (pos !== -1 && (cutPoint === -1 || pos < cutPoint)) {
          cutPoint = pos + tag.length;
        }
      }
      
      // If we can't find a good breaking point, look before maxLength
      if (cutPoint === -1) {
        for (const tag of closingTagsToFind) {
          const pos = content.lastIndexOf(tag, maxLength);
          if (pos !== -1 && (cutPoint === -1 || pos > cutPoint)) {
            cutPoint = pos + tag.length;
          }
        }
      }
      
      // If still no good breaking point, just use a safe approximation
      if (cutPoint === -1) {
        // Look for the last > before maxLength
        const lastClosingBracket = content.lastIndexOf('>', maxLength);
        if (lastClosingBracket !== -1) {
          cutPoint = lastClosingBracket + 1;
        } else {
          // Fallback to a safe length
          cutPoint = Math.min(content.length, maxLength * 2);
        }
      }
      
      // Now ensure we're not breaking in the middle of a tag
      const truncatedHtml = content.substring(0, cutPoint);
      
      // Check if we have proper tag balance
      const openingTags = (truncatedHtml.match(/<[^\/][^>]*>/g) || []).length;
      const closingTags = (truncatedHtml.match(/<\/[^>]*>/g) || []).length;
      
      // If we have unclosed tags, add a safety wrapper
      const safeHtml = openingTags > closingTags 
        ? `<div class="truncated-content">${truncatedHtml}</div>` 
        : truncatedHtml;
      
      return {
        text: textContent.substring(0, maxLength) + '...',
        html: safeHtml + '<span class="truncated-marker">...</span>',
        truncated: true
      };
    }
    
    // For plain text, simple truncation
    return {
      text: textContent.substring(0, maxLength) + '...',
      html: textContent.substring(0, maxLength) + '...',
      truncated: true
    };
  };

  // Check if the content is HTML
  const isHTML = /<\/?[a-z][\s\S]*>/i.test(note.content);
  
  // Extract a preview of the content
  const contentPreview = truncateContent(note.content);

  // Format date to be more readable
  const formattedDate = format(note.updatedAt, 'MMM d, yyyy');
  const timeInfo = note.updatedAt > note.createdAt 
    ? `Updated ${format(note.updatedAt, 'MMM d, h:mm a')}`
    : `Created ${format(note.createdAt, 'MMM d, h:mm a')}`;

  // Function to generate gradient background based on note color
  const generateGradient = (color: string) => {
    // Create a more natural, subtle gradient
    return `linear-gradient(165deg, ${color}10, ${color}20, ${color}15)`;
  };

  // Function to generate contrasting text color for better readability
  const getContrastColor = (color: string) => {
    // More vibrant gradient colors for text
    if (color.includes('blue') || color.includes('indigo')) return 'from-blue-600 to-indigo-600';
    if (color.includes('emerald') || color.includes('green')) return 'from-emerald-600 to-green-600';
    if (color.includes('pink') || color.includes('violet')) return 'from-pink-600 to-violet-600';
    if (color.includes('amber') || color.includes('orange')) return 'from-amber-600 to-orange-500';
    if (color.includes('rose') || color.includes('red')) return 'from-rose-600 to-red-600';
    return 'from-slate-600 to-gray-600';
  };

  return (
    <TooltipProvider>
      <style>{formattedContentStyles}</style>
      <motion.div
        className={`
          group relative rounded-lg overflow-hidden h-full
          ${note.pinned ? 'ring-2 ring-pink-500/70 dark:ring-violet-500/70' : 'ring-1 ring-gray-200/60 dark:ring-gray-700/60'}
          shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm
          ${note.pinned ? 'bg-white/95 dark:bg-gray-800/95' : 'bg-white/95 dark:bg-gray-800/95'}
        `}
        style={{
          background: generateGradient(note.color)
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        whileHover={{ y: -4 }}
      >
        {/* Pinned Status Bar */}
        {note.pinned && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500/90 to-violet-500/90" />
        )}

        {/* Card Header */}
        <div 
          className={`
            px-4 py-3 flex justify-between items-center
            ${note.pinned 
              ? 'bg-gradient-to-r from-pink-50/90 to-violet-50/90 dark:from-pink-900/10 dark:to-violet-900/10 border-b border-pink-100/40 dark:border-violet-800/20' 
              : 'border-b border-gray-100/40 dark:border-gray-700/40'}
          `}
        >
          <div>
            <h3 
              className={`font-medium truncate ${
                note.pinned 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 dark:from-pink-400 dark:to-violet-400' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r ' + getContrastColor(note.color)
              }`}
            >
              {note.title || 'Untitled Note'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
              {note.category && (
                <Badge 
                  variant="outline" 
                  className={`
                    text-xs font-normal px-1.5 border-0
                    bg-${note.color}-50/80 text-${note.color}-700 dark:bg-${note.color}-900/30 dark:text-${note.color}-400
                    backdrop-blur-sm
                  `}
                >
                  {note.category}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`
              h-7 w-7 rounded-full
              ${note.pinned 
                ? 'text-pink-500 hover:text-pink-600 hover:bg-pink-50/80 dark:text-pink-400 dark:hover:text-pink-300 dark:hover:bg-pink-900/20' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700/50'}
              opacity-70 hover:opacity-100 transition-opacity
            `}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
          >
            <Star className={`h-4 w-4 ${note.pinned ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Card Content */}
        <div 
          className="p-4 cursor-pointer bg-white/60 dark:bg-gray-800/60"
          onClick={() => onEdit()}
        >
          {note.content && (
            <div className="prose-sm prose-gray dark:prose-invert max-w-none overflow-hidden text-gray-700 dark:text-gray-200">
              {isHTML ? (
                <div 
                  className="formatted-content"
                  dangerouslySetInnerHTML={{ __html: contentPreview.html }}
                />
              ) : (
                <p className="whitespace-pre-line">
                  {contentPreview.text}
                </p>
              )}
            </div>
          )}

          {/* Fade effect at bottom */}
          {contentPreview.truncated && (
            <div className="relative h-6 -mt-6 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-gray-800/90 to-transparent"></div>
            </div>
          )}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {note.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs py-0 px-1.5 bg-gray-50/70 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/60 cursor-default backdrop-blur-sm"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 flex justify-end gap-2 bg-gray-50/70 dark:bg-gray-800/50 border-t border-gray-100/40 dark:border-gray-700/40">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-violet-500 hover:text-violet-600 hover:bg-violet-50/80 dark:text-violet-400 dark:hover:text-violet-300 dark:hover:bg-violet-900/20 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Edit note</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50/80 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-900/20 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Delete note</TooltipContent>
          </Tooltip>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default NoteCard; 