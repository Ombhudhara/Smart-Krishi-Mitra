import React from 'react';
import './FilterBar.css';

const FilterBar = ({
  categories = [],
  activeCategory = 'All',
  setActiveCategory,
  sortBy = '',
  setSortBy,
  sortOptions = [],
  filterOrganic = false,
  setFilterOrganic,
  filterStock = 'All',
  setFilterStock,
  showOrganicFilter = true,
  showStockFilter = false
}) => {
  return (
    <div className="mkt-filter-container">
      {/* Search & Sort Controls row */}
      <div className="mkt-filter-controls-row">
        {setSortBy && sortOptions.length > 0 && (
          <select className="mkt-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="" disabled>Sort By</option>
            {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        {showStockFilter && setFilterStock && (
          <select className="mkt-filter-select" value={filterStock} onChange={e => setFilterStock(e.target.value)}>
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Sold Out">Sold Out</option>
          </select>
        )}

        {showOrganicFilter && setFilterOrganic && (
          <label className="mkt-filter-toggle">
            <input 
              type="checkbox" 
              checked={filterOrganic} 
              onChange={e => setFilterOrganic(e.target.checked)} 
            />
            🌿 Organic Only
          </label>
        )}
      </div>

      {/* Category Chips row */}
      {categories.length > 0 && (
        <div className="mkt-category-chips">
          {categories.map(cat => (
            <button
              key={cat}
              className={`mkt-cat-chip ${activeCategory === cat ? 'mkt-cat-chip--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
