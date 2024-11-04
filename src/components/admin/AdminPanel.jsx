// src/components/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditPickupLineModal from './EditPickupLineModal';

const AdminPanel = () => {
  const [pickupLines, setPickupLines] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingLine, setEditingLine] = useState(null);

  const fetchPickupLines = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/pickup-lines?page=${page}`);
      const data = await response.json();
      setPickupLines(data.pickupLines || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching pickup lines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupLines();
  }, [page]);

  const handleEdit = (line) => {
    setEditingLine(line);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pickup line?')) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/pickup-lines/${id}`, {
        method: 'DELETE',
      });
      fetchPickupLines();
    } catch (error) {
      console.error('Error deleting pickup line:', error);
    }
  };

  const handleSave = async (updatedLine) => {
    try {
      const method = updatedLine._id ? 'PUT' : 'POST';
      const url = updatedLine._id 
        ? `${import.meta.env.VITE_API_URL}/api/admin/pickup-lines/${updatedLine._id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/pickup-lines`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLine),
      });

      if (!response.ok) {
        throw new Error('Failed to save pickup line');
      }

      setEditingLine(null);
      fetchPickupLines();
    } catch (error) {
      console.error('Error saving pickup line:', error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pickup Lines Management</CardTitle>
              <Button 
                onClick={() => setEditingLine({ text: '', category: '', style: '' })}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : (
                pickupLines.map((line) => (
                  <div key={line._id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <p className="text-lg">{line.text}</p>
                      <p className="text-sm text-gray-500">
                        Category: {line.category} | Style: {line.style}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(line)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(line._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={page === i + 1 ? "default" : "outline"}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {editingLine && (
          <EditPickupLineModal
            pickupLine={editingLine}
            onClose={() => setEditingLine(null)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;