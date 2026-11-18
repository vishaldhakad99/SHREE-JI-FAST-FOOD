import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FoodItem, FoodCategory } from '../../types';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  Search,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminFoodManagement: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isTodaysSpecial, setIsTodaysSpecial] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');
  const [preparationTimeMinutes, setPreparationTimeMinutes] = useState(15);
  const [customizationText, setCustomizationText] = useState('');

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [foodRes, catRes] = await Promise.all([
        api.get('/food'),
        api.get('/food/categories'),
      ]);

      if (foodRes.data?.success) setItems(foodRes.data.items);
      if (catRes.data?.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error('Error fetching food items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId(categories[0]?._id || '');
    setImageUrl('');
    setImagePublicId('');
    setIsVegetarian(true);
    setIsAvailable(true);
    setIsSpecial(false);
    setIsTodaysSpecial(false);
    setIsFeatured(false);
    setSpiceLevel('Medium');
    setPreparationTimeMinutes(15);
    setCustomizationText('Less spicy, Extra butter, Jain / No onion-garlic');
    setFormError(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    const catId = typeof item.category === 'object' ? item.category?._id : item.category;
    setCategoryId(catId || '');
    setImageUrl(item.imageUrl || '');
    setImagePublicId(item.imagePublicId || '');
    setIsVegetarian(item.isVegetarian);
    setIsAvailable(item.isAvailable);
    setIsSpecial(item.isSpecial);
    setIsTodaysSpecial(item.isTodaysSpecial);
    setIsFeatured(item.isFeatured);
    setSpiceLevel(item.spiceLevel || 'Medium');
    setPreparationTimeMinutes(item.preparationTimeMinutes || 15);
    setCustomizationText(item.customizationOptions?.join(', ') || '');
    setFormError(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.imageUrl) {
        setImageUrl(res.data.imageUrl);
        setImagePublicId(res.data.publicId || '');
      } else {
        setUploadError(res.data?.message || 'Failed to upload image.');
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      const msg = err.response?.data?.message || 'Cloudinary upload error. You can also paste an image URL directly below.';
      setUploadError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter a dish name.');
      return;
    }
    if (price === '' || Number(price) < 0) {
      setFormError('Please enter a valid price.');
      return;
    }
    if (!categoryId) {
      setFormError('Please select a category.');
      return;
    }

    const customizationOptions = customizationText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      categoryId,
      imageUrl: imageUrl.trim() || undefined,
      imagePublicId: imagePublicId || undefined,
      isVegetarian,
      isAvailable,
      isSpecial,
      isTodaysSpecial,
      isFeatured,
      spiceLevel,
      preparationTimeMinutes: Number(preparationTimeMinutes),
      customizationOptions,
    };

    try {
      setSaving(true);
      if (editingItem) {
        await api.put(`/food/${editingItem._id}`, payload);
      } else {
        await api.post('/food', payload);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      console.error('Failed to save food item:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to save item.';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${itemName}" from the database?`)) {
      return;
    }

    try {
      await api.delete(`/food/${id}`);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Error deleting food item.');
    }
  };

  const toggleAvailability = async (item: FoodItem) => {
    try {
      await api.put(`/food/${item._id}`, { isAvailable: !item.isAvailable });
      fetchItems();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCat !== 'all') {
      const catSlug = typeof item.category === 'object' ? item.category?.slug : item.category;
      if (catSlug !== selectedCat) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-300 shadow-sm">
        <div>
          <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider block">
            Menu Management
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-950 mt-1">
            Food Items Catalog
          </h1>
          <p className="text-xs sm:text-sm text-deepbrown-muted mt-0.5">
            Add, update pricing, upload photographs, and toggle kitchen availability in real-time.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-deepbrown-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs sm:text-sm text-deepbrown-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ${
              selectedCat === 'all'
                ? 'bg-saffron-600 text-white'
                : 'bg-cream-100 text-deepbrown-800 hover:bg-cream-200'
            }`}
          >
            All ({items.length})
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCat(c.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ${
                selectedCat === c.slug
                  ? 'bg-saffron-600 text-white'
                  : 'bg-cream-100 text-deepbrown-800 hover:bg-cream-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Food Items */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-deepbrown-muted">Loading food items from database...</div>
        ) : filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cream-100 border-b border-cream-200 text-deepbrown-muted font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item & Photo</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Spice / Time</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredItems.map((item) => {
                  const catName = typeof item.category === 'object' ? item.category?.name : 'Category';

                  return (
                    <tr key={item._id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200&auto=format&fit=crop'}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-cream-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-deepbrown-900 block">{item.name}</span>
                            <span className="text-[11px] text-deepbrown-muted line-clamp-1 max-w-xs">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-deepbrown-800">{catName}</td>
                      <td className="py-3 px-4 font-black text-saffron-700 text-base">₹{item.price}</td>
                      <td className="py-3 px-4 text-xs">
                        <span className="block font-medium">{item.spiceLevel || 'Medium'}</span>
                        <span className="text-[11px] text-deepbrown-muted">~{item.preparationTimeMinutes || 15} min</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleAvailability(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {item.isAvailable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                          {item.isSpecial && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Special</span>}
                          {item.isTodaysSpecial && <span className="bg-saffron-100 text-saffron-800 px-1.5 py-0.5 rounded">Today's</span>}
                          {item.isFeatured && <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Featured</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-deepbrown-700 hover:text-saffron-700 hover:bg-cream-200 rounded-lg transition-colors"
                            title="Edit Item"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, item.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-deepbrown-muted text-xs sm:text-sm">
            No food items matched your query.
          </div>
        )}
      </div>

      {/* Modal for Add / Edit Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-cream-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-serif font-black text-xl text-deepbrown-900">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-deepbrown-muted hover:text-deepbrown-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-xl text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              {/* Row 1: Name and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                    Dish Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Famous Aloo Paratha"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the dish, ingredients, and how it is served..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>

              {/* Price, Spice, Prep Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 70"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                    Spice Level
                  </label>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy">Spicy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                    Prep Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={preparationTimeMinutes}
                    onChange={(e) => setPreparationTimeMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300 space-y-3">
                <label className="block text-xs font-bold text-deepbrown-900">
                  Food Photograph (Cloudinary Upload or Direct Image URL)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-cream-300 text-xs font-bold text-deepbrown-800 hover:bg-cream-50 cursor-pointer shrink-0 shadow-sm">
                    <Upload className="w-4 h-4 text-saffron-600" />
                    <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  <div className="w-full">
                    <input
                      type="url"
                      placeholder="Or paste image URL (e.g. https://...)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-cream-300 bg-white text-xs text-deepbrown-900 focus:outline-none"
                    />
                  </div>
                </div>

                {uploadError && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    ℹ {uploadError}
                  </p>
                )}

                {imageUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-cream-300 shadow-sm"
                    />
                    <span className="text-xs text-emerald-700 font-semibold">Image ready for display</span>
                  </div>
                )}
              </div>

              {/* Customization Options */}
              <div>
                <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                  Customization Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less spicy, Extra butter, Without onion-garlic"
                  value={customizationText}
                  onChange={(e) => setCustomizationText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs sm:text-sm text-deepbrown-900 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cream-300 bg-cream-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="accent-saffron-600"
                  />
                  <span className="text-xs font-bold">In Stock</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cream-300 bg-cream-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSpecial}
                    onChange={(e) => setIsSpecial(e.target.checked)}
                    className="accent-saffron-600"
                  />
                  <span className="text-xs font-bold">Special Dish</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cream-300 bg-cream-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTodaysSpecial}
                    onChange={(e) => setIsTodaysSpecial(e.target.checked)}
                    className="accent-saffron-600"
                  />
                  <span className="text-xs font-bold">Today's Special</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cream-300 bg-cream-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-saffron-600"
                  />
                  <span className="text-xs font-bold">Featured Card</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-deepbrown-800 bg-cream-200 hover:bg-cream-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
