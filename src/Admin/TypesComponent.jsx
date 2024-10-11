import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import TypeComponent from './Type';
import AddElement from './AddElement';

function TypesComponent() {
    return (
        <div className="min-h-screen flex flex-col antialiased">
            <Header />
            <Sidebar />
            {/* Main content area */}
            <div className="flex-grow p-4 ml-64 mt-14"> {/* Adjust margin and padding */}
                <TypeComponent />
            </div>
        </div>
    );
}

export default TypesComponent;
