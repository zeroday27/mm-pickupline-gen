// src/components/admin/EditPickupLineModal.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const EditPickupLineModal = ({ pickupLine, onClose, onSave }) => {
  const [formData, setFormData] = useState(pickupLine);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
        <CardHeader className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
          <CardTitle className="text-gray-900 dark:text-white">
            {pickupLine._id ? 'Edit' : 'Add'} Pickup Line
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white dark:bg-gray-900">
          <form onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }} className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-200">Text</Label>
              <textarea
                className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100 border-gray-300 
                          dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
              />
            </div>
            
            <div>
              <Label className="text-gray-700 dark:text-gray-200">Category</Label>
              <select
                className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100 border-gray-300 
                          dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="movies">Movies</option>
                <option value="music">Music</option>
                <option value="books">Books</option>
                <option value="tech">Technology</option>
                <option value="football">Football</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-200">Style</Label>
              <select
                className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100 border-gray-300 
                          dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              >
                <option value="">Select Style</option>
                <option value="funny">Funny</option>
                <option value="romantic">Romantic</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-800">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-white dark:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPickupLineModal;