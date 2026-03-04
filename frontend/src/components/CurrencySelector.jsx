import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { MdLanguage } from 'react-icons/md';

const CurrencySelector = () => {
    const { currency, changeCurrency, availableCurrencies, currencyNames, getSymbol } = useCurrency();

    return (
        <div className="relative inline-block">
            <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="appearance-none pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-gray-400 cursor-pointer"
            >
                {availableCurrencies.map((curr) => (
                    <option key={curr} value={curr}>
                        {curr} ({currencyNames[curr]})
                    </option>
                ))}
            </select>
            <MdLanguage className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
    );
};

export default CurrencySelector;
