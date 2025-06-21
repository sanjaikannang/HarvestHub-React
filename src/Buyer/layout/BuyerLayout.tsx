import React, { useState } from 'react';
import MainComponent from '../components/MainComponent';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const BuyerLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}                    
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <Header
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />

                    {/* Main Content */}
                    <MainComponent />
                </div>
            </div>
        </>
    );
};

export default BuyerLayout;