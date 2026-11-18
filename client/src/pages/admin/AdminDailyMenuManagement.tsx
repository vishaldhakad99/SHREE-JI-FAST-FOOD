import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DailyMenu, DailyMenuItem, FoodItem } from '../../types';
import {
  CalendarDays,
  Plus,
  Trash2,
  Save,
  Sparkles,
  Check,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const AdminDailyMenuManagement: React.FC = () => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form Fields
  const [title, setTitle] = useState("Today's Fresh Daily Specials");
  const [specialAnnouncement, setSpecialAnnouncement] = useState('');
  const [items, setItems] = useState<DailyMenuItem[]>([]);
  const [isActive, setIsActive] = useState(true);

  // Catalog items for 1-click adder
  const [catalogItems, setCatalogItems] = useState<FoodItem[]>([]);

  // Dish builder input fields
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Daily Special');
  const [newDishPrice, setNewDishPrice] = useState<number | ''>('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishIsSpecial, setNewDishIsSpecial] = useState(false);

  const fetchMenuForDate = async (dateStr: string) => {
    try {
      setLoading(true);
      setStatusMsg(null);

      const [menuRes, catalogRes] = await Promise.all([
        api.get(`/daily-menu?date=${dateStr}`),
        api.get('/food'),
      ]);

      if (catalogRes.data?.success) {
        setCatalogItems(catalogRes.data.items);
      }

      if (menuRes.data?.success && menuRes.data?.hasMenu && menuRes.data?.menu) {
        const m = menuRes.data.menu;
        setDailyMenu(m);
        setTitle(m.title);
        setSpecialAnnouncement(m.specialAnnouncement || '');
        setItems(m.items || []);
        setIsActive(m.isActive ?? true);
      } else {
        setDailyMenu(null);
        setTitle(`Today's Fresh Daily Specials (${dateStr})`);
        setSpecialAnnouncement('');
        setItems([]);
        setIsActive(true);
      }
    } catch (err) {
      console.error('Error loading daily menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuForDate(selectedDate);
  }, [selectedDate]);

  const addDishToBoard = () => {
    if (!newDishName.trim()) {
      alert('Please enter a dish name.');
      return;
    }
    if (newDishPrice === '' || Number(newDishPrice) < 0) {
      alert('Please enter a valid price.');
      return;
    }

    const newItem: DailyMenuItem = {
      name: newDishName.trim(),
      description: newDishDesc.trim() || undefined,
      category: newDishCategory.trim() || 'Daily Special',
      price: Number(newDishPrice),
      isAvailable: true,
      isSpecial: newDishIsSpecial,
    };

    setItems([...items, newItem]);
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice('');
    setNewDishIsSpecial(false);
  };

  const addFromCatalog = (food: FoodItem) => {
    const newItem: DailyMenuItem = {
      foodItem: food._id,
      name: food.name,
      description: food.description,
      category: typeof food.category === 'object' ? food.category?.name : 'Special',
      price: food.price,
      isAvailable: true,
      isSpecial: food.isSpecial,
      imageUrl: food.imageUrl,
    };
    setItems([...items, newItem]);
  };

  const removeDishFromBoard = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleDishAvailability = (index: number) => {
    const updated = [...items];
    updated[index].isAvailable = !updated[index].isAvailable;
    setItems(updated);
  };

  const updateDishPrice = (index: number, newPrice: number) => {
    const updated = [...items];
    updated[index].price = newPrice;
    setItems(updated);
  };

  const handleSaveMenu = async () => {
    setStatusMsg(null);

    if (items.length === 0) {
      setStatusMsg({
        text: 'Please add at least one dish before publishing the daily menu.',
        type: 'error',
      });
      return;
    }

    try {
      setSaving(true);
      const res = await api.post('/daily-menu', {
        date: selectedDate,
        title: title.trim(),
        specialAnnouncement: specialAnnouncement.trim() || undefined,
        items,
        isActive,
      });

      if (res.data?.success) {
        setStatusMsg({
          text: `Daily menu for ${selectedDate} has been saved and is now live on the website!`,
          type: 'success',
        });
        fetchMenuForDate(selectedDate);
      } else {
        setStatusMsg({ text: res.data?.message || 'Failed to save menu.', type: 'error' });
      }
    } catch (err: any) {
      console.error('Failed to save daily menu:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to save daily menu.';
      setStatusMsg({ text: msg, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenu = async () => {
    if (!dailyMenu) return;
    if (!window.confirm(`Are you sure you want to remove the daily menu for ${selectedDate}? The website will display "Today's menu will be updated soon."`)) {
      return;
    }

    try {
      await api.delete(`/daily-menu/${dailyMenu._id}`);
      fetchMenuForDate(selectedDate);
      setStatusMsg({ text: 'Daily menu removed successfully.', type: 'success' });
    } catch (err) {
      console.error('Failed to delete daily menu:', err);
      alert('Error removing menu.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-300 shadow-sm">
        <div>
          <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider block">
            Dynamic Kitchen Specials
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-950 mt-1">
            Daily Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-deepbrown-muted mt-0.5">
            Configure rotating daily dishes, daily pricing, and kitchen announcements reflecting live on the customer site.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-cream-100 p-2 rounded-2xl border border-cream-300">
          <CalendarDays className="w-4 h-4 text-saffron-600 ml-1" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white px-3 py-1.5 rounded-xl border border-cream-300 text-xs font-bold text-deepbrown-900 focus:outline-none"
          />
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-red-50 text-red-800 border border-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-12 rounded-3xl text-center text-xs text-deepbrown-muted">
          Loading daily menu data...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Menu Details & Live Board */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <h3 className="font-serif font-bold text-lg text-deepbrown-900">
                  Daily Menu Information ({selectedDate})
                </h3>
                {dailyMenu && (
                  <button
                    onClick={handleDeleteMenu}
                    className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline"
                  >
                    Remove This Day's Menu
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                    Daily Menu Headline Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Today's Fresh Daily Specials"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                    Display Status on Website
                  </label>
                  <select
                    value={isActive ? 'active' : 'inactive'}
                    onChange={(e) => setIsActive(e.target.value === 'active')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
                  >
                    <option value="active">Active & Visible to Customers</option>
                    <option value="inactive">Draft / Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                  Special Kitchen Announcement (Optional)
                </label>
                <input
                  type="text"
                  value={specialAnnouncement}
                  onChange={(e) => setSpecialAnnouncement(e.target.value)}
                  placeholder="e.g. Fresh Gajar Ka Halwa and Kadhi Khichdi prepared today!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-xs sm:text-sm text-deepbrown-900 focus:outline-none"
                />
              </div>

              {/* Dishes on this Day's Menu */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-deepbrown-900">
                    Dishes on Daily Board ({items.length})
                  </span>
                  <span className="text-[11px] text-deepbrown-muted">
                    Adjust price or toggle availability live
                  </span>
                </div>

                {items.length > 0 ? (
                  <div className="divide-y divide-cream-200 border border-cream-200 rounded-2xl overflow-hidden">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                          item.isAvailable ? 'bg-white' : 'bg-gray-100 opacity-60'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-deepbrown-900 text-sm">{item.name}</span>
                            {item.isSpecial && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                Special
                              </span>
                            )}
                          </div>
                          <span className="text-deepbrown-muted text-[11px] block">{item.category}</span>
                          {item.description && (
                            <p className="text-deepbrown-muted text-[11px] line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-deepbrown-800">₹</span>
                            <input
                              type="number"
                              min="0"
                              value={item.price}
                              onChange={(e) => updateDishPrice(idx, Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded border border-cream-300 text-xs font-bold text-saffron-700 text-center"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleDishAvailability(idx)}
                            className={`px-2 py-1 rounded text-[11px] font-bold ${
                              item.isAvailable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {item.isAvailable ? 'Available' : 'Finished'}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeDishFromBoard(idx)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-cream-50 rounded-2xl border border-dashed border-cream-300 text-xs text-deepbrown-muted">
                    No dishes added yet. Use the panel on the right to add catalog items or write a new daily special!
                  </div>
                )}
              </div>

              {/* Publish Button */}
              <div className="pt-4 border-t border-cream-200 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSaveMenu}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Publishing Menu...' : 'Publish / Update Daily Menu'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dish Adder & Quick Catalog Importer */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Import from Catalog */}
            <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-sm space-y-3">
              <h4 className="font-serif font-bold text-sm text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-warmamber-500" />
                <span>Quick Add from Regular Catalog</span>
              </h4>
              <p className="text-[11px] text-deepbrown-muted">
                Click any dish to add it to today's daily menu board:
              </p>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {catalogItems.map((food) => (
                  <button
                    key={food._id}
                    type="button"
                    onClick={() => addFromCatalog(food)}
                    className="w-full text-left p-2 rounded-xl border border-cream-200 hover:border-saffron-300 hover:bg-cream-50 flex items-center justify-between text-xs transition-colors group"
                  >
                    <div>
                      <span className="font-bold text-deepbrown-900 group-hover:text-saffron-700 block truncate max-w-[170px]">
                        {food.name}
                      </span>
                      <span className="text-[10px] text-deepbrown-muted">₹{food.price}</span>
                    </div>
                    <span className="text-saffron-700 font-bold text-xs bg-saffron-50 px-2 py-0.5 rounded">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Daily Dish Adder */}
            <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-sm space-y-3 text-xs">
              <h4 className="font-serif font-bold text-sm text-deepbrown-900 border-b border-cream-200 pb-2">
                Add New Unique Daily Dish
              </h4>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-deepbrown-800 mb-1">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kadhi Khichdi with Desi Ghee"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-cream-300 bg-cream-50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-deepbrown-800 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="130"
                      value={newDishPrice}
                      onChange={(e) => setNewDishPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-cream-300 bg-cream-50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-deepbrown-800 mb-1">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      placeholder="Daily Special"
                      value={newDishCategory}
                      onChange={(e) => setNewDishCategory(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-cream-300 bg-cream-50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-deepbrown-800 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of ingredients/flavor..."
                    value={newDishDesc}
                    onChange={(e) => setNewDishDesc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-cream-300 bg-cream-50 focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newDishIsSpecial}
                    onChange={(e) => setNewDishIsSpecial(e.target.checked)}
                    className="accent-saffron-600"
                  />
                  <span className="font-semibold text-deepbrown-900">Highlight as Special Dish</span>
                </label>

                <button
                  type="button"
                  onClick={addDishToBoard}
                  className="w-full bg-deepbrown-900 hover:bg-deepbrown-800 text-white font-bold py-2.5 rounded-xl transition-colors mt-2"
                >
                  + Add Dish to Board
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
