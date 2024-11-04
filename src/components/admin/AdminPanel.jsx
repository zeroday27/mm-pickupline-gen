// src/components/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Pencil, Trash2, Plus, Search, Filter } from 'lucide-react';
import EditPickupLineModal from './EditPickupLineModal';

const AdminPanel = () => {
  const [pickupLines, setPickupLines] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingLine, setEditingLine] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    style: ''
  });
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const base64Credentials = btoa(`${credentials.username}:${credentials.password}`);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        headers: {
          'Authorization': `Basic ${base64Credentials}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', base64Credentials);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  const handleSave = async (updatedLine) => {
    try {
      const method = updatedLine._id ? 'PUT' : 'POST';
      const url = updatedLine._id 
        ? `${import.meta.env.VITE_API_URL}/api/admin/pickup-lines/${updatedLine._id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/pickup-lines`;

      const authHeader = localStorage.getItem('adminAuth');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`
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
      alert('Failed to save pickup line');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pickup line?')) return;

    try {
      const authHeader = localStorage.getItem('adminAuth');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/pickup-lines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete pickup line');
      }

      fetchPickupLines();
    } catch (error) {
      console.error('Error deleting pickup line:', error);
      alert('Failed to delete pickup line');
    }
  };

  const fetchPickupLines = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        ...filters,
      });

      const authHeader = localStorage.getItem('adminAuth');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/pickup-lines?${queryParams}`,
        {
          headers: {
            'Authorization': `Basic ${authHeader}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPickupLines(data.pickupLines);
        setTotalPages(data.pages);
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
      }
    } catch (error) {
      console.error('Error fetching pickup lines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authHeader = localStorage.getItem('adminAuth');
    if (authHeader) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPickupLines();
    }
  }, [page, filters, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    username: e.target.value
                  })}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    password: e.target.value
                  })}
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
<CardHeader>
  <div className="flex justify-between items-center">
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CardTitle>Pickup Lines Management</CardTitle>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Welcome, Admin
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              localStorage.removeItem('adminAuth');
              setIsAuthenticated(false);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            Logout
          </Button>
          <Button 
            onClick={() => setEditingLine({ text: '', category: '', style: '' })}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
    </div>
  </div>
</CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search pickup lines..."
                    value={filters.search}
                    onChange={(e) => setFilters({
                      ...filters,
                      search: e.target.value
                    })}
                    className="pl-10"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
                </div>
                <select
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 min-w-[150px]"
                  value={filters.category}
                  onChange={(e) => setFilters({
                    ...filters,
                    category: e.target.value
                  })}
                >
                  <option value="">All Categories</option>
                  <option value="movies">Movies</option>
                  <option value="music">Music</option>
                  <option value="books">Books</option>
                  <option value="tech">Technology</option>
                  <option value="football">Football</option>
                  <option value="gaming">Gaming</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 min-w-[150px]"
                  value={filters.style}
                  onChange={(e) => setFilters({
                    ...filters,
                    style: e.target.value
                  })}
                >
                  <option value="">All Styles</option>
                  <option value="funny">Funny</option>
                  <option value="romantic">Romantic</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {pickupLines.map((line) => (
                  <div 
                    key={line._id} 
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                  >
                    <div className="flex-1">
                      <p className="text-lg dark:text-white">{line.text}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Category: {line.category} | Style: {line.style}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLine(line)}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(line._id)}
                        className="hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2 mt-6">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(i + 1)}
                        className={page === i + 1 ? "bg-purple-600 text-white" : ""}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}

                {pickupLines.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No pickup lines found
                  </div>
                )}
              </div>
            )}
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