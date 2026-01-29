'use client'

import React from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const BusinessDetails = ({ 
  params
} : {
  params: Promise<{ businessDetails: string }>
}) => {
  const businessId = (React.use(params)).businessDetails
  const router = useRouter()

  const users = [
    {
      "id": "1",
      "registration_date": "1/10/2024",
      "business_name": "Two Dudes",
      "industry": "Health",
      "key_contact": "jjthoi2@gmail.com",
      "street": "37 Billiard Lane",
      "suburb": "Johnsonville",
      "city": "Auckland",
      "region_state": "Auckland",
      "postcode": 5012,
      "country": "New Zealand",
      "contact_detail": "Jeremy Evans",
      "phone": "0234567890",
      "email": "1234Hi@gmail.com",
      "last_active_date": "26 Apr 2024",
      "total_items_sold_today": "450 Units",
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

  const user = users.find(user => user.id === businessId)

  return (
    <div className='p-8 space-y-4'>
      <h1 className="text-2xl font-bold">{user?.business_name}</h1>
      <Card>
        <div className='flex justify-between p-6'>
          <div className='w-full p-4 space-y-2 text-gray-400 font-medium'>
            Registered Address
          </div>
          <div className='w-full p-4 space-y-6'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Street</h3>
              <p className='border-b border-black'>{user?.street}</p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>City</h3>
              <p className='border-b border-black'>{user?.city}</p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Postcode</h3>
              <p className='border-b border-black'>{user?.postcode}</p>
            </div>
          </div>
          <div className='w-full p-4 space-y-6'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Suburb</h3>
              <p className='border-b border-black'>{user?.suburb}</p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Region/State</h3>
              <p className='border-b border-black'>{user?.region_state}</p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Country</h3>
              <p className='border-b border-black'>{user?.country}</p>
            </div>
          </div>
        </div>

        <hr className='mx-6'/>

        <div className='flex justify-between p-6'>
          <div className='w-full p-4 space-y-2 text-gray-400 font-medium'>
            Key Contacts
          </div>
          <div className='w-full p-4 space-y-6'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Contact Detail</h3>
              <p className='border-b border-black'>{user?.contact_detail}</p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Email</h3>
              <p className='border-b border-black'>{user?.email}</p>
            </div>
          </div>
          <div className='w-full p-4 space-y-6'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Phone</h3>
              <p className='border-b border-black'>{user?.phone}</p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Last Active Date</h3>
              <p className='border-b border-black'>{user?.last_active_date}</p>
            </div>
          </div>
        </div>

        <hr className='mx-6'/>

        <div className='flex justify-between p-6'>
          <div className='w-full p-4 space-y-2 text-gray-400 font-medium'>
            Listings
          </div>
          <div className='w-full p-4 space-y-6'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Total Items Sold (Today)</h3>
              <p className='border-b border-black'>{user?.total_items_sold_today}</p>
            </div>
          </div>
          <div className='w-full p-4 space-y-6'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Status</h3>
              <p className='border-b border-black'>{user?.status}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className='flex justify-center gap-10'>
        <Button variant="secondary" className='w-52' onClick={() => router.back()}>Back</Button>
        <Button variant="secondary" className='w-52'>Revenue</Button>
      </div>
    </div>
  )
}

export default BusinessDetails