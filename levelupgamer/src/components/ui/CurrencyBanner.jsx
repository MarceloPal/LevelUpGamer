import { useState, useEffect } from 'react';

const CurrencyBanner = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseCurrency = 'USD';
  const targetCurrencies = ['CLP', 'EUR', 'GBP', 'JPY', 'BRL', 'ARS', 'PEN', 'MXN'];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/2d1d2824596c7f84e25a15f8/latest/${baseCurrency}`);
        const data = await response.json();
        
        if (data.result === "success") {
          const filteredRates = {};
          targetCurrencies.forEach(currency => {
            filteredRates[currency] = data.conversion_rates[currency];
          });
          setRates(filteredRates);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    // Actualizar cada hora
    const interval = setInterval(fetchRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="currency-banner">
        <div className="container">
          <div className="currency-banner-content">
            <span>Cargando tasas de cambio...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="currency-banner">
      <div className="container">
        <div className="currency-banner-content">
          {rates && Object.entries(rates).map(([currency, rate]) => (
            <div key={currency} className="currency-item">
              <span className="currency-symbol">{currency}</span>
              <span className="currency-rate">
                1 {baseCurrency} = {rate.toFixed(2)} {currency}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyBanner;