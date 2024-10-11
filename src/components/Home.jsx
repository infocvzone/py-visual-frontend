import React from 'react'
import ButtonComponent from './buttonComponet'
import TextComponent from './textComponent'

function Home() {
    return (
        <div>
            <div>
                <h1>My React App</h1>
                {/* Button with custom properties */}
                <ButtonComponent
                    text="Custom Button"
                    idleColor="#4CAF50"     // Green idle color
                    hoverColor="#81C784"    // Light green hover color
                    clickedColor="#388E3C"  // Dark green clicked color
                    textColor="#FFFFFF"     // White text
                    width={200}             // Width 200px
                    height={60}             // Height 60px
                />
                <TextComponent
                color='#81C784'
                fontFamily='sans-serif'
                />
            </div>
        </div>
    )
}

export default Home
