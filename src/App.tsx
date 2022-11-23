import React, { PropsWithChildren } from "react";
import { connect } from "react-redux";
import { RootState, AppDispatch as Dispatch } from "./store/store";

import Designer from "./components/Designer";
import Palette from "./components/Palette";


import styles from "./App.module.less";
import "./icons/index";

interface IProps extends PropsWithChildren{
}

const App: React.FC<IProps> = (props) => {

    return (
        <div className={styles.box}>
            <Designer />
            <Palette />
        </div>
    )
}

export default App;