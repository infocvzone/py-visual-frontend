import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import EditElement from './EditElement';




function EditPanel() {

    const navigate = useNavigate();
    const location = useLocation();
    const { type, element } = location.state;

    return (
        <div className="min-h-screen flex flex-col antialiased">
            <Header />
            <Sidebar />
            {/* Main content area */}
            <div className="flex-grow p-4 ml-64 mt-14"> {/* Adjust margin and padding */}
                <EditElement type={type} element={element} />
            </div>
        </div>
    );
}

export default EditPanel;
