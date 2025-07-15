'use client'

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
import { useRouter } from "next/navigation";

const BusinessUserPage = () => {
  const router = useRouter()

  // Fetch data from backend
  const city = ['Sydney', 'Melbourne']
  const country = ['Australia', 'Singapore', 'America']
  const users = [
    {
      "id": "1",
      "registration_date": "1/10/2024",
      "business_name": "Two Dudes",
      "industry": "Health",
      "key_contact": "jjthoi2@gmail.com",
      "address": "Wellington, NZ",
      "status": "Active",
      "date_deregistered": "-"
    },
    {
      "id": "2",
      "registration_date": "26/09/2024",
      "business_name": "Cetaphil",
      "industry": "Health",
      "key_contact": "0213456890",
      "address": "Sydney, AUS",
      "status": "Inactive",
      "date_deregistered": "23/09/2025"
    },
    {
      "id": "3",
      "registration_date": "15/09/2024",
      "business_name": "Frank Gree",
      "industry": "Fashion",
      "key_contact": "panbiochi4@hotmail.com",
      "address": "Brooklyn, USA",
      "status": "Active",
      "date_deregistered": "-"
    },
    {
      "id": "4",
      "registration_date": "3/09/2024",
      "business_name": "Peter Alexander",
      "industry": "Fashion",
      "key_contact": "tynmills66@gmail.com",
      "address": "Auckland, NZ",
      "status": "Active",
      "date_deregistered": "-"
    },
    {
      "id": "5",
      "registration_date": "27/08/2024",
      "business_name": "Ray Bans",
      "industry": "Fashion",
      "key_contact": "0213456890",
      "address": "Melbourne, AUS",
      "status": "Active",
      "date_deregistered": "-"
    },
    {
      "id": "6",
      "registration_date": "12/08/2024",
      "business_name": "Netflix",
      "industry": "Service",
      "key_contact": "ivandimi@gmail.com",
      "address": "Atlanta, USA",
      "status": "Inactive",
      "date_deregistered": "27/10/2025"
    },
    {
      "id": "7",
      "registration_date": "04/08/2024",
      "business_name": "Spotify",
      "industry": "Service",
      "key_contact": "0213456890",
      "address": "Adelaide, AUS",
      "status": "Active",
      "date_deregistered": "-"
    },
    {
      "id": "8",
      "registration_date": "22/07/2024",
      "business_name": "Apple",
      "industry": "Technology",
      "key_contact": "0213456890",
      "address": "Dunedin, NZ",
      "status": "Active",
      "date_deregistered": "-"
    },
    {
      "id": "9",
      "registration_date": "16/07/2024",
      "business_name": "Beats",
      "industry": "Technology",
      "key_contact": "fisher6452@gmail.com",
      "address": "Brisbane, AUS",
      "status": "Active",
      "date_deregistered": "-"
    },
    {
      "id": "10",
      "registration_date": "08/07/2024",
      "business_name": "Ecoya",
      "industry": "Health",
      "key_contact": "cfhr4321@gmail.com",
      "address": "Auckland, NZ",
      "status": "Active",
      "date_deregistered": "-"
    }
  ]

  const handleBusinessDetails = (businessId: string) => {
    router.push(`business-users/${businessId}`)
  }

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

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="font-semibold text-sm px-4 py-2">REGISTRATION DATE</th>
                <th className="font-semibold text-sm px-4 py-2">BUSINESS NAME</th>
                <th className="font-semibold text-sm px-4 py-2">INDUSTRY</th>
                <th className="font-semibold text-sm px-4 py-2">KEY CONTACT</th>
                <th className="font-semibold text-sm px-4 py-2">ADDRESS</th>
                <th className="font-semibold text-sm px-4 py-2">STATUS</th>
                <th className="font-semibold text-sm px-4 py-2">DATE DEREGISTERED</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:cursor-pointer`}
                  onClick={() => handleBusinessDetails(user.id)}
                >
                  <td className="px-4 py-2">{user.registration_date}</td>
                  <td className="px-4 py-2">{user.business_name}</td>
                  <td className="px-4 py-2">{user.industry}</td>
                  <td className="px-4 py-2">{user.key_contact}</td>
                  <td className="px-4 py-2">{user.address}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {user.date_deregistered === "-" ? "—" : user.date_deregistered}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  )
}

export default BusinessUserPage