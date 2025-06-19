const BusinessUserPage = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Business Registration</h1>
      <div className="flex justify-between bg-white font-bold rounded-xl p-5">
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
      </div>
      
            
    </div>
  )
}

export default BusinessUserPage