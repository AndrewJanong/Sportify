import React from "react";
import styles from "./Section.module.css";

const Section = (props) => {

    return (
        <div className={styles.section}>
            <img src={require(`../../icons/${props.section}.png`)} alt="" />
            <p>{props.section}</p>
        </div>
    )
}

export default Section;