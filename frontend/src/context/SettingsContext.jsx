import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const applyTheme = (currentSettings) => {
        if (!currentSettings) return;

        // Apply primary color globally
        if (currentSettings.primaryColor) {
            document.documentElement.style.setProperty('--color-tss-red', currentSettings.primaryColor);
        }

        // Apply global SEO settings
        if (currentSettings.siteTitle) {
            document.title = currentSettings.siteTitle;
        }
        if (currentSettings.siteDescription) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = "description";
                document.head.appendChild(metaDescription);
            }
            metaDescription.content = currentSettings.siteDescription;
        }
        if (currentSettings.siteKeywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = "keywords";
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = currentSettings.siteKeywords;
        }
        if (currentSettings.favicon) {
            let linkFavicon = document.querySelector('link[rel="icon"]');
            if (!linkFavicon) {
                linkFavicon = document.createElement('link');
                linkFavicon.rel = "icon";
                document.head.appendChild(linkFavicon);
            }
            linkFavicon.href = currentSettings.favicon;
        }

        // Dark mode is now handled locally by AdminLayout via the settings context
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
                applyTheme(data);
            }
        } catch (error) {
            console.error('Failed to fetch global settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const value = {
        settings,
        loading,
        refreshSettings: fetchSettings,
        applyTheme
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
