import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExhibitorProfile = () => {
    const [profile, setProfile] = useState({
        companyName: '',
        description: '',
        website: '',
        logoUrl: '',
        products: []
    });
    const [loading, setLoading] = useState(true);

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/auth/profile', getConfig());
                const details = data.companyDetails || {};
                // Map existing data or defaults
                setProfile({
                    companyName: data.name || '', // Using user name as Main Company Name sometimes
                    companyTitle: data.name || '', // Explicit Company Title for Profile
                    description: details.description || '',
                    website: details.website || '',
                    logoUrl: details.logoUrl || '',
                    serviceType: details.serviceType || '',
                    products: details.products || []
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: profile.companyTitle, // Update Helper Name too
                companyDetails: {
                    description: profile.description,
                    website: profile.website,
                    logoUrl: profile.logoUrl,
                    serviceType: profile.serviceType,
                    // products: profile.products 
                }
            };

            await axios.put('http://localhost:5000/api/auth/profile', payload, getConfig());
            alert("Profile Updated Successfully!");
        } catch (error) {
            alert("Update Failed");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Company Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Company Title</label>
                    <input
                        name="companyTitle"
                        value={profile.companyTitle}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Short Description</label>
                    <textarea
                        name="description"
                        value={profile.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Service Type</label>
                    <select
                        name="serviceType"
                        value={profile.serviceType}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                        <option value="">Select Service Type</option>
                        <option>Technology</option>
                        <option>Consulting</option>
                        <option>Manufacturing</option>
                        <option>Education</option>
                        <option>Healthcare</option>
                        <option>Retail</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Website URL</label>
                    <input
                        name="website"
                        value={profile.website}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Logo URL</label>
                    <input
                        name="logoUrl"
                        value={profile.logoUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                        className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ExhibitorProfile;
