import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactForm from './ContactForm'
import './CarCard.css'

function CarCard({ car }) {
  const navigate = useNavigate()
  const [showContactForm, setShowContactForm] = useState(false)

  const handleClick = () => {
    navigate(`/car/${car.id}`, { state: { car } })
  }

  const handleContactClick = (e) => {
    e.stopPropagation()
    setShowContactForm(true)
  }

  return (
    <>
      <div className="car-card" onClick={handleClick} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
        <div className="car-card__img-wrap">
          <img
            className="car-card__img"
            src={car.imageUrl || 'https://placehold.co/400x220?text=No+Image'}
            alt={`${car.maker} ${car.model}`}
            onError={(e) => { e.target.src = 'https://placehold.co/400x220?text=No+Image' }}
          />
          <span className="car-card__badge">{car.fuelType}</span>
        </div>

        <div className="car-card__body">
          <h3 className="car-card__title">{car.maker} {car.model}</h3>
          <p className="car-card__year-km">
            <span>{car.year}</span>
            <span className="car-card__dot">·</span>
            <span>{car.bodyType}</span>
            <span className="car-card__dot">·</span>
            <span>{car.transmission}</span>
          </p>
          <p className="car-card__desc">{car.varient}</p>
          <div className="car-card__footer">
            <span className="car-card__price">₹ {car.exShowRoomPrice?.toLocaleString()}</span>
            <span className="car-card__cta">View Details →</span>
          </div>
          <button 
            className="car-card__contact-btn"
            onClick={handleContactClick}
            title="Contact seller about this car"
          >
            📞 Contact Seller
          </button>
        </div>
      </div>

      {showContactForm && (
        <ContactForm 
          car={car} 
          onClose={() => setShowContactForm(false)}
        />
      )}
    </>
  )
}

export default CarCard
