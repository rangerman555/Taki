import React from "react"

const Card = (props) => { 

    let source = null;

    if (props.details.src != "") {
        source = require(`../assets/images/${props.details.src}`)
    } 

    if (!props.showCards) {
        source = require("../assets/images/otherCards/deck.png")
    } 
    

    return (
            <img 
                src={source}
                style={props.style}
                id={props.details.id}
                width={100}
                height={180}
                onClick={props.onClick}
                />
        )   
}

export default Card;
