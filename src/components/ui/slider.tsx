import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

/**
 * Slider Component
 * 
 * A beautiful and accessible slider component built on Radix UI.
 * 
 * @example Basic usage
 * ```tsx
 * <Slider defaultValue={[50]} max={100} step={1} />
 * ```
 * 
 * @example With labels and custom styles
 * ```tsx
 * <div className="space-y-2">
 *   <div className="flex justify-between">
 *     <label className="text-sm font-medium">Focus Duration</label>
 *     <span className="text-sm text-muted-foreground">{value}m</span>
 *   </div>
 *   <Slider 
 *     value={[value]} 
 *     onValueChange={(newValue) => setValue(newValue[0])} 
 *     min={5} 
 *     max={120} 
 *     step={5} 
 *     className="[&>div]:bg-calendar-subtle [&>div>div]:bg-calendar"
 *   />
 *   <div className="flex justify-between text-xs text-gray-500">
 *     <span>5m</span>
 *     <span>120m</span>
 *   </div>
 * </div>
 * ```
 * 
 * @example Range selection
 * ```tsx
 * <Slider 
 *   defaultValue={[25, 75]} 
 *   max={100} 
 *   step={1} 
 *   className="[&>div]:bg-gray-200 [&>div>div]:bg-calendar"
 * />
 * ```
 * 
 * Props:
 * - `value`: Controlled value(s) of the slider
 * - `defaultValue`: Default value(s) of the slider
 * - `min`: Minimum value (default: 0)
 * - `max`: Maximum value (default: 100) 
 * - `step`: Step value (default: 1)
 * - `onValueChange`: Callback when value changes
 * - `onValueCommit`: Callback when user finishes dragging
 * - `disabled`: Whether the slider is disabled
 * - `orientation`: "horizontal" or "vertical"
 * - `dir`: Text direction "ltr" or "rtl"
 * 
 * Styling:
 * - Use `className` for custom styling of the root element
 * - Target track with `[&>div]:bg-color` 
 * - Target range/filled part with `[&>div>div]:bg-color`
 * - Target thumb with `[&>button]:bg-color`
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
