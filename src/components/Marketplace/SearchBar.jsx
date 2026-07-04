import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = 'Search...' }) => {
  return (
    <div className="mkt-search-wrap">
      <span className="mkt-search-icon-prefix">🔍</span>
      <input
        type="text"
        className="mkt-search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button className="mkt-search-clear" onClick={() => setSearchTerm('')}>✕</button>
      )}
    </div>
  );
};

export default SearchBar;
