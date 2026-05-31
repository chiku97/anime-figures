import { useState } from 'react'
import './FilterBar.css'

function FilterBar({ onFilterChange, onAiSearch }) {
  const [filters, setFilters] = useState({
    maker: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  })
  const [customRequirement, setCustomRequirement] = useState('')

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value }
    setFilters(updated)
    if (onFilterChange) onFilterChange(updated)
  }

  const handleReset = () => {
    const reset = { maker: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '', search: '' }
    setFilters(reset)
    if (onFilterChange) onFilterChange(reset)
  }

  const handleAiSearch = () => {
    if (!onAiSearch) return
    const text = customRequirement.trim()
    if (!text) return
    onAiSearch(text)
  }

  return (
    <div className="filter-bar">
      <div className="filter-bar__inner">
        <input
          className="filter-input filter-input--search"
          type="text"
          name="search"
          placeholder="Search cars..."
          value={filters.search}
          onChange={handleChange}
        />

        <select className="filter-select" name="maker" value={filters.maker} onChange={handleChange}>
          <option value="">All Makers</option>
          <option value="Maruti Suzuki">Maruti Suzuki</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Tata">Tata</option>
          <option value="Mahindra">Mahindra</option>
          <option value="Kia">Kia</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="Skoda">Skoda</option>
          <option value="MG">MG</option>
          <option value="Renault">Renault</option>
          <option value="Nissan">Nissan</option>
          <option value="Jeep">Jeep</option>
          <option value="Citroen">Citroen</option>
          <option value="BMW">BMW</option>
        </select>

        <select className="filter-select" name="fuelType" value={filters.fuelType} onChange={handleChange}>
          <option value="">All Fuel Types</option>
          <option value="PETROL">Petrol</option>
          <option value="DIESEL">Diesel</option>
          <option value="ELECTRIC">Electric</option>
          <option value="CNG">CNG</option>
          <option value="HYBRID">Hybrid</option>
        </select>

        <select className="filter-select" name="transmission" value={filters.transmission} onChange={handleChange}>
          <option value="">All Transmission</option>
          <option value="MANUAL">Manual</option>
          <option value="AUTOMATIC">Automatic</option>
        </select>

        <div className="filter-price-group">
          <input
            className="filter-input filter-input--price"
            type="number"
            name="minPrice"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <span className="filter-price-sep">–</span>
          <input
            className="filter-input filter-input--price"
            type="number"
            name="maxPrice"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>

        <button className="filter-reset-btn" onClick={handleReset}>
          Reset
        </button>

        <div className="filter-ai-group">
          <input
            className="filter-input filter-input--ai"
            type="text"
            placeholder="Custom requirement (e.g. I want a Honda with 20 KMPL mileage)"
            value={customRequirement}
            onChange={(e) => setCustomRequirement(e.target.value)}
          />
          <button className="filter-ai-btn" onClick={handleAiSearch}>
            AI Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
