import React from 'react'
import scss from './hotedetail.module.scss';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" ;
import { Link } from "react-router-dom";  
import { format } from "date-fns";
import { ArrowDown, Calendar as CalendarIcon,   Minus, Plus } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import clsx from 'clsx'; 

 
 
 
// import required modules

function Hoteldetail() {
   const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date(2025, 5, 12),
      to: new Date(2025, 6, 15),
    });

    const [childrenCount, setChildrenCount] = React.useState(0);
    const [childrenAges, setChildrenAges] = React.useState<number[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    
    const handleIncrement = () => {
      setChildrenCount((prev) => prev + 1);
      setChildrenAges((prev) => [...prev, 0]); // Default age is 0
    };
  
    const handleDecrement = () => {
      if (childrenCount > 0) {
        setChildrenCount((prev) => prev - 1);
        setChildrenAges((prev) => prev.slice(0, -1));
      }
    };
  
    const handleAgeChange = (index: number, value: number) => {
      const newAges = [...childrenAges];
      newAges[index] = value;
      setChildrenAges(newAges);
    };
 
 

  return (
    <>
      <div className={scss.common_page}>
          <section className={scss.filter_top}>
            <div className="container mx-auto">
                <div className={scss.filter_wrapper}>
                  <div className={scss.custom_form}>
                    <div className={scss.form_block}>
                      <div className={scss.filter_group}>
                        <div className={scss.input_block}>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="City/Location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {/* <SelectLabel>City/Location</SelectLabel> */}
                                <SelectItem value="jammu">Jammu</SelectItem>
                                <SelectItem value="kashmir">Kashmir</SelectItem> 
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className={scss.input_block}>
                            <Select>
                              <SelectTrigger >
                                <SelectValue placeholder="Room Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {/* <SelectLabel>City/Location</SelectLabel> */}
                                  <SelectItem value="jammu">Deluxe Room</SelectItem>
                                  <SelectItem value="kashmir">Super Deluxe Room</SelectItem> 
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                        </div>
                        <div className={scss.input_block}>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="date"
                                  variant={"outline"}
                                  className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateRange?.from ? (
                                    dateRange.to ? (
                                      <>
                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                        {format(dateRange.to, "LLL dd, y")}
                                      </>
                                    ) : (
                                      format(dateRange.from, "LLL dd, y")
                                    )
                                  ) : (
                                    <span>Pick a date range</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  initialFocus
                                  mode="range"
                                  defaultMonth={dateRange?.from}
                                  selected={dateRange}
                                  onSelect={setDateRange}
                                  numberOfMonths={2}
                                />
                              </PopoverContent>
                            </Popover>
                        </div>
                        <div className={scss.input_block}>
                            <Select>
                              <SelectTrigger >
                                <SelectValue placeholder="Rooms/ Cottages" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {/* <SelectLabel>City/Location</SelectLabel> */}
                                  <SelectItem value="jammu">1</SelectItem>
                                  <SelectItem value="kashmir">2</SelectItem> 
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                        </div>
                        <div className={scss.input_block}>
                            <Select>
                              <SelectTrigger >
                                <SelectValue placeholder="Extra bed" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {/* <SelectLabel>City/Location</SelectLabel> */}
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem> 
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                        </div>
                        <div className={scss.input_block}>
                            <Select>
                              <SelectTrigger >
                                <SelectValue placeholder="Meal Plan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {/* <SelectLabel>City/Location</SelectLabel> */}
                                  <SelectItem value="1">EP</SelectItem>
                                  <SelectItem value="2">MEP</SelectItem> 
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                        </div>
                        <div className={scss.input_block}>
                            <Select>
                              <SelectTrigger >
                                <SelectValue placeholder="Adults" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {/* <SelectLabel>City/Location</SelectLabel> */}
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem> 
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                        </div>
                        <div className={scss.input_block}>
                                                    <div className="relative">
                                                      <Popover open={isOpen} onOpenChange={setIsOpen}>
                                                        <PopoverTrigger asChild>
                                                          <Button
                                                            variant="outline"
                                                            className="w-full justify-between"
                                                            onClick={() => setIsOpen(!isOpen)}
                                                          >
                                                            Children (below 17): {childrenCount}
                                                          </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className={clsx(scss.age_body,"w-80 p-4")}>
                                                          <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                              <div>
                                                                <h4 className="font-medium">Children</h4>
                                                                <p className="text-sm text-muted-foreground">Ages 0-17</p>
                                                              </div>
                                                              <div className="flex items-center gap-2">
                                                                <Button
                                                                  variant="outline"
                                                                  size="icon"
                                                                  onClick={handleDecrement}
                                                                  disabled={childrenCount === 0}
                                                                >
                                                                  <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="w-8 text-center">{childrenCount}</span>
                                                                <Button
                                                                  variant="outline"
                                                                  size="icon"
                                                                  onClick={handleIncrement}
                                                                >
                                                                  <Plus className="h-4 w-4" />
                                                                </Button>
                                                              </div>
                                                            </div>
                                                            {childrenAges.map((age, index) => (
                                                              <div key={index} className="flex items-center justify-between">
                                                                <span>Child {index + 1}</span>
                                                                <Select
                                                                  value={age.toString()}
                                                                  onValueChange={(value) => handleAgeChange(index, parseInt(value))}
                                                                >
                                                                  <SelectTrigger className="w-[100px]">
                                                                    <SelectValue placeholder="Age" />
                                                                  </SelectTrigger>
                                                                  <SelectContent>
                                                                    {Array.from({ length: 18 }, (_, i) => (
                                                                      <SelectItem key={i} value={i.toString()}>
                                                                        {i}
                                                                      </SelectItem>
                                                                    ))}
                                                                  </SelectContent>
                                                                </Select>
                                                              </div>
                                                            ))}
                                                          </div>
                                                        </PopoverContent>
                                                      </Popover>
                                                    </div>
                        </div>
                        <div className={scss.input_block}>
                          <Link role="button" className={scss.search_btn} to={"/hotel-list"}><span>Search</span> <div className={scss.search_icon}><ArrowDown /></div></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </section>

          <section className={scss.hotel_photos}>
            <div className='container mx-auto'>
              <div className={scss.photo_wrapper}>
                <div className={scss.w_50}>
                    <div className={scss.photo_block}>
                      <img
                        src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/hp-1.png`}
                        alt="image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                </div>
                <div className={scss.w_50}>
                  <div className={scss.photo_block_wrapper}> 
                    <div className={scss.photo_block}>
                      <img
                        src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/hp-2.png`}
                        alt="image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={scss.photo_block}>
                      <img
                        src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/hp-3.png`}
                        alt="image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={scss.photo_block}>
                      <img
                        src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/hp-4.png`}
                        alt="image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={scss.photo_block}>
                      <img
                        src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/hp-5.png`}
                        alt="image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
         
      </div>
    </>
  )
}

export default Hoteldetail