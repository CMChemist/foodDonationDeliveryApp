import React from 'react'

const Contact = (props) => {
    console.log("Contact props = ", props)
    if (props.user.locations) {
        
        console.log(props.user.locations[0].address)
        return (
            <div>
                <h4>Contact:</h4>
                <p>{props.user.locations[0].address}</p>
                <p>{props.user.phoneNum}</p>

            </div>
        );
    } else {
        return null;
    }
    
    
};

export default Contact