import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

// Exchange rates (base USD)
const exchangeRates = {
    USD: 1,
    INR: 83.12,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
    CAD: 1.35,
    AUD: 1.53,
    JPY: 149.50,
    CNY: 7.19,
};

const currencySymbols = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CNY: '¥',
};

const currencyNames = {
    USD: 'US Dollar',
    INR: 'Indian Rupee',
    EUR: 'Euro',
    GBP: 'British Pound',
    AED: 'UAE Dirham',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    JPY: 'Japanese Yen',
    CNY: 'Chinese Yuan',
};

// Country to currency mapping
const countryToCurrency = {
    US: 'USD',
    IN: 'INR',
    GB: 'GBP',
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    AE: 'AED',
    CA: 'CAD',
    AU: 'AUD',
    JP: 'JPY',
    CN: 'CNY',
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');
    const [country, setCountry] = useState('US');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to detect user's country
        detectCountry();
    }, []);

    const detectCountry = async () => {
        try {
            // Check localStorage first
            const savedCurrency = localStorage.getItem('preferredCurrency');
            if (savedCurrency && exchangeRates[savedCurrency]) {
                setCurrency(savedCurrency);
                setLoading(false);
                return;
            }

            // Try to detect via timezone (simple approach)
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
                setCountry('IN');
                setCurrency('INR');
            } else if (timezone.includes('Europe/London')) {
                setCountry('GB');
                setCurrency('GBP');
            } else if (timezone.includes('Europe/')) {
                setCountry('DE');
                setCurrency('EUR');
            } else if (timezone.includes('Asia/Dubai')) {
                setCountry('AE');
                setCurrency('AED');
            } else if (timezone.includes('Australia/')) {
                setCountry('AU');
                setCurrency('AUD');
            } else if (timezone.includes('Asia/Tokyo')) {
                setCountry('JP');
                setCurrency('JPY');
            } else if (timezone.includes('America/Toronto') || timezone.includes('America/Vancouver')) {
                setCountry('CA');
                setCurrency('CAD');
            } else {
                // Default to USD
                setCountry('US');
                setCurrency('USD');
            }
        } catch (error) {
            console.error('Failed to detect country:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeCurrency = (newCurrency) => {
        if (exchangeRates[newCurrency]) {
            setCurrency(newCurrency);
            localStorage.setItem('preferredCurrency', newCurrency);
        }
    };

    const formatPrice = (priceInUSD) => {
        const convertedPrice = priceInUSD * exchangeRates[currency];
        const symbol = currencySymbols[currency];

        // Format based on currency
        if (currency === 'JPY') {
            return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
        }

        if (currency === 'INR') {
            // Indian number formatting (lakhs, crores)
            return `${symbol}${convertedPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        }

        return `${symbol}${convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getSymbol = () => currencySymbols[currency];
    const getName = () => currencyNames[currency];
    const getRate = () => exchangeRates[currency];

    return (
        <CurrencyContext.Provider value={{
            currency,
            country,
            loading,
            changeCurrency,
            formatPrice,
            getSymbol,
            getName,
            getRate,
            availableCurrencies: Object.keys(exchangeRates),
            currencyNames
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export default CurrencyContext;
