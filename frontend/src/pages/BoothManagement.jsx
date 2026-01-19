import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BoothManagement = () => {
    const [myBooths, setMyBooths] = useState([]);
    const [loading, setLoading] = useState(true);

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    };

    useEffect(() => {
        const fetchMyBooths = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/expos/booths/mine', getConfig());
                setMyBooths(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchMyBooths();
    }, []);

    // Update products showcased
    const handleUpdate = async (boothId) => {
        const title = document.getElementById(`title-${boothId}`).value;
        const desc = document.getElementById(`desc-${boothId}`).value;
        const products = document.getElementById(`products-${boothId}`).value;

        try {
            // Update booth
            await axios.put(`http://localhost:5000/api/expos/booth/${boothId}`, {
                boothTitle: title,
                boothDescription: desc,
                productsShowcased: products.split(',').map(s => s.trim())
            }, getConfig());
            alert("Updated!");
        } catch (error) {
            alert("Failed");
        }
    };

    if (loading) return <div>Loading Booths...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">My Booths</h2>

            {myBooths.length === 0 ? (
                <div className="bg-white p-8 rounded text-center text-slate-500">
                    You have not been assigned any booths yet. <br />
                    Browse events and contact organizers to reserve a space.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myBooths.map(booth => (
                        <div key={booth._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between mb-4">
                                <h3 className="font-bold text-lg">Booth {booth.boothNumber}</h3>
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold uppercase">{booth.status}</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">Size: {booth.size} | Price: ${booth.price}</p>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Booth Title</label>
                                    <input
                                        className="w-full border p-2 rounded text-sm"
                                        defaultValue={booth.boothTitle}
                                        id={`title-${booth._id}`}
                                        placeholder="e.g. AI Demo Station"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Short Description</label>
                                    <input
                                        className="w-full border p-2 rounded text-sm"
                                        defaultValue={booth.boothDescription}
                                        id={`desc-${booth._id}`}
                                        placeholder="Briefly describe what's here"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Products Showcased (comma separated)</label>
                                    <input
                                        className="w-full border p-2 rounded text-sm"
                                        defaultValue={booth.productsShowcased?.join(', ')}
                                        id={`products-${booth._id}`}
                                    />
                                </div>
                                <button
                                    onClick={() => handleUpdate(booth._id)}
                                    className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 mt-2"
                                >
                                    Save Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Communication Section can stay or look different */}
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mt-8">
                <h3 className="font-bold text-indigo-900 mb-2">Need Help?</h3>
                <p className="text-indigo-700 text-sm">Contact the event organizer directly for inquiries about booth layouts or special requirements.</p>
                <a href="mailto:organizer@eventspheremanagement.com" className="inline-block mt-3 text-indigo-600 font-bold underline">Email Organizer</a>
            </div>
        </div>
    );
};

export default BoothManagement;
