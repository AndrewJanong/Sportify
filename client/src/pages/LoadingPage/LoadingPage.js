import React from "react";
import styles from './LoadingPage.module.css';
import PuffLoader from "react-spinners/PuffLoader";

// Loading page which usually displayed when fetching data necessary to the specific page
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