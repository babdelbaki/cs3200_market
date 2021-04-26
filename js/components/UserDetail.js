import React, { useState  } from 'react';

const UserDetail = ({ match }) => {
    // function based view
    const [user, setUser] = useState()

    return(
        <div>
            <h2> {match.params.userId}'s Profile</h2>
        </div>
    )

}

export default UserDetail