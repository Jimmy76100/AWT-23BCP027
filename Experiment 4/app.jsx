import { useState } from 'react'
import './App.css'
// Import the new component
import UserProfile from './UserProfile' 

function App() {
  return (
    <>
      <div>
        <h1>React Authentication Demo</h1>
        {/* Place the component here */}
        <UserProfile />
      </div>
    </>
  )
}

export default App
