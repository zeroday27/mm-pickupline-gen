// src/components/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Pencil, Trash2, Plus, Search, Filter } from 'lucide-react';
import EditPickupLineModal from './EditPickupLineModal';

const API_BASE = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000`;

const CATEGORIES = [
  'movies', 'music', 'books', 'tech', 'football', 'gaming', 'travel', 'food',
  'sports', 'art', 'fitness', 'photography', 'nature', 'cooking', 'dancing',
  'business', 'education', 'health', 'beauty', 'fashion', 'pets', 'science',
  'history', 'other'
];

const STYLES = ['funny', 'romantic', 'flirty', 'cute', 'cheesy', 'poetic', 'sarcastic', 'sweet', 'bold', 'other'];
const REVIEW_STATUSES = ['staging', 'reviewed', 'approved', 'rejected'];

const NEW_LINE_TEMPLATE = {
  text: '',
  burmese_text: '',
  english_source_text: '',
  source_url: '',
  license_note: '',
  category: '',
  style: '',
  length: 'short',
  review_status: 'staging',
  quality_score: 70,
  safety_score: 95,
  tags: [],
  language: 'my'
};

const statusClassName = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'reviewed':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
  }
};

const AdminPanel = () => {
  const [pickupLines, setPickupLines] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingLine, setEditingLine] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    style: '',
    review_status: ''
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
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`
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
        ? `${API_BASE}/api/admin/pickup-lines/${updatedLine._id}`
        : `${API_BASE}/api/admin/pickup-lines`;

      const authHeader = localStorage.getItem('adminAuth');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authHeader}`
        },
        body: JSON.stringify(updatedLine)
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
      const response = await fetch(`${API_BASE}/api/admin/pickup-lines/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${authHeader}`
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
      const queryParams = new URLSearchParams({ page: String(page) });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });

      const authHeader = localStorage.getItem('adminAuth');
      const response = await fetch(`${API_BASE}/api/admin/pickup-lines?${queryParams}`, {
        headers: {
          Authorization: `Basic ${authHeader}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPickupLines(data.pickupLines);
        setTotalPages(data.pages || 1);
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

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
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
                      Curated content workflow
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
                      onClick={() => setEditingLine(NEW_LINE_TEMPLATE)}
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
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Filter className="h-4 w-4" />
                Filters
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="relative md:col-span-2">
                  <Input
                    placeholder="Search pickup lines..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="pl-10"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
                </div>

                <select
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 min-w-[150px]"
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 min-w-[150px]"
                  value={filters.style}
                  onChange={(e) => updateFilter('style', e.target.value)}
                >
                  <option value="">All Styles</option>
                  {STYLES.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <select
                  className="px-3 py-2 border rounded-md dark:bg-gray-800 min-w-[150px]"
                  value={filters.review_status}
                  onChange={(e) => updateFilter('review_status', e.target.value)}
                >
                  <option value="">All Review Statuses</option>
                  {REVIEW_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
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
                      <p className="text-lg dark:text-white">{line.burmese_text || line.text}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Category: {line.category} | Style: {line.style}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${statusClassName(line.review_status)}`}>
                          {line.review_status || 'staging'}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          Quality {line.quality_score ?? 70}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                          Safety {line.safety_score ?? 95}
                        </span>
                        {line.source_url && (
                          <a
                            href={line.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:underline"
                          >
                            Source
                          </a>
                        )}
                      </div>
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

                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2 mt-6">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(i + 1)}
                        className={page === i + 1 ? 'bg-purple-600 text-white' : ''}
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
