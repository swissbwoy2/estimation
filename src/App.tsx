import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, MapPin, Ruler, Home, Send } from 'lucide-react';
import { PropertyForm } from './components/PropertyForm';
import { EstimationResult } from './components/EstimationResult';
import { calculateEstimate } from './utils/estimationLogic';
import { sendEmail } from './utils/emailService';
import type { PropertyData, PriceEstimate } from './types';

function App() {
  const [estimationResult, setEstimationResult] = useState<PriceEstimate | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<PropertyData>();

  const onSubmit = async (data: PropertyData) => {
    try {
      const estimate = await calculateEstimate(data);
      setEstimationResult(estimate);
      
      await sendEmail({
        to: 'info@immo-rama.ch',
        subject: 'Nouvelle estimation immobilière',
        propertyData: data,
        estimatedValue: estimate.basePrice
      });
    } catch (error) {
      console.error('Error calculating estimate:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Estimation Immobilière Suisse
          </h1>
          <p className="text-gray-600">
            Obtenez une estimation précise de votre bien immobilier en quelques clics
          </p>
        </header>

        {!estimationResult ? (
          <PropertyForm 
            register={register} 
            handleSubmit={handleSubmit} 
            onSubmit={onSubmit}
            errors={errors}
          />
        ) : (
          <EstimationResult 
            value={estimationResult}
            onNewEstimate={() => setEstimationResult(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;