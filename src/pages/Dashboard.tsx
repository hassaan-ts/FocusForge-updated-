import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

interface BlockedSite {
  _id: string;
  url: string;
  category: string;
}

export function Dashboard() {
  const [newUrl, setNewUrl] = useState('');
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [focusActive, setFocusActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlockedSites();
  }, []);

  async function loadBlockedSites() {
    try {
      const { websites } = await api.getBlockedWebsites();
      setBlockedSites(websites);
    } catch (error) {
      toast.error('Failed to load blocked websites');
    } finally {
      setLoading(false);
    }
  }

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    try {
      const { website } = await api.addBlockedWebsite(newUrl);
      setBlockedSites([...blockedSites, website]);
      setNewUrl('');
      toast.success('Website added to block list');
    } catch (error) {
      toast.error('Failed to add website');
    }
  };

  const handleRemoveSite = async (websiteId: string) => {
    try {
      await api.removeBlockedWebsite(websiteId);
      setBlockedSites(blockedSites.filter(site => site._id !== websiteId));
      toast.success('Website removed from block list');
    } catch (error) {
      toast.error('Failed to remove website');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Focus Mode
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Block distracting websites during your focus time
              </p>
            </div>
            <button
              onClick={() => setFocusActive(!focusActive)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                focusActive ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  focusActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <form onSubmit={handleAddSite} className="mt-6">
            <div className="flex gap-x-4">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter website URL"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                type="submit"
                className="flex items-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </form>

          <div className="mt-6">
            <ul role="list" className="divide-y divide-gray-100">
              {blockedSites.map((site) => (
                <li key={site._id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{site.url}</p>
                    <p className="text-sm text-gray-500">{site.category}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveSite(site._id)}
                    className="rounded-full p-1 text-gray-400 hover:text-gray-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}