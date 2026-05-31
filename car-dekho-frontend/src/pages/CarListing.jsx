import { useState, useEffect, useRef, useCallback } from 'react'
import CarCard from '../components/CarCard'
import FilterBar from '../components/FilterBar'
import './CarListing.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1'
const PAGE_LIMIT = 12

function CarListing() {
  const initialFilters = {
    maker: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '', search: '',
  }

  const [cars, setCars] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('normal')
  const [lastAiQuery, setLastAiQuery] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [throttledFilters, setThrottledFilters] = useState(initialFilters)

  const loaderRef = useRef(null)
  const throttleTimeoutRef = useRef(null)
  const pendingFiltersRef = useRef(initialFilters)
  const hasMore = nextCursor !== null

  const handleFilterChange = (updatedFilters) => {
    setMode('normal')
    setFilters(updatedFilters)
  }

  const handleAiSearch = async (queryText) => {
    setMode('ai')
    setLastAiQuery(queryText)
    setInitialLoading(true)
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/ai-recommended-cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, limit: 24 }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setCars(Array.isArray(data.cars) ? data.cars : [])
      setNextCursor(null)
    } catch (err) {
      setError(err.message)
      setCars([])
      setNextCursor(null)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const fetchCars = useCallback(async (cursor = null, currentFilters = initialFilters, reset = false) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: PAGE_LIMIT })
      if (cursor) params.set('cursor', cursor)

      const hasActiveFilters = Object.values(currentFilters).some(
        (value) => String(value).trim() !== ''
      )

      let endpoint = `${API_BASE}/home?${params}`
      if (hasActiveFilters) {
        if (currentFilters.search) params.set('search', currentFilters.search)
        if (currentFilters.maker) params.set('maker', currentFilters.maker)
        if (currentFilters.fuelType) params.set('fuelType', currentFilters.fuelType)
        if (currentFilters.transmission) params.set('transmission', currentFilters.transmission)
        if (currentFilters.minPrice) params.set('minPrice', currentFilters.minPrice)
        if (currentFilters.maxPrice) params.set('maxPrice', currentFilters.maxPrice)
        endpoint = `${API_BASE}/get-filtered-cars?${params}`
      }

      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      setCars((prev) => reset ? data.cars : [...prev, ...data.cars])
      setNextCursor(data.nextCursor)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [])

  // Throttle filter-driven fetch updates to avoid firing API on every keystroke.
  useEffect(() => {
    pendingFiltersRef.current = filters

    if (throttleTimeoutRef.current) return

    throttleTimeoutRef.current = setTimeout(() => {
      setThrottledFilters(pendingFiltersRef.current)
      throttleTimeoutRef.current = null
    }, 800)
  }, [filters])

  useEffect(() => {
    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
    }
  }, [])

  // Initial load
  useEffect(() => {
    if (mode !== 'normal') return
    setInitialLoading(true)
    setCars([])
    setNextCursor(null)
    fetchCars(null, throttledFilters, true)
  }, [fetchCars, throttledFilters, mode])

  // IntersectionObserver – load next page when sentinel enters view
  useEffect(() => {
    if (mode !== 'normal') return
    if (!loaderRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchCars(nextCursor, throttledFilters, false)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, nextCursor, fetchCars, throttledFilters, mode])

  return (
    <div className="listing-page">
      <FilterBar onFilterChange={handleFilterChange} onAiSearch={handleAiSearch} />

      <main className="listing-main">
        <div className="listing-header">
          <h2 className="listing-title">Used Cars</h2>
          <span className="listing-count">
            {mode === 'ai' ? `AI recommendations (${cars.length})` : `${cars.length} cars loaded`}
          </span>
        </div>

        {mode === 'ai' && lastAiQuery && (
          <p className="listing-ai-note">Showing AI results for: "{lastAiQuery}"</p>
        )}

        {initialLoading ? (
          <div className="listing-skeleton-grid">
            {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton--img" />
                <div className="skeleton-body">
                  <div className="skeleton skeleton--title" />
                  <div className="skeleton skeleton--text" />
                  <div className="skeleton skeleton--text skeleton--short" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="listing-error">
            <p>Failed to load cars: {error}</p>
            <button onClick={() => (
              mode === 'ai'
                ? handleAiSearch(lastAiQuery)
                : fetchCars(null, throttledFilters, true)
            )}>Retry</button>
          </div>
        ) : cars.length === 0 ? (
          <div className="listing-empty">
            <p>No cars match your filters. Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <div className="listing-grid">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {mode === 'normal' && (
              <div ref={loaderRef} className="listing-sentinel">
                {loading && !initialLoading && (
                  <div className="listing-spinner">
                    <span className="spinner" />
                    <span>Loading more cars…</span>
                  </div>
                )}
                {!hasMore && !loading && cars.length > 0 && (
                  <p className="listing-end">You've seen all {cars.length} cars</p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default CarListing
