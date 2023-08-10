import React from "react";
import styles from "./Section.module.css";


// Section component for each section in the navigation bar
const Section = (props) => {

    return (
        <div className={`${styles.section}`}>
            <img src={require(`../../icons/${props.section}.png`)} alt="" />
            <p>{props.section}</p>
        </div>
    )
}

export default Section;