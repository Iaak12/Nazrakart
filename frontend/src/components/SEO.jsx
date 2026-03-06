import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ pageName }) => {
    const [seoData, setSeoData] = useState(null);

    useEffect(() => {
        const fetchSEO = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.seo && data.seo[pageName]) {
                        setSeoData(data.seo[pageName]);
                    }
                }
            } catch (error) {
                console.error("Error fetching SEO data:", error);
            }
        };

        fetchSEO();
    }, [pageName]);

    if (!seoData) return null;

    return (
        <Helmet>
            {seoData.metaTitle && <title>{seoData.metaTitle}</title>}
            {seoData.metaDescription && <meta name="description" content={seoData.metaDescription} />}
            {seoData.metaKeywords && <meta name="keywords" content={seoData.metaKeywords} />}
        </Helmet>
    );
};

export default SEO;
