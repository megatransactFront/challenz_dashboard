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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { ChevronDown } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";

const BusinessUserPage = () => {
  const router = useRouter()
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("Business Type")
  const [selectedCity, setSelectedCity] = useState<string>("Search City")
  const [selectedCountry, setSelectedCountry] = useState<string>("Search Country")
  const [manufacturers, setManufacturers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [displayData, setDisplayData] = useState<any[]>([])
  const [allData, setAllData] = useState<any[]>([]) // Store unfiltered data
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [manufacturerForm, setManufacturerForm] = useState({
    name: '',
    country: '',
    contact_email: '',
    phone_number: '',
    state: '',
    city: '',
    suburb: '',
    postcode: '',
    street: ''
  })

  // Fetch data from backend
  const city = ['Sydney', 'Melbourne', 'Wellington', 'Auckland', 'Brooklyn', 'Atlanta', 'Adelaide', 'Dunedin', 'Brisbane']
  const country = ['Australia', 'AUS', 'Singapore', 'America', 'USA', 'New Zealand', 'NZ']
  const businessTypes = ['Physical Stores', 'Challenz Exclusives', 'E-commerce Business', 'Branded Merchandise']
  const users = useMemo(() => [
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
  ], [])

  // Function to fetch manufacturers from Supabase
  const fetchManufacturers = async () => {
    try {
      setLoading(true)
      setError("")
      // Call your function to get all manufacturers
      const { data, error } = await supabase.rpc('get_all_manufacturers')
      if (error) throw error
      
      // Map manufacturers data to match the table structure
      const mappedManufacturers = (data || []).map((manufacturer: any) => ({
        id: manufacturer.manufacturer_id,
        registration_date: "N/A", // Not available in manufacturers table
        business_name: manufacturer.name,
        industry: "Challenz Exclusive", // Set as default for manufacturers
        key_contact: manufacturer.contact_email || manufacturer.phone_number || "N/A",
        address: [
          manufacturer.street,
          manufacturer.suburb,
          manufacturer.city,
          manufacturer.state,
          manufacturer.postcode,
          manufacturer.country
        ].filter(Boolean).join(", ") || "N/A",
        status: "Active", // Default status for manufacturers
        date_deregistered: "-"
      }))
      
      setManufacturers(mappedManufacturers)
      setAllData(mappedManufacturers) // Store unfiltered data
    } catch (error: any) {
      console.error('Error fetching manufacturers:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle business type selection
  const handleBusinessTypeChange = (type: string) => {
    setSelectedBusinessType(type)
    // Reset filters when changing business type
    setSelectedCity("Search City")
    setSelectedCountry("Search Country")
    
    if (type === 'Challenz Exclusives') {
      fetchManufacturers()
    } else {
      // Reset to hardcoded data for other business types
      setAllData(users)
      setDisplayData(users)
    }
  }

  // Filter data based on selected city and country
  const filterData = (data: any[], city: string, country: string) => {
    let filteredData = [...data]
    
    console.log('Filtering data:', { originalCount: data.length, city, country })

    if (city !== "Search City") {
      filteredData = filteredData.filter(item => {
        const addressMatch = item.address?.toLowerCase().includes(city.toLowerCase())
        console.log(`City filter - ${item.business_name}: ${item.address} -> ${addressMatch}`)
        return addressMatch
      })
    }

    if (country !== "Search Country") {
      filteredData = filteredData.filter(item => {
        const address = item.address?.toLowerCase() || ""
        let addressMatch = false
        
        // Handle different country name formats
        if (country.toLowerCase() === 'australia' || country.toLowerCase() === 'aus') {
          addressMatch = address.includes('australia') || address.includes('aus')
        } else if (country.toLowerCase() === 'america' || country.toLowerCase() === 'usa') {
          addressMatch = address.includes('america') || address.includes('usa')
        } else if (country.toLowerCase() === 'new zealand' || country.toLowerCase() === 'nz') {
          addressMatch = address.includes('new zealand') || address.includes('nz')
        } else {
          addressMatch = address.includes(country.toLowerCase())
        }
        
        console.log(`Country filter - ${item.business_name}: ${item.address} -> ${addressMatch}`)
        return addressMatch
      })
    }

    console.log('Filtered result count:', filteredData.length)
    return filteredData
  }

  // Handle city selection
  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    const filtered = filterData(allData, city, selectedCountry)
    setDisplayData(filtered)
  }

  // Handle country selection
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    const filtered = filterData(allData, selectedCity, country)
    setDisplayData(filtered)
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCity("Search City")
    setSelectedCountry("Search Country")
    setDisplayData(allData)
  }

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    setManufacturerForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Reset form
  const resetForm = () => {
    setManufacturerForm({
      name: '',
      country: '',
      contact_email: '',
      phone_number: '',
      state: '',
      city: '',
      suburb: '',
      postcode: '',
      street: ''
    })
  }

  // Submit manufacturer form
  const handleSubmitManufacturer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!manufacturerForm.name.trim()) {
      alert('Manufacturer name is required')
      return
    }

    try {
      setIsSubmitting(true)
      
      const { error } = await supabase
        .from('manufacturers')
        .insert([manufacturerForm])
        .select()

      if (error) throw error

      alert('Manufacturer added successfully!')
      setIsModalOpen(false)
      resetForm()
      
      // Refresh the manufacturers list
      fetchManufacturers()
      
    } catch (error: any) {
      console.error('Error adding manufacturer:', error)
      alert('Error adding manufacturer: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Initialize display data and apply filters when data changes
  useEffect(() => {
    if (selectedBusinessType === 'Challenz Exclusives') {
      const filtered = filterData(manufacturers, selectedCity, selectedCountry)
      setDisplayData(filtered)
    } else {
      const filtered = filterData(users, selectedCity, selectedCountry)
      setDisplayData(filtered)
      setAllData(users)
    }
  }, [manufacturers, users, selectedBusinessType, selectedCity, selectedCountry])

  // Initialize with hardcoded data
  useEffect(() => {
    setAllData(users)
    setDisplayData(users)
  }, [users])

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
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="border rounded-full p-3 flex gap-4">{selectedBusinessType} <ChevronDown /></DropdownMenuTrigger>
                <DropdownMenuContent>
                  {businessTypes.map((type, index) => (
                    <DropdownMenuItem 
                      key={index} 
                      onClick={() => handleBusinessTypeChange(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedBusinessType === 'Challenz Exclusives' && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
                      Add Manufacturer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Manufacturer</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitManufacturer} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name *</label>
                        <Input
                          value={manufacturerForm.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          placeholder="Enter manufacturer name"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            value={manufacturerForm.contact_email}
                            onChange={(e) => handleFormChange('contact_email', e.target.value)}
                            placeholder="Email address"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <Input
                            value={manufacturerForm.phone_number}
                            onChange={(e) => handleFormChange('phone_number', e.target.value)}
                            placeholder="Phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Street</label>
                        <Input
                          value={manufacturerForm.street}
                          onChange={(e) => handleFormChange('street', e.target.value)}
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Suburb</label>
                          <Input
                            value={manufacturerForm.suburb}
                            onChange={(e) => handleFormChange('suburb', e.target.value)}
                            placeholder="Suburb"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">City</label>
                          <Input
                            value={manufacturerForm.city}
                            onChange={(e) => handleFormChange('city', e.target.value)}
                            placeholder="City"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">State</label>
                          <Input
                            value={manufacturerForm.state}
                            onChange={(e) => handleFormChange('state', e.target.value)}
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Postcode</label>
                          <Input
                            value={manufacturerForm.postcode}
                            onChange={(e) => handleFormChange('postcode', e.target.value)}
                            placeholder="Postcode"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Country</label>
                        <Input
                          value={manufacturerForm.country}
                          onChange={(e) => handleFormChange('country', e.target.value)}
                          placeholder="Country"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsModalOpen(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? 'Adding...' : 'Add Manufacturer'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="flex gap-10">
              <Popover>
                <PopoverTrigger className="border rounded-full p-3 flex gap-4">{selectedCity} <ChevronDown /></PopoverTrigger>
                <PopoverContent>
                  <Command>
                    <CommandInput placeholder="Search City"/>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {
                      city.map((item: string, index: number) => (
                        <CommandItem 
                          key={index} 
                          onClick={() => handleCityChange(item)}
                        >
                          {item}
                        </CommandItem>
                      ))
                    }
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger className="border rounded-full p-3 flex gap-4">{selectedCountry} <ChevronDown /></PopoverTrigger>
                <PopoverContent>
                  <Command>
                    <CommandInput placeholder="Search Country"/>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {
                      country.map((item: string, index: number) => (
                        <CommandItem 
                          key={index} 
                          onClick={() => handleCountryChange(item)}
                        >
                          {item}
                        </CommandItem>
                      ))
                    }
                  </Command>
                </PopoverContent>
              </Popover>

              {(selectedCity !== "Search City" || selectedCountry !== "Search Country") && (
                <button 
                  onClick={clearFilters}
                  className="border border-red-300 rounded-full px-4 py-3 text-red-600 hover:bg-red-50 text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          {loading && (
            <div className="flex justify-center items-center p-8">
              <p>Loading...</p>
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center p-8 text-red-500">
              <p>Error: {error}</p>
            </div>
          )}
          {!loading && !error && (
            <>
              {(selectedCity !== "Search City" || selectedCountry !== "Search Country") && (
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 mb-4">
                  <p className="text-sm text-blue-700">
                    Active filters: 
                    {selectedCity !== "Search City" && <span className="ml-2 font-medium">City: {selectedCity}</span>}
                    {selectedCountry !== "Search Country" && <span className="ml-2 font-medium">Country: {selectedCountry}</span>}
                    <span className="ml-2">({displayData.length} results)</span>
                  </p>
                </div>
              )}
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
                  {displayData.length > 0 ? (
                    displayData.map((user, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:cursor-pointer`}
                        onClick={() => handleBusinessDetails(user.id)}
                      >
                        <td className="px-4 py-2">{user.registration_date || "N/A"}</td>
                        <td className="px-4 py-2">{user.business_name || "N/A"}</td>
                        <td className="px-4 py-2">{user.industry || "N/A"}</td>
                        <td className="px-4 py-2">{user.key_contact || "N/A"}</td>
                        <td className="px-4 py-2">{user.address || "N/A"}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : user.status === "Inactive"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {!user.date_deregistered || user.date_deregistered === "-" ? "—" : user.date_deregistered}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </Card>

    </div>
  )
}

export default BusinessUserPage