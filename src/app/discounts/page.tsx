import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { DiscountsTable } from '@/app/dashboard/components/discounts/DiscountsTable'

const DiscountsPage = () => {

    return (
        <div className="p-6">
            <Card className='flex p-6 max-w-[200px] mb-6 border-2 border-primary'>
                <div className='text-xl font-medium mx-auto'>Challenges</div>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Discount</h2>

                    <DiscountsTable />
                </CardContent>
            </Card>

        </div>
    )
}

export default DiscountsPage
