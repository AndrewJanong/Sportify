import React from "react";
import styles from './LoadingPage.module.css';
import PuffLoader from "react-spinners/PuffLoader";

const LoadingPage = (props) => {

    return (
        <div className={styles.page}>
            <PuffLoader
                color={'#3b62be'}
                loading={true}
                size={144}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}

export default LoadingPage;