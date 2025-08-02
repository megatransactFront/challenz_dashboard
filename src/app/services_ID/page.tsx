import ServiceForm from './components/ServiceForm';

export default function ServicesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Service</h1>
      <ServiceForm />
    </div>
  );
}
