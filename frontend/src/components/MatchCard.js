import React, {Fragment} from 'react'

const MatchCard = (props) => {
    const foodBanksInfo = () => {
        return props.matches.map((match,idx) => {
            return <Fragment key={idx}>
                    {match.foodBank.name}<br/>
                    {match.foodBank.locations[0].address}<br/>
                    {match.foodBank.phoneNum}<br/><br/>
                </Fragment>
        }) 

    }
    if (props.matches.length !== 0 ) {
        return (
            <div>
                <p>
                    Donation:<br/>
                    {props.matches[0].donor_user_item.item.name}<br/><br/>
                    Driver:<br/>
                    {props.matches[0].driver.name}<br/>
                    {props.matches[0].driver.locations[0].address}<br/>
                    {props.matches[0].driver.phoneNum}<br/><br/>
                    Pick Up Location:<br/>
                    {props.matches[0].donor_user_item.user.name}<br/>
                    {props.matches[0].donor_user_item.user.locations[0].address}<br/>
                    {props.matches[0].donor_user_item.user.phoneNum}<br/><br/>
                    Deliver Locations:<br/>
                    {foodBanksInfo()}
                </p>
            </div>
        );
    } else {
        return null
    }
    
}

export default MatchCard