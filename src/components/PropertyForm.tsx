import React from 'react';
import { Building2, MapPin, Ruler, Home, ChevronRight, Bath, Layers, DoorOpen, Mountain } from 'lucide-react';
import type { PropertyFormProps } from '../types';
import { validateSwissAddress } from '../utils/geocodingService';

const cantons = [
  'Genève', 'Vaud', 'Neuchâtel', 'Jura', 'Fribourg', 'Valais', 'Berne',
  'Zürich', 'Bâle-Ville', 'Bâle-Campagne', 'Soleure', 'Argovie', 'Lucerne',
  'Zoug', 'Schwyz', 'Uri', 'Glaris', 'Saint-Gall', 'Appenzell RE', 'Appenzell RI',
  'Thurgovie', 'Schaffhouse', 'Grisons', 'Tessin'
];

const views = [
  'Dégagée',
  'Lac',
  'Montagnes',
  'Ville',
  'Jardin',
  'Standard'
];

export const PropertyForm: React.FC<PropertyFormProps> = ({
  register,
  handleSubmit,
  onSubmit,
  errors
}) => {
  const [propertyType, setPropertyType] = React.useState('');
  const [isAddressValid, setIsAddressValid] = React.useState(true);

  const handleAddressBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const address = event.target.value;
    if (address) {
      const isValid = await validateSwissAddress(address);
      setIsAddressValid(isValid);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6">
      <div className="space-y-6">
        {/* Type de bien */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            Type de bien
          </label>
          <select
            {...register('propertyType', { required: 'Ce champ est requis' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Sélectionnez le type de bien</option>
            <option value="apartment">Appartement</option>
            <option value="house">Maison individuelle</option>
            <option value="villa">Villa</option>
            <option value="building">Immeuble</option>
            <option value="land">Terrain</option>
          </select>
          {errors.propertyType && (
            <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>
          )}
        </div>

        {/* Adresse */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Adresse complète
          </label>
          <input
            type="text"
            {...register('address', { required: 'L\'adresse est requise' })}
            className={`w-full p-3 border ${!isAddressValid ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Rue et numéro"
            onBlur={handleAddressBlur}
          />
          {!isAddressValid && (
            <p className="text-red-500 text-sm mt-1">Adresse non trouvée en Suisse</p>
          )}
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Code postal */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Code postal
          </label>
          <input
            type="text"
            {...register('postalCode', { 
              required: 'Le code postal est requis',
              pattern: {
                value: /^[0-9]{4}$/,
                message: 'Code postal invalide (format: 1234)'
              }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Code postal"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
          )}
        </div>

        {/* Ville */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Ville
          </label>
          <input
            type="text"
            {...register('city', { required: 'La ville est requise' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ville"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Canton */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Canton
          </label>
          <select
            {...register('canton', { required: 'Ce champ est requis' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez le canton</option>
            {cantons.map(canton => (
              <option key={canton} value={canton}>{canton}</option>
            ))}
          </select>
          {errors.canton && (
            <p className="text-red-500 text-sm mt-1">{errors.canton.message}</p>
          )}
        </div>

        {propertyType !== 'land' && (
          <>
            {/* Nombre de pièces */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <DoorOpen className="w-5 h-5 mr-2 text-blue-600" />
                Nombre de pièces
              </label>
              <input
                type="number"
                step="0.5"
                {...register('rooms', {
                  required: 'Ce champ est requis',
                  min: { value: 1, message: 'Minimum 1 pièce' }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre de pièces"
              />
              {errors.rooms && (
                <p className="text-red-500 text-sm mt-1">{errors.rooms.message}</p>
              )}
            </div>

            {/* Nombre de salles de bain */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Bath className="w-5 h-5 mr-2 text-blue-600" />
                Nombre de salles de bain
              </label>
              <input
                type="number"
                {...register('bathrooms', {
                  required: 'Ce champ est requis',
                  min: { value: 1, message: 'Minimum 1 salle de bain' }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre de salles de bain"
              />
              {errors.bathrooms && (
                <p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>
              )}
            </div>
          </>
        )}

        {/* Surface */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <Ruler className="w-5 h-5 mr-2 text-blue-600" />
            Surface habitable (m²)
          </label>
          <input
            type="number"
            {...register('surface', { 
              required: 'Ce champ est requis',
              min: { value: 1, message: 'La surface doit être supérieure à 0' }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Surface en m²"
          />
          {errors.surface && (
            <p className="text-red-500 text-sm mt-1">{errors.surface.message}</p>
          )}
        </div>

        {propertyType !== 'land' && (
          <>
            {/* Année de construction */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Home className="w-5 h-5 mr-2 text-blue-600" />
                Année de construction
              </label>
              <input
                type="number"
                {...register('yearBuilt', { 
                  required: 'Ce champ est requis',
                  min: { value: 1800, message: 'L\'année doit être supérieure à 1800' },
                  max: { value: new Date().getFullYear(), message: 'L\'année ne peut pas être dans le futur' }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Année de construction"
              />
              {errors.yearBuilt && (
                <p className="text-red-500 text-sm mt-1">{errors.yearBuilt.message}</p>
              )}
            </div>

            {/* Nombre d'étages */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Layers className="w-5 h-5 mr-2 text-blue-600" />
                Nombre d'étages
              </label>
              <input
                type="number"
                {...register('floors', {
                  required: 'Ce champ est requis',
                  min: { value: 1, message: 'Minimum 1 étage' }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre d'étages"
              />
              {errors.floors && (
                <p className="text-red-500 text-sm mt-1">{errors.floors.message}</p>
              )}
            </div>

            {/* Extérieurs */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('hasBalcony')}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span>Balcon</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('hasTerrace')}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span>Terrasse</span>
                </label>
              </div>
            </div>

            {/* Vue */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Mountain className="w-5 h-5 mr-2 text-blue-600" />
                Vue
              </label>
              <select
                {...register('view')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez le type de vue</option>
                {views.map(view => (
                  <option key={view} value={view}>{view}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {propertyType === 'building' && (
          <>
            {/* Nombre de lots */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Nombre de lots
              </label>
              <input
                type="number"
                {...register('buildingUnits', {
                  required: 'Ce champ est requis pour un immeuble',
                  min: { value: 2, message: 'Minimum 2 lots' }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre de lots"
              />
              {errors.buildingUnits && (
                <p className="text-red-500 text-sm mt-1">{errors.buildingUnits.message}</p>
              )}
            </div>

            {/* Nombre moyen de pièces par lot */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <DoorOpen className="w-5 h-5 mr-2 text-blue-600" />
                Nombre moyen de pièces par lot
              </label>
              <input
                type="number"
                step="0.5"
                {...register('unitsRooms', {
                  required: 'Ce champ est requis pour un immeuble',
                  min: { value: 1, message: 'Minimum 1 pièce' }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre moyen de pièces par lot"
              />
              {errors.unitsRooms && (
                <p className="text-red-500 text-sm mt-1">{errors.unitsRooms.message}</p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          Obtenir l'estimation
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </form>
  );
};