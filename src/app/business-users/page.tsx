import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { ChevronDown } from 'lucide-react';

const BusinessUserPage = () => {

  // Fetch data from backend
  const city = ['Sydney', 'Melbourne']
  const country = ['Australia', 'Singapore', 'America']

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Business Registration</h1>

      <Card className="flex justify-between bg-white font-bold rounded-xl p-5" >
        <div className="space-y-1">
          <p className="text-sm">Total Business</p>
          <p className="text-lg">12,455</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm">New Users (Today)</p>
          <p className="text-lg">5,455</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm">New Users (Week)</p>
          <p className="text-lg">7000</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm">New Users (Month)</p>
          <p className="text-lg">3000</p>
        </div>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger className="border rounded-full p-3 flex gap-4">Business Type <ChevronDown /></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Physical Stores</DropdownMenuItem>
                <DropdownMenuItem>Challenz Exclusives</DropdownMenuItem>
                <DropdownMenuItem>E-commerce Business</DropdownMenuItem>
                <DropdownMenuItem>Branded Merchandise</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-10">
              <Popover>
                <PopoverTrigger className="border rounded-full p-3 flex gap-4">Search City <ChevronDown /></PopoverTrigger>
                <PopoverContent>
                  <Command>
                    <CommandInput placeholder="Search City"/>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {
                      city.map((item: string, index: number) => (
                        <CommandItem key={index}>{item}</CommandItem>
                      ))
                    }
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger className="border rounded-full p-3 flex gap-4">Search Country <ChevronDown /></PopoverTrigger>
                <PopoverContent>
                  <Command>
                    <CommandInput placeholder="Search Country"/>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {
                      country.map((item: string, index: number) => (
                        <CommandItem key={index}>{item}</CommandItem>
                      ))
                    }
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default BusinessUserPage