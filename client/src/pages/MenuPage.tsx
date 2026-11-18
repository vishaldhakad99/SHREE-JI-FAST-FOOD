import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { FoodItem, FoodCategory } from '../types';
import { FoodCard } from '../components/FoodCard';
import { Search, Filter, UtensilsCrossed, AlertCircle } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategoryParam);
  const [filterSpecial, setFilterSpecial] = useState(false);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const [catsRes, itemsRes] = await Promise.all([
          api.get('/food/categories'),
          api.get('/food'),
        ]);

        if (catsRes.data?.success && catsRes.data?.categories) {
          setCategories(catsRes.data.categories);
        }

        if (itemsRes.data?.success && itemsRes.data?.items) {
          setItems(itemsRes.data.items);
        }
      } catch (err) {
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Sync category changes with URL search params
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  // Filter items based on active category, search string, and special toggle
  const filteredItems = items.filter((item) => {
    // 1. Category match
    if (selectedCategory !== 'all') {
      const catSlug = typeof item.category === 'object' ? item.category?.slug : item.category;
      if (catSlug !== selectedCategory) return false;
    }

    // 2. Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(q);
      const descMatch = item.description?.toLowerCase().includes(q);
      if (!nameMatch && !descMatch) return false;
    }

    // 3. Special match
    if (filterSpecial && !item.isSpecial) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-50 px-3.5 py-1 rounded-full border border-saffron-200">
          Our Fresh Culinary Offerings
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-deepbrown-950">
          Explore Our Menu
        </h1>
        <p className="text-sm sm:text-base text-deepbrown-muted">
          All dishes are cooked fresh daily in our 100% pure vegetarian kitchen. Customize the spice level or preparation according to your personal preference!
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-premium space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-deepbrown-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes (e.g. Aloo Paratha, Thali)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-xs sm:text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
            />
          </div>

          {/* Quick Filter: Specials Only */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setFilterSpecial(!filterSpecial)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl border transition-colors ${
                filterSpecial
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-cream-100 text-deepbrown-800 border-cream-300 hover:bg-cream-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Specials Only</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-saffron-600 text-white shadow-sm'
                : 'bg-cream-100 text-deepbrown-800 hover:bg-cream-200 border border-cream-300/80'
            }`}
          >
            All Items ({items.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-saffron-600 text-white shadow-sm'
                  : 'bg-cream-100 text-deepbrown-800 hover:bg-cream-200 border border-cream-300/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-white border border-cream-300 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold text-deepbrown-muted">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-cream-300 shadow-premium space-y-4">
          <div className="w-14 h-14 rounded-full bg-cream-200 text-deepbrown-muted flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-deepbrown-900">
            No items found in this selection
          </h3>
          <p className="text-xs text-deepbrown-muted leading-relaxed">
            {searchQuery
              ? `No dishes matched "${searchQuery}". Please try another keyword.`
              : 'Items for this category will be updated soon by the restaurant.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('all');
              setFilterSpecial(false);
            }}
            className="inline-flex items-center gap-2 bg-saffron-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Bottom Note */}
      <div className="bg-cream-50 p-4 rounded-xl border border-cream-300 flex items-start gap-3 text-xs text-deepbrown-muted">
        <AlertCircle className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
        <p>
          <strong>Freshly Made to Order:</strong> Prices and availability reflect live items configured in the restaurant management system. If you have custom dietary requirements (e.g. Jain, less oil, extra butter, specific spices), please let us know during order placement!
        </p>
      </div>
    </div>
  );
};
