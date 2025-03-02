import Profile from '../profile/Profile'
import './Header.css'

function Header() {


    
    return (
        <>
            <div className="header flex justify-between items-center">
                <div className='title'>KB Board</div>
                <div className="avatar">
                    <Profile />
                </div>
            </div>

        </>
    )
}

export default Header