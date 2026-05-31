import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
import './CarDetails.css'

function CarDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [showContactForm, setShowContactForm] = useState(false)

  // Car data passed via router state; fallback message if accessed directly
  const car = location.state?.car

  if (!car) {
    return (
      <div className="details-not-found">
        <p>Car not found.</p>
        <button className="details-back-btn" onClick={() => navigate('/')}>
          ← Back to Listings
        </button>
      </div>
    )
  }

  const specs = [
    { label: 'Maker', value: car.maker },
    { label: 'Model', value: car.model },
    { label: 'Variant', value: car.varient },
    { label: 'Year', value: car.year },
    { label: 'Body Type', value: car.bodyType },
    { label: 'Fuel Type', value: car.fuelType },
    { label: 'Transmission', value: car.transmission },
    { label: 'Mileage', value: car.mileage ? `${car.mileage} kmpl` : null },
    { label: 'Engine', value: car.engineCC ? `${car.engineCC} cc` : null },
    { label: 'Power', value: car.powerBhp ? `${car.powerBhp} bhp` : null },
    { label: 'Torque', value: car.torqueNm ? `${car.torqueNm} Nm` : null },
    { label: 'Seating', value: car.seatCapacity ? `${car.seatCapacity} seats` : null },
    { label: 'Safety Rating', value: car.safetyRating ? `${car.safetyRating} / 5` : null },
  ]

  return (
    <div className="details-page">
      <div className="details-container">
        <button className="details-back-btn" onClick={() => navigate(-1)}>
          ← Back to Listings
        </button>

        <div className="details-card">
          <div className="details-img-wrap">
            <img
              className="details-img"
              src={car.imageUrl || 'https://placehold.co/800x450?text=No+Image'}
              alt={`${car.maker} ${car.model}`}
              onError={(e) => { e.target.src = 'https://placehold.co/800x450?text=No+Image' }}
            />
            <span className="details-fuel-badge">{car.fuelType}</span>
          </div>

          <div className="details-content">
            <div className="details-top">
              <div>
                <h1 className="details-title">{car.maker} {car.model}</h1>
                <p className="details-subtitle">{car.year} · {car.bodyType} · {car.transmission}</p>
              </div>
              <div className="details-price">₹ {car.exShowRoomPrice?.toLocaleString()}</div>
            </div>

            <p className="details-description">{car.varient}</p>

            <h2 className="details-specs-heading">Specifications</h2>
            <div className="details-specs-grid">
              {specs.map((spec) => (
                <div key={spec.label} className="details-spec-item">
                  <span className="details-spec-label">{spec.label}</span>
                  <span className="details-spec-value">{spec.value || '—'}</span>
                </div>
              ))}
            </div>

            <button className="details-contact-btn" onClick={() => setShowContactForm(true)}>
              Contact Seller
            </button>
          </div>
        </div>
      </div>

      {showContactForm && (
        <ContactForm
          car={car}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  )
}

export default CarDetails
