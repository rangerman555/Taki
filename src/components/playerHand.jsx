import React from "react";
import Card from "./Card.jsx";

let PlayerHand = (props) => {

    let style = null;
    let handStyle = null;

    if (props.locationOnBoard == 'left') {
        style = {
            display: 'block',
            marginTop: -140,
            transform: 'rotate(90deg)',
            marginLeft: 35
         }
    } else if (props.locationOnBoard == 'right') {
        style = {
            display: 'block',
            marginTop: -140,
            transform: 'rotate(270deg)',
            marginLeft: 35
         }
    } else {
        style = {
            marginLeft: -35
        }
    }

    return (
        props.cards.map((card) => {
            if (card == props.cards[0] && props.locationOnBoard == 'left') {
                handStyle = {transform: 'rotate(90deg)', marginLeft: 35}
            } else if (card == props.cards[0] && props.locationOnBoard == 'right') {
                handStyle = {transform: 'rotate(270deg)', marginLeft: 35}
            } else if (card != props.cards[0]) {
                handStyle = style;
            } else {
                handStyle = null;
            }

            return (
                <Card 
                    key={card.id}
                    details={card}
                    style={handStyle}
                    showCards={props.showCards}
                    />
            );
        })
    );
}

export default PlayerHand;