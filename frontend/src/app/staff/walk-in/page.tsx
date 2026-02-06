'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Armchair, 
  ShoppingBag, 
  CreditCard,
  Clock,
  Calendar,
  UtensilsCrossed
} from 'lucide-react';
import Navbar from '@/src/components/Navigation/Navbar';
import styles from './WalkInBooking.module.css';

interface TimeSlot {
  id: string;
  time: string;
  mealType: string;
  available: boolean;
  seatsAvailable: number;
}

export default function WalkInBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState<'dine-in' | 'takeaway' | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | null>(null);

  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Sample time slots
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '08:00 - 09:00', mealType: 'Breakfast', available: true, seatsAvailable: 15 },
    { id: '2', time: '09:00 - 10:00', mealType: 'Breakfast', available: true, seatsAvailable: 8 },
    { id: '3', time: '12:00 - 13:00', mealType: 'Lunch', available: true, seatsAvailable: 25 },
    { id: '4', time: '13:00 - 14:00', mealType: 'Lunch', available: true, seatsAvailable: 12 },
    { id: '5', time: '15:30 - 16:30', mealType: 'Snacks', available: true, seatsAvailable: 30 },
    { id: '6', time: '19:00 - 20:00', mealType: 'Dinner', available: true, seatsAvailable: 18 },
    { id: '7', time: '20:00 - 21:00', mealType: 'Dinner', available: false, seatsAvailable: 0 },
  ];

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/staff');
    }
  };

  const handleNextStep = () => {
    if (step === 1 && bookingType) {
      setStep(2);
    } else if (step === 2 && selectedSlot) {
      setStep(3);
    } else if (step === 3 && paymentMethod) {
      // Process booking
      handleCompleteBooking();
    }
  };

  const handleCompleteBooking = () => {
    // Here you would typically make an API call
    const bookingData = {
      bookingType,
      numberOfPeople,
      selectedSlot: timeSlots.find(slot => slot.id === selectedSlot),
      paymentMethod,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Booking completed:', bookingData);
    alert(`Booking successful! ${numberOfPeople} person(s) for ${bookingType}.`);
    router.push('/staff');
  };

  const calculateTotalAmount = () => {
    const basePrice = 100; // Base price per person
    return basePrice * numberOfPeople;
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div>
            <h1 className={styles.title}>Walk-in User Booking</h1>
            <p className={styles.subtitle}>Book slots for walk-in customers</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className={styles.progressSteps}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepLabel}>Booking Type</div>
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepLabel}>Time Slot</div>
          </div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepLabel}>Payment</div>
          </div>
        </div>

        {/* Current Date */}
        <div className={styles.dateSection}>
          <Calendar size={20} />
          <h2 className={styles.dateTitle}>{todayFormatted}</h2>
        </div>

        {/* Step 1: Booking Type */}
        {step === 1 && (
          <div className={styles.stepContainer}>
            <h3 className={styles.stepTitle}>Select Booking Type</h3>
            <div className={styles.bookingTypeGrid}>
              <button
                className={`${styles.bookingTypeCard} ${bookingType === 'dine-in' ? styles.selected : ''}`}
                onClick={() => setBookingType('dine-in')}
              >
                <div className={styles.bookingTypeIcon}>
                  <Armchair size={32} />
                </div>
                <h4 className={styles.bookingTypeTitle}>Dine-in</h4>
                <p className={styles.bookingTypeDescription}>Eat in the canteen with seating</p>
                {bookingType === 'dine-in' && (
                  <div className={styles.peopleSelector}>
                    <label htmlFor="peopleCount">Number of People:</label>
                    <div className={styles.peopleInput}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (numberOfPeople > 1) setNumberOfPeople(numberOfPeople - 1);
                        }}
                        className={styles.counterButton}
                      >
                        -
                      </button>
                      <span>{numberOfPeople}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (numberOfPeople < 10) setNumberOfPeople(numberOfPeople + 1);
                        }}
                        className={styles.counterButton}
                      >
                        +
                      </button>
                    </div>
                    <p className={styles.seatsNote}>
                      {numberOfPeople} seat{numberOfPeople > 1 ? 's' : ''} will be reserved
                    </p>
                  </div>
                )}
              </button>

              <button
                className={`${styles.bookingTypeCard} ${bookingType === 'takeaway' ? styles.selected : ''}`}
                onClick={() => setBookingType('takeaway')}
              >
                <div className={styles.bookingTypeIcon}>
                  <ShoppingBag size={32} />
                </div>
                <h4 className={styles.bookingTypeTitle}>Takeaway</h4>
                <p className={styles.bookingTypeDescription}>Take food to go</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Time Slot Selection */}
        {step === 2 && (
          <div className={styles.stepContainer}>
            <h3 className={styles.stepTitle}>Select Time Slot</h3>
            <div className={styles.timeSlotsGrid}>
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`${styles.timeSlotCard} ${
                    selectedSlot === slot.id ? styles.selected : ''
                  } ${!slot.available ? styles.unavailable : ''}`}
                  onClick={() => slot.available && setSelectedSlot(slot.id)}
                  disabled={!slot.available}
                >
                  <div className={styles.timeSlotHeader}>
                    <Clock size={18} />
                    <span className={styles.slotTime}>{slot.time}</span>
                    <span className={`${styles.availabilityBadge} ${
                      slot.available ? styles.available : styles.full
                    }`}>
                      {slot.available ? 'Available' : 'Full'}
                    </span>
                  </div>
                  <div className={styles.timeSlotDetails}>
                    <div className={styles.mealTypeBadge}>
                      <UtensilsCrossed size={14} />
                      {slot.mealType}
                    </div>
                    {slot.available && bookingType === 'dine-in' && (
                      <div className={styles.seatsInfo}>
                        <Armchair size={14} />
                        {slot.seatsAvailable} seats available
                      </div>
                    )}
                  </div>
                  {selectedSlot === slot.id && (
                    <div className={styles.selectedIndicator}>Selected</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className={styles.stepContainer}>
            <h3 className={styles.stepTitle}>Select Payment Method</h3>
            
            {/* Booking Summary */}
            <div className={styles.bookingSummary}>
              <h4 className={styles.summaryTitle}>Booking Summary</h4>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Type:</span>
                  <span className={styles.summaryValue}>
                    {bookingType === 'dine-in' ? 'Dine-in' : 'Takeaway'}
                  </span>
                </div>
                {bookingType === 'dine-in' && (
                  <div className={styles.summaryRow}>
                    <span>Number of People:</span>
                    <span className={styles.summaryValue}>{numberOfPeople}</span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span>Time Slot:</span>
                  <span className={styles.summaryValue}>
                    {timeSlots.find(slot => slot.id === selectedSlot)?.time}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Meal Type:</span>
                  <span className={styles.summaryValue}>
                    {timeSlots.find(slot => slot.id === selectedSlot)?.mealType}
                  </span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total Amount:</span>
                  <span className={styles.totalAmount}>₹{calculateTotalAmount()}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className={styles.paymentMethods}>
              <button
                className={`${styles.paymentMethod} ${paymentMethod === 'cash' ? styles.selected : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className={styles.paymentIcon}>💵</div>
                <div className={styles.paymentDetails}>
                  <h4 className={styles.paymentTitle}>Cash</h4>
                  <p className={styles.paymentDescription}>Pay with cash at counter</p>
                </div>
              </button>

              <button
                className={`${styles.paymentMethod} ${paymentMethod === 'card' ? styles.selected : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className={styles.paymentIcon}>
                  <CreditCard size={24} />
                </div>
                <div className={styles.paymentDetails}>
                  <h4 className={styles.paymentTitle}>Card</h4>
                  <p className={styles.paymentDescription}>Credit/Debit card payment</p>
                </div>
              </button>

              <button
                className={`${styles.paymentMethod} ${paymentMethod === 'upi' ? styles.selected : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className={styles.paymentIcon}>📱</div>
                <div className={styles.paymentDetails}>
                  <h4 className={styles.paymentTitle}>UPI</h4>
                  <p className={styles.paymentDescription}>Pay via UPI apps</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button onClick={handleBack} className={styles.secondaryButton}>
            Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={
              (step === 1 && !bookingType) ||
              (step === 2 && !selectedSlot) ||
              (step === 3 && !paymentMethod)
            }
            className={styles.primaryButton}
          >
            {step === 3 ? 'Complete Booking' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}