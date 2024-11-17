import React from 'react';
import { ArrowLeft, Mail, Info } from 'lucide-react';
import type { PriceEstimate } from '../types';

interface EstimationResultProps {
  value: PriceEstimate;
  onNewEstimate: () => void;
}

export const EstimationResult: React.FC<EstimationResultProps> = ({ value, onNewEstimate }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Estimation de votre bien
        </h2>
        <div className="text-4xl font-bold text-blue-600 mb-4">
          {formatPrice(value.basePrice)}
        </div>
        <div className="text-lg text-gray-700 mb-4">
          Fourchette de prix: {formatPrice(value.minPrice)} - {formatPrice(value.maxPrice)}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          Prix au m²: {formatPrice(value.pricePerM2)}/m²
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Prix régional moyen: {formatPrice(value.regionalPricePerM2)}/m²
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-600" />
            Facteurs pris en compte dans l'estimation
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Localisation (canton et ville)</li>
            <li>• Prix moyens régionaux du marché 2024</li>
            <li>• Surface et nombre de pièces</li>
            <li>• Type de bien et ses caractéristiques</li>
            <li>• Année de construction</li>
            <li>• Vue et éléments extérieurs (balcon, terrasse)</li>
            <li>• Nombre d'étages et configuration</li>
          </ul>
        </div>

        <p className="text-gray-600 mb-6">
          Cette estimation est basée sur les données actuelles du marché immobilier suisse
          et les caractéristiques spécifiques de votre bien.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={onNewEstimate}
          className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Nouvelle estimation
        </button>

        <div className="text-sm text-gray-500">
          <Mail className="w-4 h-4 inline-block mr-1" />
          Le résultat a été envoyé à info@immo-rama.ch
        </div>
      </div>
    </div>
  );
};