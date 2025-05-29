import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import Loader from '../components/Loader/Loader';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminAnalytics = () => {
    const [byGenre, setByGenre] = useState(null);
    const [byStatus, setByStatus] = useState(null);

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Sales by genre this year
                const genreResponse = await axios.get(
                    "http://localhost:1000/api/v1/stats/genre-sales-year",
                    { headers }
                );
                setByGenre(genreResponse.data);

                // Order status distribution
                const statusResponse = await axios.get(
                    "http://localhost:1000/api/v1/stats/status-distribution",
                    { headers }
                );
                setByStatus(statusResponse.data);

            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    if (!byGenre || !byStatus) {
        return (
            <div className='h-[100%] flex items-center justify-center'>
                <Loader />
            </div>
        );
    }

    const genreLabels = byGenre.map(item => item._id);
    const genreData = byGenre.map(item => item.count);

    const statusLabels = byStatus.map(x => x._id);
    const statusData = byStatus.map(x => x.count);
    const statusColors = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];

    return (
        <div className='p-4 md:p-8 space-y-8'>
            <h1 className='text-3xl md-text-5xl font-semibold text-zinc-500 mb-8'>Analytics Dashboard</h1>

            {/* Bar Chart: Books Sold by Genre */}
            <div className='bg-zinc-800 p-6 rounded'>
                <h2 className='text-xl text-yellow-100 mb-4'>
                    Books Sold by Genre ({new Date().getFullYear()})
                </h2>
                <div className='relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]'>
                    <Bar
                        data={{
                            labels: genreLabels,
                            datasets: [{
                                label: 'Nr. cărți vândute',
                                data: genreData,
                                backgroundColor: 'rgba(255, 206, 86, 0.6)'
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: false }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Pie Chart: Order Status Distribution */}
            <div className='bg-zinc-800 p-6 rounded'>
                <h2 className='text-xl text-yellow-100 mb-4'>
                    Order Distribution by Status ({new Date().getFullYear()})
                </h2>
                <div className='relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]'>
                    <Pie
                        data={{
                            labels: statusLabels,
                            datasets: [{
                                data: statusData,
                                backgroundColor: statusColors.slice(0, statusLabels.length),
                                hoverOffset: 8
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'right' },
                                title: { display: false }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
